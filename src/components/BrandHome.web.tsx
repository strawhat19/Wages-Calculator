import type { ReactNode } from 'react';

export const BrandHome = ({ children, onHome }: { children: ReactNode; onHome: () => void }) => (
  <a
    href={`/`}
    id={`app-brand-link`}
    className={`app-brand-link`}
    aria-label={`Wages Calculator home`}
    onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      onHome();
    }}
  >
    {children}
  </a>
);
