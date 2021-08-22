import React from 'react';
import {
  Flex,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { ConfirmButton } from '@/components';

type Props = {
  name: string;
  onClick?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const CollectionItem = (props: Props) => {
  const {
    name,
    onDelete,
    onEdit,
    onClick,
  } = props;

  return (
    <Flex
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      marginY="10px"
      padding="20px"
      spacing="20px"
      justifyContent="space-between"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900'), cursor: 'pointer' }}
      onClick={onClick}
    >
      <Text fontSize="2em">{name}</Text>
      <HStack spacing="20px">
        <IconButton
          aria-label="Edit"
          colorScheme="blue"
          variant="outline"
          borderRadius="4px"
          icon={<EditIcon />}
          _hover={{ bg: useColorModeValue('blue.400', 'gray.600'), color: 'white' }}
          onClick={onEdit}
        />

        <ConfirmButton
          iconOnly
          icon={<DeleteIcon />}
          label="Delete"
          message="Delete this item?"
          onConfirm={onDelete}
        />
      </HStack>
    </Flex>
  );
};

export default CollectionItem;
