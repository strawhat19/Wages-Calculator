import type { CalculatorInputs } from '../lib/calculator';
import { useRef, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { numericValue, sanitizeNumber, createDefaultInputs } from '../lib/calculator';

type StorageStatus = `loading` | `saved` | `saving` | `unavailable`;
type InputUpdate = (current: CalculatorInputs) => CalculatorInputs;

const storageKey = `@wages-calculator/inputs/v1`;
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === `object` && !Array.isArray(value);

const normalizeNumber = (value: unknown, fallback: string, maximum: number) => {
  if (typeof value === `number`) return Number.isFinite(value) ? `${Math.min(maximum, Math.max(0, value))}` : fallback;
  if (typeof value !== `string` || value.length > 24 || !/^\d*\.?\d*$/.test(value)) return fallback;
  return numericValue(value) > maximum ? `${maximum}` : value;
};

const normalizeInputs = (value: unknown): CalculatorInputs => {
  const defaults = createDefaultInputs();
  if (!isRecord(value)) return defaults;
  return {
    mode: value.mode === `salary` ? `salary` : `hourly`,
    taxRate: normalizeNumber(value.taxRate, defaults.taxRate, 100),
    daysPerWeek: normalizeNumber(value.daysPerWeek, defaults.daysPerWeek, 7),
    weeklyHours: normalizeNumber(value.weeklyHours, defaults.weeklyHours, 168),
    weeksPerYear: normalizeNumber(value.weeksPerYear, defaults.weeksPerYear, 52),
    hourlyRate: normalizeNumber(value.hourlyRate, defaults.hourlyRate, 1_000_000),
    annualSalary: normalizeNumber(value.annualSalary, defaults.annualSalary, 1_000_000_000),
  };
};

export const useCalculator = () => {
  const mounted = useRef(true);
  const editRevision = useRef(0);
  const saveRevision = useRef(0);
  const [ready, setReady] = useState(false);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const [inputs, setInputs] = useState(createDefaultInputs);
  const hydratedInputs = useRef<CalculatorInputs | null>(inputs);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>(`loading`);

  useEffect(() => {
    let cancelled = false;
    mounted.current = true;
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const parsed: unknown = stored ? JSON.parse(stored) : null;
        const nextInputs = normalizeInputs(isRecord(parsed) && parsed.version === 1 ? parsed.inputs : null);
        if (cancelled) return;
        if (editRevision.current === 0) {
          hydratedInputs.current = nextInputs;
          setInputs(nextInputs);
        }
        setStorageStatus(`saved`);
      } catch {
        if (cancelled) return;
        setStorageStatus(`unavailable`);
      } finally {
        if (!cancelled) setReady(true);
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
      mounted.current = false;
      saveRevision.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!ready || inputs === hydratedInputs.current) return;
    const revision = ++saveRevision.current;
    setStorageStatus(`saving`);
    const timeout = setTimeout(() => {
      const stored = JSON.stringify({ version: 1, inputs });
      const save = pendingSave.current.catch(() => undefined).then(() => AsyncStorage.setItem(storageKey, stored));
      pendingSave.current = save;
      void save.then(() => {
        if (mounted.current && revision === saveRevision.current) setStorageStatus(`saved`);
      }, () => {
        if (mounted.current && revision === saveRevision.current) setStorageStatus(`unavailable`);
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [inputs, ready]);

  const changeInputs = useCallback((update: InputUpdate) => {
    editRevision.current += 1;
    setInputs(update);
  }, []);

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    changeInputs((current) => normalizeInputs({
      ...current,
      [key]: key !== `mode` && typeof value === `string` ? sanitizeNumber(value) : value,
    }));
  }, [changeInputs]);

  const reset = useCallback(() => changeInputs(createDefaultInputs), [changeInputs]);
  return { ready, inputs, reset, updateInput, storageStatus };
};
