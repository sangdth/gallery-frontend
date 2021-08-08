import React from 'react';
import {
  Flex,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import type { PageType } from '../../lib/types';

type Props = Partial<PageType> & {
  // onClick: () => void;
  onDelete: () => void;
  ref?: any;
  style?: Record<string, unknown>;
};

export const PageItem = (props: Props) => {
  const {
    id,
    name,
    onDelete,
    ref,
    style,
    // onClick,
  } = props;

  return (
    <HStack
      ref={ref}
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      marginY="10px"
      padding="20px"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900'), cursor: 'pointer' }}
      style={style}
    >
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
  );
};

export default PageItem;
