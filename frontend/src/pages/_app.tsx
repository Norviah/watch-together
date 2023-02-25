import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ThemeContext } from '@/src/util/usePrefers';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Component } from 'react';
import { ThemeToggler } from '@/src/components/ThemeToggler';

import * as themes from '@/src/util/themes';

import type { ThemePresets, Themes } from '@/src/types/Themes';
import type { AppProps } from 'next/app';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/**
 * The entry point of the application.
 *
 * In a Next.js application, `_app.tsx` represents the top-level component that
 * will be common across all pages, it is essentially a component that wraps all
 * other components in the application.
 *
 * `_app.tsx` is important, since it wraps all other components in the
 * application, it allows us to perform global actions, such as implementing a
 * consistent layout across all other pages.
 * @see https://nextjs.org/docs/advanced-features/custom-app
 */
export default class App extends Component<AppProps, { theme: ThemePresets }> {
  /**
   * The initial state of the application.
   *
   * The state of the component will only reference the active theme, which is
   * either `light` or `dark`.
   */
  public state: { theme: ThemePresets } = { theme: themes.DEFAULT };

  /**
   * Invoked immediately after a component is mounted.
   *
   * `componentDidMount` is called after the component is mounted, which means
   * that the component has been rendered to the DOM. This is a good place to
   * perform any side-effects, such as fetching data from an API.
   *
   * As for our application, we want to set the theme to the user's preferred
   * theme, as referenced in their browser's local storage.
   */
  public componentDidMount(): void {
    // To set the theme, we'll first need to determine what the user's preferred
    // preset is, one of: `system`, `light`, or `dark`. We'll attempt to read
    // the user's preferred preset from their browser's local storage.
    const preset = (window?.localStorage.getItem('theme') ?? themes.DEFAULT) as ThemePresets;

    // Once we have the theme, we'll set the state of the component to the
    // theme, which will cause the component to re-render.
    this.setState({ theme: preset });
  }

  /**
   * Sets the theme of the application.
   *
   * Used as a callback for the theme's context provider, `setTheme` will be
   * available to components that use the `usePrefers` hook. This allows us to
   * change the theme of the application from anywhere in the application,
   * forcing the application to re-render.
   * @param preset The theme preset to set.
   */
  public setTheme(preset: ThemePresets): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', preset);
    }

    this.setState({ theme: preset });
  }

  /**
   * Represents how the component should be rendered.
   */
  render() {
    const { Component, pageProps } = this.props;

    const theme: Themes =
      this.state.theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark'
        : this.state.theme;

    return (
      <ThemeProvider theme={theme === 'light' ? themes.LIGHT : themes.DARK}>
        <ThemeContext.Provider
          value={{ theme: this.state.theme, switchTheme: this.setTheme.bind(this) }}
        >
          <CssBaseline />
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {this.props.router.route === '/' ? 'Home' : this.props.router.route.split('/')[1]}
                </Typography>
                <ThemeToggler />
                <Button color="inherit">Login</Button>
              </Toolbar>
            </AppBar>
          </Box>

          <Box>
            <Component {...pageProps} />
          </Box>
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  }
}
