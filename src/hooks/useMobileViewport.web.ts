import { useEffect } from 'react';

export const useMobileViewport = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (viewport && viewport.scale !== 1) return;
        root.style.setProperty(`--wages-mobile-height`, `${viewport?.height ?? window.innerHeight}px`);
        const field = document.activeElement;
        if (field instanceof HTMLInputElement) field.scrollIntoView({ block: `nearest`, inline: `nearest` });
      });
    };

    update();
    viewport?.addEventListener(`resize`, update);
    window.addEventListener(`resize`, update);
    return () => {
      window.cancelAnimationFrame(frame);
      viewport?.removeEventListener(`resize`, update);
      window.removeEventListener(`resize`, update);
      root.style.removeProperty(`--wages-mobile-height`);
    };
  }, [enabled]);
};
