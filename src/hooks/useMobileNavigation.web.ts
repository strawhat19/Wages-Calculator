import type { MobileTab } from './useMobileNavigation';
import { useState, useEffect, useCallback } from 'react';

const readTab = (): MobileTab => {
  if (typeof window === `undefined`) return `income`;
  const hash = window.location.hash.slice(1);
  return hash === `results` || hash === `guides` || hash === `more` ? hash : `income`;
};

export const useMobileNavigation = () => {
  const [activeTab, setActiveTab] = useState<MobileTab>(readTab);

  useEffect(() => {
    const synchronize = () => setActiveTab(readTab());
    window.addEventListener(`popstate`, synchronize);
    window.addEventListener(`hashchange`, synchronize);
    return () => {
      window.removeEventListener(`popstate`, synchronize);
      window.removeEventListener(`hashchange`, synchronize);
    };
  }, []);

  const navigate = useCallback((tab: MobileTab) => {
    if (window.location.hash !== `#${tab}`) {
      window.history.pushState(null, ``, `${window.location.pathname}${window.location.search}#${tab}`);
    }
    setActiveTab(tab);
  }, []);

  const goHome = useCallback(() => {
    if (window.location.hash || window.location.search) window.history.pushState(null, ``, `/`);
    setActiveTab(`income`);
  }, []);

  return { activeTab, navigate, goHome };
};
