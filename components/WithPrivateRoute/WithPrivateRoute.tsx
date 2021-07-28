import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@nhost/react-auth';

export function WithPrivateRoute<P>(Component: React.ComponentType<P>) {
  return function WrapperComponent(props: P) {
    const router = useRouter();
    const { signedIn } = useAuth();

    if (signedIn === null) {
      return <div>Checking auth...</div>;
    }

    if (!signedIn) {
      router.push('/login');
      return <div>Redirecting...</div>;
    }
    return <Component {...props} />;
  };
}

export default WithPrivateRoute;
