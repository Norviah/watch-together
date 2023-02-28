import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useTheme } from '@/src/util/useTheme';
import { Divider, IconButton } from '@mui/material';
import { useState } from 'react';

import type { ThemePresets, Themes } from '@/src/types/Themes';

import * as themes from '@/src/util/themes';

/**
 * The theme toggler component.
 *
 * `ThemeToggler` acts as the theme manager for the application, allowing the
 * user to change the theme of the application. The component provides the user
 * with a menu of the following options:
 * - `Light Mode`
 * - `Dark Mode`
 * - `System`
 *
 * As the component implements the `useTheme` hook, changing the theme of the
 * application will reflect the change within the state of the base component,
 * forcing the application to re-render.
 *
 * This component can be used anywhere within the application.
 */
export function ThemeSelector(): JSX.Element {
  // To create the theme selector, we will be using the `Menu` component from
  // the Material UI library, which will allow us to provide the user with a
  // meny of options to choose from.

  // In order to use the `Menu` component, we will need to provide it an anchor
  // element, which will be the element that the menu will be anchored to. We
  // will set the anchor element within the state of the component, and will
  // provide the `Menu` component with the anchor element as a prop.
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Additionally, we will implement our custom context, which represents
  // information regarding the theme of the application. Our implementation of
  // the `_app` component provides the theme context to all components within
  // the application, thus, we can then use the `useTheme` hook to access the
  // context.

  // By using the `useTheme` hook, we have access to the current theme of the
  // application along with a function to change the theme of the application.
  const prefers = useTheme();

  // Represents the current theme of the application retrieved from the
  // `useTheme` hook, which is specified from the `_app` component.
  const theme: Themes = prefers.theme === 'system' ? themes.systemColorScheme() : prefers.theme;

  /**
   * Handles the click event of the anchored element.
   *
   * As this function implements the `Menu` component, an anchor element is
   * required to be provided to the component, which will be the element that
   * the menu will be anchored to.
   *
   * `handleClick` will set the anchor element to the element that was clicked,
   * which will re-render the component, allowing the menu to be rendered.
   * @param event The click event of the element.
   */
  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  /**
   * Handles the closing of the menu.
   *
   * `handleClose` will set the anchor element to `null`, which will re-render
   * the component, allowing the menu to be closed.
   */
  function handleClose() {
    setAnchorEl(null);
  }

  /**
   * Changes the application's theme.
   *
   * `handleThemeChange` is called whenever a user selects an option from the
   * provided menu. The function will call the `setTheme` method, which was
   * provided by the `_app` component, which will change the theme of the entire
   * application. The function will then close the menu.
   * @param theme The theme to change the application to.
   */
  function handleThemeChange(theme: ThemePresets) {
    handleClose();
    prefers.setTheme(theme);
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        {theme === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('light')} selected={prefers.theme === 'light'}>
          <LightModeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Light Mode
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')} selected={prefers.theme === 'dark'}>
          <DarkModeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Dark Mode
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleThemeChange('system')} selected={prefers.theme === 'system'}>
          System
        </MenuItem>
      </Menu>
    </>
  );
}
