import { createContext, useContext } from 'react';
import type { ThemePresets } from '@/src/types/Themes';

interface Prefers {
  theme: ThemePresets;
  switchTheme: (type: ThemePresets) => void;
}

export const ThemeContext = createContext<Prefers>({
  theme: 'light',
  switchTheme: () => {
    return;
  },
});

export const usePrefers = (): Prefers => useContext(ThemeContext);
