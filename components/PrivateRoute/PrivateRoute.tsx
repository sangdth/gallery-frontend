import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@nhost/react-auth';

const PrivateRoute: React.FC = ({ children }) => {
  const router = useRouter();
  const { signedIn } = useAuth();

  // wait to see if the user is logged in or not.
  if (signedIn === null) {
    return <div>Checking auth...</div>;
  }

  if (!signedIn) {
    router.push('/login');
    return <div>Redirecting...</div>;
  }

  console.log('render components'); // eslint-disable-line

  if (typeof children === 'function') {
    return children(router);
  }
  return children;
};

export default PrivateRoute;
