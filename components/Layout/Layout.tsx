import React from 'react';
import { Header } from './Header';

export const Layout: React.FC = ({ children }) => (
  <div>
    <Header />
    <div>{children}</div>
  </div>
);

export default Layout;
