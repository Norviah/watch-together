import { createContext, useContext } from 'react';

import type { Context } from 'react';
import type { ThemePreference } from '@/src/types/ThemePreference';

import * as themes from '@/src/util/themes';

/**
 * The context that is responsible for managing the user's theme preference.
 *
 * In a React application, data is passed top-down via properties, but this
 * method of passing data can be difficult to use in some cases. Context
 * provides a way to pass data through the component tree without having to
 * manually pass properties.
 *
 * In this case, we are creating a context that will be used to manage the
 * user's theme preference, this will be implemented in the `App` component,
 * essentially allowing all child components to access the active theme.
 * @see https://reactjs.org/docs/context.html
 */
export const ThemeContext: Context<ThemePreference> = createContext<ThemePreference>({
  theme: themes.DEFAULT,
  setTheme: () => null,
});

/**
 * The hook that will be used to access the current active theme.
 *
 * As `ThemeContext` creates a new context object within the React application,
 * a `useContext` hook will be needed to access the context within components.
 * @returns The current active theme.
 */
export function useTheme(): ThemePreference {
  return useContext(ThemeContext);
}
