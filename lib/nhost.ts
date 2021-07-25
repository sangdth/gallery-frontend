import { createClient } from 'nhost-js-sdk';
import { BASE_ENDPOINT } from './constants';

const config = {
  baseURL: BASE_ENDPOINT,
};

const { auth, storage } = createClient(config);

export { auth, storage };
