// Global CSS can not import from other than this custom App
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'nprogress/nprogress.css';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@/styles/globals.css';
import '@/styles/slick.css';
import '@/styles/slick-theme.css';
import { AppWrapper, ErrorBoundary } from '@/components';
import { useLoadingProgress } from '@/lib/hooks';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  useLoadingProgress();

  return (
    <AppWrapper>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </AppWrapper>
  );
}
export default MyApp;
