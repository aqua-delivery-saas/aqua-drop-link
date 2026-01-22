import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export const useMetaPixel = () => {
  const location = useLocation();

  useEffect(() => {
    // Dispara PageView em cada mudança de rota
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);
};

export const MetaPixelTracker = () => {
  useMetaPixel();
  return null;
};
