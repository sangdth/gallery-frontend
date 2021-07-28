import React from 'react';
import {
  Box,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

type Props = {
  name: string;
};

export const SiteItem = (props: Props) => {
  const { name } = props;

  return (
    <HStack
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      marginY="10px"
      padding="20px"
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Box><Text fontSize="2em">{name}</Text></Box>
    </HStack>
  );
};

export default SiteItem;
