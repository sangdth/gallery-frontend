import React from 'react';
import { useAuth } from '@nhost/react-auth';

export const Pages = () => {
  const { signedIn } = useAuth();


  return (
      <p>Pages</p>
  );
};

export default Pages;
