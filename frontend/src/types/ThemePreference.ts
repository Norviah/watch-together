import type { ThemePresets } from '@/src/types/Themes';

/**
 * Defines the structure to implement when creating a context that will be used
 * to manage the user's theme preference.
 *
 * In a React application, data is passed top-down via properties, but this
 * method can be difficult to use in some cases. The `Context` API provides a
 * way to pass data through the component tree without having to manually pass
 * properties.
 *
 * `ThemePreference` represents the structure that will be used to manage the
 * user's theme preference, which will be implemented within the `App`
 * component.
 */
export interface ThemePreference {
  /**
   * Represents the current active theme.
   */
  theme: ThemePresets;

  /**
   * A function that will be used to switch the active theme.
   *
   * When implementing this function within the `App` component, we will assign
   * a function that will update the theme within the `App` component's state to
   * this property, allowing all child components to change the theme, thus
   * forcing the application to re-render.
   * @param theme The theme to switch to.
   */
  setTheme: (theme: ThemePresets) => void;
}
