import { NhostClient } from '@nhost/nhost-js';
import { useNhostAuth } from '@nhost/react-auth';
import { BACKEND_ENDPOINT } from './constants';

export const nhost = new NhostClient({
  backendUrl: BACKEND_ENDPOINT,
});

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useNhostAuth();
  const user = nhost.auth.getUser();

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
