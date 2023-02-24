import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

/**
 * The main color palette used throughout the application.
 *
 * The colors specified here are referenced from the `Nord` color scheme, these
 * colors will be used as a base for the light and dark themes.
 * @see https://www.nordtheme.com
 */
export const COLORS = {
  primary: {
    main: '#81A1C1',
  },
  secondary: {
    main: '#5E81AC',
  },
  error: {
    main: '#BF616A',
  },
  warning: {
    main: '#EBCB8B',
  },
  info: {
    main: '#88C0D0',
  },
  success: {
    main: '#A3BE8C',
  },
};

/**
 * The light theme.
 */
export const LIGHT: Theme = createTheme({
  palette: { mode: 'light', divider: '#E5E9F0', ...COLORS },
});

/**
 * The dark theme.
 */
export const DARK: Theme = createTheme({
  palette: {
    mode: 'dark',
    divider: '#4C566A',
    background: { paper: '#2E3440', default: '#2E3440' },
    ...COLORS,
  },
});
