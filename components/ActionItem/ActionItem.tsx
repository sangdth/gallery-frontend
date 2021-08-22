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
  EditIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import type { ActionItemType, DataType } from '@/lib/types';
import { ConfirmButton } from '../ConfirmButton';
import type { ConfirmButtonProps } from '../ConfirmButton';

export const mapToActionItem = (o: any): ActionItemType => {
  let name: string = o.name ?? '';
  let description: string = o.id;

  if (o.label) {
    name = o.label;
  }
  if (o.slug) {
    description = o.slug;
  }

  return {
    id: o.id,
    name,
    description,
    children: o.children ?? [],
  };
};

export type ActionItemProps<T> = {
  confirmButtonProps?: ConfirmButtonProps;
  data: T;
  draggable?: boolean;
  onClick?: () => void;
  onClickExternal?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const ActionItem = <T extends DataType>(props: ActionItemProps<T>) => {
  const {
    confirmButtonProps,
    data: originalData,
    draggable = false,
    onDelete,
    onEdit,
    onClick,
    onClickExternal,
  } = props;

  const data = mapToActionItem(originalData);
  const greenBackground = useColorModeValue('green.400', 'gray.600');
  const blueBackground = useColorModeValue('blue.400', 'gray.600');

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
          <Text fontSize="2em" fontWeight="bold">
            {data.name}
            {onClickExternal && (
              <IconButton
                aria-label="Preview"
                marginLeft="10px"
                icon={<ExternalLinkIcon />}
                variant="link"
                target="_blank"
                onClick={onClickExternal}
              />
            )}
          </Text>
          <Text fontSize="0.8em">{data.description}</Text>
        </Flex>
      </HStack>
      <Flex width="250px" justifyContent="space-between">
        <HStack spacing="20px">
          {onClick && (
            <IconButton
              aria-label="Open"
              colorScheme="blue"
              variant="outline"
              borderRadius="4px"
              icon={<ArrowForwardIcon />}
              _hover={{ bg: greenBackground, color: 'white' }}
              onClick={onClick}
            />
          )}
        </HStack>

        <HStack spacing="20px">
          {onEdit && (
            <IconButton
              aria-label="Edit"
              colorScheme="blue"
              variant="outline"
              borderRadius="4px"
              icon={<EditIcon />}
              _hover={{ bg: blueBackground, color: 'white' }}
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
    </Flex>
  );
};

export default ActionItem;
