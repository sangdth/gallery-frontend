import { useState } from 'react';
import { useAuth, useRouter, useTimeoutFn } from '@/lib/hooks';
import { LoadingScreen } from '../LoadingScreen';

function WithPrivateRoute<P>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [label, setLabel] = useState('Loading...');

    const [isReady, cancel] = useTimeoutFn(() => {
      if (!isAuthenticated) {
        setLabel('Redirecting...');
        router.push('/login');
      }
    }, 3000);

    if (isLoading) {
      return <LoadingScreen label={label} />;
    }

    if (!isAuthenticated) {
      if (isReady() === false) {
        cancel();
      }
      router.push('/login');
      return null;
    }

    return <Component {...props} />;
  };
}

export { WithPrivateRoute };
