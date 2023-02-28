import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ThemeContext } from '@/src/util/useTheme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Component } from 'react';
import { capitalize } from '../util/capitalize';
import { ThemeSelector } from '@/src/components/ThemeSelector';

import * as themes from '@/src/util/themes';

import type { ThemePresets, Themes } from '@/src/types/Themes';
import type { AppProps } from 'next/app';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/**
 * The state of the application.
 *
 * In React, a component's state is an object that holds information regarding
 * the component. The information stored in the state of a component can change
 * over time and affect the rendering of the component, as well as the behavior
 * of the component. Note that whenever a component's state changes, the
 * component will re-render.
 *
 * For our application, we only need to store the active theme of the
 * application within the state of the component. This will allow us to change
 * the theme of the application from anywhere in the application.
 * @see https://reactjs.org/docs/state-and-lifecycle.html
 */
interface AppState {
  theme: ThemePresets;
}

/**
 * The entry point of the application.
 *
 * In a Next.js application, the `_app` component is a special component that
 * allows you to override the default behavior of the default component that is
 * used to render a page. The `_app` component can be manually created to wrap
 * your entire application with custom components, global CSS styles, etc.
 *
 * The `_app` component takes two props: `Component` and `pageProps`,
 * representing the component that Next.js is rendering for the current page and
 * an object containing any initial props that were passed to the page
 * component.
 *
 * An important thing to note when defining a custom `_app` component is that it
 * is only rendered on the client-side. It is not used during server-side, as
 * server-side rendering bypasses the client-side JavaScript and renders the
 * page directly on the server. This means that any code you write in the `_app`
 * component that depends on client-side JavaScript will not work during
 * server-side rendering.
 * @see https://nextjs.org/docs/advanced-features/custom-app
 */
export default class App extends Component<AppProps, AppState> {
  /**
   * Represents the component's state.
   *
   * The state of the component will only reference the active theme.
   */
  public state: AppState = { theme: themes.DEFAULT };

  /**
   * Executed after the component is mounted.
   *
   * `componentDidMount` is immediately called once the component is mounted
   * into the DOM, meaning once the component is rendered. This method is
   * typically used for performing actions that require the component to be
   * fully mounted, such as fetching data from an API, initializing a
   * third-party library, etc.
   *
   * The method is called only once during the lifecycle of the component, after
   * the `render` method has been called for the first time, meaning that any
   * updates to the component's state or props will cause the component to
   * re-render, but will not cause another call to `componentDidMount`.
   *
   * As for our application, we will implement this method to change the theme
   * of the application to the user's preferred theme, if set within their
   * browser's local storage.
   * @see https://reactjs.org/docs/react-component.html#componentdidmount
   */
  public componentDidMount(): void {
    // In order to set the application's theme, we'll first need to determine
    // what the user's preferred theme. We'll attempt to read their preferred
    // theme from their browser's local storage.

    // Once we have the theme, we'll set the state of the component to the found
    // theme, which will cause the component to re-render.
    this.setState({
      theme: (window?.localStorage.getItem('theme') as ThemePresets) ?? themes.DEFAULT,
    });
  }

  /**
   * Sets the theme of the application.
   *
   * `setTheme` changes the component's state to the provided theme, which will
   * cause the component to re-render, allowing the application to reflect the
   * new theme.
   *
   * `setTheme` is provided as a callback to the theme's context provider.
   * Context providers allows components to provide data through the tree
   * without having to pass properties down manually at every level.
   *
   * Using the context provider, we can provide this method to components that
   * use the `useTheme` hook, allowing them to change the theme of the
   * application from anywhere in the application.
   * @param preset The theme preset to set.
   * @see https://reactjs.org/docs/context.html
   */
  public setTheme(preset: ThemePresets): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', preset);
    }

    this.setState({ theme: preset });
  }

  /**
   * Represents what should be rendered on the screen.
   *
   * The `render` method is the only required method in a class component,
   * and is responsible for rendering the component to the screen. It is called
   * each time the state or properties of a component are updated, and is
   * responsible for updating the UI to reflect the changes.
   *
   * It is important to note that the `render` method should be a pure function,
   * meaning that it should not modify the component's state and not cause any
   * side effects. Instead, it should only return the desired output based on
   * the current state and props of the component.
   * @see https://reactjs.org/docs/react-component.html#render
   */
  public render() {
    const { Component, pageProps, router } = this.props;

    // In order to set the application's theme, we'll first need to determine
    // the actual theme that we should use. We'll use the `theme` property of
    // the component's state to determine the theme, and if the theme is set to
    // `system`, we'll grab their system's set theme.
    const theme: Themes =
      this.state.theme === 'system' ? themes.systemColorScheme() : this.state.theme;

    // Represents the current route that the user is on, which will be used to
    // determine the title of the application. We'll use the `route` property
    // of the router to determine the current route.
    const route: string = router.route === '/' ? 'Home' : router.route.split('/')[1];

    return (
      <ThemeProvider theme={theme === 'light' ? themes.LIGHT : themes.DARK}>
        <ThemeContext.Provider
          value={{ theme: this.state.theme, setTheme: this.setTheme.bind(this) }}
        >
          <CssBaseline />
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {capitalize(route)}
                </Typography>
                <ThemeSelector />
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
