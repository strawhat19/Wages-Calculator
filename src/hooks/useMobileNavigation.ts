import { useState } from 'react';

export type MobileTab = `income` | `results` | `guides` | `more`;

export const useMobileNavigation = () => {
  const [activeTab, setActiveTab] = useState<MobileTab>(`income`);
  const navigate = (tab: MobileTab) => setActiveTab(tab);
  const goHome = () => setActiveTab(`income`);

  return { activeTab, navigate, goHome };
};
