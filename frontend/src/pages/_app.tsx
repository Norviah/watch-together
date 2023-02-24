import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Component } from 'react';

import type { AppProps } from 'next/app';

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
export default class App extends Component<AppProps> {
  /**
   * Represents how the component should be rendered.
   */
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
