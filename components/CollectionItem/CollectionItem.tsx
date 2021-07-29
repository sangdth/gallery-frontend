import React from 'react';
import {
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  name: string;
  // onClick: () => void;
  onDelete: () => void;
};

export const CollectionItem = (props: Props) => {
  const {
    name,
    onDelete,
    // onClick,
  } = props;

  return (
    <HStack
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      marginY="10px"
      padding="20px"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900'), cursor: 'pointer' }}
    >
      <Text fontSize="2em">{name}</Text>
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

export default CollectionItem;
