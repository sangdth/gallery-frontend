// Global CSS can not import from other than this custom App
import '../styles/globals.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';

import type { AppProps } from 'next/app';
import { AppWrapper } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}
export default MyApp;
