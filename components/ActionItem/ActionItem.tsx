import React from 'react';
import {
  Flex,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
ArrowForwardIcon,
DeleteIcon,
DragHandleIcon,
EditIcon
} from '@chakra-ui/icons';
import { ConfirmButton } from '../ConfirmButton';
import type { ConfirmButtonProps } from '../ConfirmButton';
import type { ActionItemDataType } from '../../lib/types';

export type ActionItemProps<T> = {
  confirmButtonProps?: ConfirmButtonProps;
  data: T;
  draggable?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const ActionItem = <T extends ActionItemDataType>(props: ActionItemProps<T>) => {
  const {
    confirmButtonProps,
    data,
    draggable = false,
    onDelete,
    onEdit,
    onClick,
  } = props;
  
  return (
    <Flex
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      padding="20px"
      spacing="20px"
      justifyContent="space-between"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
      // onClick={onClick}
    >
      <HStack spacing="20px">
        {draggable && (
          <IconButton
            as="div"
            aria-label="Drag"
            width="50px"
            height="50px"
            icon={<DragHandleIcon />}
            _hover={{ cursor: 'pointer' }}
          />
        )}
        
        <Flex direction="column">
          <Text fontSize="2em" fontWeight="bold">{data.name}</Text>
          <Text fontSize="0.8em">{data.id}</Text>
        </Flex>
      </HStack>
      <HStack spacing="20px">
        {onClick && (
          <IconButton
            aria-label="Open"
            colorScheme="green"
            variant="outline"
            borderRadius="4px"
            icon={<ArrowForwardIcon />}
            _hover={{ bg: useColorModeValue('green.400', 'gray.600'), color: 'white' }}
            onClick={onClick}
          />
        )}
      
        {onEdit && (
          <IconButton
            aria-label="Edit"
            colorScheme="blue"
            variant="outline"
            borderRadius="4px"
            icon={<EditIcon />}
            _hover={{ bg: useColorModeValue('blue.400', 'gray.600'), color: 'white' }}
            onClick={onEdit}
          />
        )}

        {onDelete && (
          <ConfirmButton
            {...confirmButtonProps}
            iconOnly
            icon={<DeleteIcon />}
            label="Delete"
            message="Delete this item?"
            onConfirm={onDelete}
          />
        )}
      </HStack>
    </Flex>
  );
};

export default ActionItem;
