'use client';

import { store } from '@/redux';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 500,
      delay: 0,
      offset: 0,
    });
  }, []);

  return <Provider store={store}>{children}</Provider>;
}