import { useEffect, useRef } from 'react';
import { bindHeaderMenus, renderHeaderMenu } from '../../site/navigation.mjs';

const headerMarkup = { __html: renderHeaderMenu(`calculator`, `/`) };

export const HeaderMenu = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) return bindHeaderMenus(container.current);
  }, []);

  return (
    <div
      ref={container}
      id={`calculator-header-menu`}
      className={`calculator-header-menu`}
      dangerouslySetInnerHTML={headerMarkup}
    />
  );
};
