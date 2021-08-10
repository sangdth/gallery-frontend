import React from 'react';
import {
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import type { PageType } from '../../lib/types';

type Props = Partial<PageType> & {
  children?: React.ReactNode;
  // onClick: () => void;
  onDelete: () => void;
  ref?: any;
  style?: Record<string, unknown>;
};

export const PageItem = (props: Props) => {
  const {
    children,
    id,
    name,
    onDelete,
    ref,
    style,
    // onClick,
  } = props;

  return (
    <Stack
      ref={ref}
      border="1px"
      borderColor="gray.400"
      borderRadius="4px"
      // marginY="10px"
      padding="10px 20px"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900'), cursor: 'pointer' }}
      style={style}
    >
      <HStack padding="10px 20px">
        <Flex direction="column">
          <Text fontSize="2em">{name}</Text>
          <Text fontSize="0.8em">{id}</Text>
        </Flex>
        <IconButton
          aria-label="Delete this site"
          colorScheme="red"
          variant="outline"
          icon={<DeleteIcon />}
          _hover={{ bg: useColorModeValue('red.400', 'gray.900'), color: 'white' }}
          onClick={onDelete}
        />  
      </HStack>
      {children}
    </Stack>
  );
};

export default PageItem;
