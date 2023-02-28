/**
 * The available themes.
 *
 * `Themes` represents the actual themes that will be implemented into the
 * application.
 */
export type Themes = 'light' | 'dark';

/**
 * The available theme presets.
 *
 * This differs from `Themes` in that it represents the presets that the user
 * can choose from. This is used to determine which theme to use.
 */
export type ThemePresets = Themes | 'system';
