import React from 'react';
import { Flex } from '@chakra-ui/react';
import { ChangePassword } from '../../../components/ChangePassword';

export const Settings = () => {
  console.log('### Render Settings'); // eslint-disable-line no-console

  return (
    <Flex direction="column">
      <ChangePassword />
    </Flex>
  );
};

export default Settings;
