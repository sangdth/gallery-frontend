import React from 'react';
import { Flex } from '@chakra-ui/react';
import {
  ChangePassword,
  Layout,
  WithPrivateRoute,
} from '../components';

export const Settings = () => {
  return (
    <Layout>
      <Flex direction="column" padding="20px">
        <ChangePassword />
      </Flex>
    </Layout>
  );
};

export default WithPrivateRoute(Settings);
