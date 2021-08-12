import React from 'react';
import { Flex } from '@chakra-ui/react';
import { ChangePassword } from '../../../components/ChangePassword';

export const Settings = () => {
  return (
    <Flex direction="column">
      <ChangePassword />
    </Flex>
  );
};

export default Settings;
