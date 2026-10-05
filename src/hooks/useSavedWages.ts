import { normalizeInputs } from './useCalculator';
import { calculateWages } from '../lib/calculator';
import type { CalculatorInputs } from '../lib/calculator';
import { useRef, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedWage = {
  id: string;
  savedAt: number;
  inputs: CalculatorInputs;
};

type StorageStatus = `loading` | `saved` | `saving` | `unavailable`;

const storageKey = `@wages-calculator/saved-wages/v1`;
const numericKeys: Array<Exclude<keyof CalculatorInputs, `mode`>> = [
  `taxRate`,
  `hourlyRate`,
  `weeklyHours`,
  `daysPerWeek`,
  `annualSalary`,
  `weeksPerYear`,
];

const isRecord = (value: unknown): value is Record<string, unknown> => (
  value !== null && typeof value === `object` && !Array.isArray(value)
);

const hasStoredInputs = (value: unknown) => {
  if (!isRecord(value) || (value.mode !== `salary` && value.mode !== `hourly`)) return false;

  return numericKeys.every((key) => {
    const number = value[key];
    if (typeof number === `number`) return Number.isFinite(number);
    return typeof number === `string` && number.length <= 24 && /^\d*\.?\d*$/.test(number);
  });
};

const getWageKey = (inputs: CalculatorInputs) => {
  const wages = calculateWages(inputs);
  return JSON.stringify([
    wages.taxRate,
    wages.daysPerWeek,
    wages.weeksPerYear,
    wages.hoursPerWeek,
    Math.round(wages.annualGross * 100),
  ]);
};

const readSavedWages = (value: unknown): SavedWage[] => {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.savedWages)) {
    throw new Error(`Saved wages storage has an unsupported format.`);
  }

  const entries: SavedWage[] = [];
  for (const entry of value.savedWages) {
    if (!isRecord(entry) || typeof entry.id !== `string` || !entry.id.trim()) continue;
    if (typeof entry.savedAt !== `number` || !Number.isFinite(entry.savedAt) || entry.savedAt < 0) continue;
    if (!hasStoredInputs(entry.inputs)) continue;

    entries.push({
      id: entry.id,
      savedAt: entry.savedAt,
      inputs: normalizeInputs(entry.inputs),
    });
  }

  const ids = new Set<string>();
  const wageKeys = new Set<string>();
  return entries.sort((first, second) => second.savedAt - first.savedAt).filter((entry) => {
    const wageKey = getWageKey(entry.inputs);
    if (ids.has(entry.id) || wageKeys.has(wageKey)) return false;
    ids.add(entry.id);
    wageKeys.add(wageKey);
    return true;
  });
};

export const useSavedWages = () => {
  const mounted = useRef(true);
  const hydrated = useRef(false);
  const saveRevision = useRef(0);
  const [ready, setReady] = useState(false);
  const savedWagesRef = useRef<SavedWage[]>([]);
  const [savedWages, setSavedWages] = useState<SavedWage[]>([]);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const [storageStatus, setStorageStatus] = useState<StorageStatus>(`loading`);

  useEffect(() => {
    let cancelled = false;
    mounted.current = true;
    hydrated.current = false;
    setReady(false);

    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const nextWages = stored ? readSavedWages(JSON.parse(stored)) : [];
        if (cancelled) return;
        savedWagesRef.current = nextWages;
        setSavedWages(nextWages);
        setStorageStatus(`saved`);
      } catch {
        if (cancelled) return;
        setStorageStatus(`unavailable`);
      } finally {
        if (!cancelled) {
          hydrated.current = true;
          setReady(true);
        }
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
      mounted.current = false;
      hydrated.current = false;
      saveRevision.current += 1;
    };
  }, []);

  const persistWages = useCallback((nextWages: SavedWage[]) => {
    savedWagesRef.current = nextWages;
    setSavedWages(nextWages);
    const revision = ++saveRevision.current;
    setStorageStatus(`saving`);

    const stored = JSON.stringify({ version: 1, savedWages: nextWages });
    const save = pendingSave.current.catch(() => undefined).then(() => AsyncStorage.setItem(storageKey, stored));
    pendingSave.current = save;

    void save.then(() => {
      if (mounted.current && revision === saveRevision.current) setStorageStatus(`saved`);
    }, () => {
      if (mounted.current && revision === saveRevision.current) setStorageStatus(`unavailable`);
    });
  }, []);

  const saveWage = useCallback((inputs: CalculatorInputs): string | null => {
    if (!mounted.current || !hydrated.current) return null;
    const normalized = normalizeInputs(inputs);
    const wageKey = getWageKey(normalized);
    const existing = savedWagesRef.current.find((entry) => getWageKey(entry.inputs) === wageKey);
    if (existing) return existing.id;

    const savedAt = Date.now();
    let id: string;
    do {
      id = `wage-${savedAt.toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    } while (savedWagesRef.current.some((entry) => entry.id === id));

    persistWages([{ id, savedAt, inputs: normalized }, ...savedWagesRef.current]);
    return id;
  }, [persistWages]);

  const removeWage = useCallback((id: string) => {
    if (!mounted.current || !hydrated.current) return;
    const nextWages = savedWagesRef.current.filter((entry) => entry.id !== id);
    if (nextWages.length === savedWagesRef.current.length) return;
    persistWages(nextWages);
  }, [persistWages]);

  return { ready, savedWages, saveWage, removeWage, storageStatus };
};
