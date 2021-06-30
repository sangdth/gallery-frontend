import '../styles/globals.css';
import type { AppProps } from 'next/app';
import SuperTokensReact from 'supertokens-auth-react';
import SuperTokensNode from 'supertokens-node';

import { frontendConfig, backendConfig } from '../config/supertokensConfig';

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig());
} else {
  SuperTokensNode.init(backendConfig());
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
