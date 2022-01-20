import { useEffect } from 'react';
import { NhostClient } from '@nhost/nhost-js';
import { useNhostAuth } from '@nhost/react-auth';
import { useAtom } from 'jotai';
import { meAtom } from '@/lib/jotai';
import { BACKEND_ENDPOINT } from './constants';

export const nhost = new NhostClient({
  backendUrl: BACKEND_ENDPOINT,
});

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useNhostAuth();
  const [me, setMe] = useAtom(meAtom);
  const user = nhost.auth.getUser();

  useEffect(() => {
    if (!me && user) {
      setMe(user);
    }
  }, [me, setMe, user]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
