import EmailPasswordReact from 'supertokens-auth-react/recipe/emailpassword';
import EmailPasswordNode from 'supertokens-node/recipe/emailpassword';
import SessionReact from 'supertokens-auth-react/recipe/session';
import SessionNode from 'supertokens-node/recipe/session';
import { AppInfo } from '../lib';

const domain = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const appInfo = {
  // learn more about this on https://supertokens.io/docs/emailpassword/appinfo
  appName: AppInfo.name,
  websiteDomain: domain,
  apiDomain: domain, // Should be equal to `websiteDomain` in case using the `api` folder for APIs
  apiBasePath: '/api/auth/', // /api/auth/* will be where APIs like sign out, sign in will be exposed
};

export const frontendConfig = () => ({
  appInfo,
  recipeList: [
    EmailPasswordReact.init(),
    SessionReact.init(),
  ],
});

export const backendConfig = () => ({
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_URI || 'https://try.supertokens.io',
    apiKey: process.env.SUPERTOKENS_API_KEY || '',
  },
  appInfo,
  recipeList: [
    EmailPasswordNode.init(),
    SessionNode.init(),
  ],
  isInServerlessEnv: true,
});
