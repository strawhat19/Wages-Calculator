import { Icon } from './ui';
import type { MobileTab } from '../hooks/useMobileNavigation';
import { Calculator, ChartNoAxesColumn, BookOpen, Ellipsis } from 'lucide-react-native';

const tabs = [
  { value: `income`, label: `Income`, icon: Calculator },
  { value: `results`, label: `Pay`, icon: ChartNoAxesColumn },
  { value: `guides`, label: `Guides`, icon: BookOpen },
  { value: `more`, label: `More`, icon: Ellipsis },
] as const;

export const MobileTabs = ({ activeTab, onChange }: {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
}) => (
  <nav id={`app-bottom-nav`} className={`app-bottom-nav`} aria-label={`Mobile views`}>
    {tabs.map(({ value, label, icon }) => (
      <button
        key={value}
        type={`button`}
        aria-controls={value}
        aria-pressed={activeTab === value}
        onClick={() => onChange(value)}
        id={`mobile-nav-button-${value}`}
        className={`mobile-nav-button${activeTab === value ? ` mobile-nav-button-active` : ``}`}
      >
        <Icon
          size={21}
          icon={icon}
          color={`currentColor`}
          className={`mobile-nav-icon`}
          id={`mobile-nav-icon-${value}`}
        />
        <span id={`mobile-nav-label-${value}`} className={`mobile-nav-label`}>
          {label}
        </span>
      </button>
    ))}
  </nav>
);
