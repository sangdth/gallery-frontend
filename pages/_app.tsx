import '../styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import SuperTokensReact from 'supertokens-auth-react';
import SuperTokensNode from 'supertokens-node';
import Session from 'supertokens-auth-react/recipe/session';
import { redirectToAuth } from 'supertokens-auth-react/recipe/emailpassword';
import { frontendConfig, backendConfig } from '../config/supertokensConfig';

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig());
} else {
  SuperTokensNode.init(backendConfig());
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    async function doRefresh() {
      if (pageProps.fromSupertokens === 'needs-refresh') {
        if (await Session.attemptRefreshingSession()) {
          location.reload(); // eslint-disable-line no-restricted-globals
        } else {
          redirectToAuth(); // user has been logged out
        }
      }
    }
    doRefresh();
  }, [pageProps.fromSupertokens]);
  if (pageProps.fromSupertokens === 'needs-refresh') {
    return null;
  }
  return <Component {...pageProps} />;
}
export default MyApp;
