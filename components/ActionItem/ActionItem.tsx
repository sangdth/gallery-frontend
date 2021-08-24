import React, { useMemo } from 'react';
import {
  Flex,
  HStack,
  IconButton,
  Stack,
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
  compactMode?: boolean;
  customActions?: (id: string) => React.ReactNode;
  onClick?: () => void;
  onClickExternal?: () => void;
  onEdit?: () => void;
  onEditIcon?: React.ReactElement;
  onDelete?: (id: string) => void;
  onDeleteIcon?: React.ReactElement;
};

export const ActionItem = <T extends DataType>(props: ActionItemProps<T>) => {
  const {
    confirmButtonProps,
    data: originalData,
    draggable = false,
    compactMode = false,
    customActions,
    onDelete,
    onDeleteIcon,
    onEdit,
    onEditIcon,
    onClick,
    onClickExternal,
  } = props;

  const data = useMemo(() => mapToActionItem(originalData), [originalData]);
  const greenBackground = useColorModeValue('green.400', 'gray.600');
  const blueBackground = useColorModeValue('blue.400', 'gray.600');

  return (
    <Flex
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      padding={`${compactMode ? 10 : 20}px`}
      direction="column"
      justifyContent="space-between"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
      // onClick={onClick}
    >
      <HStack spacing="20px" width="100%" justifyContent="space-between">
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
          <Text fontSize={`${compactMode ? 1 : 2}em`} fontWeight="bold">
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
          <Text fontSize={`${compactMode ? 0.6 : 0.8}em`}>{data.description}</Text>
        </Flex>
        <Flex minWidth="250px" justifyContent="space-between">
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
                icon={onEditIcon ?? <EditIcon />}
                _hover={{ bg: blueBackground, color: 'white' }}
                onClick={onEdit}
              />
            )}
            
            {customActions && customActions(data.id)}

            {onDelete && (
              <ConfirmButton
                {...confirmButtonProps}
                iconOnly
                icon={onDeleteIcon ?? <DeleteIcon />}
                label="Delete"
                message={`Delete this item (${data.name})?`}
                onConfirm={() => onDelete(data.id)}
              />
            )}
          </HStack>
        </Flex>
      </HStack>

      {data.children && data.children.length > 0 && (
        <Stack spacing="10px" marginTop="10px">
          {data.children.map((o) => (
            <ActionItem
              compactMode
              key={`${o.description}-${o.id}`}
              data={o}
              onDelete={onDelete}
              onDeleteIcon={onDeleteIcon ?? <DeleteIcon />}
              customActions={customActions}
            />
          ))}
        </Stack>
      )}
    </Flex>
  );
};

export default ActionItem;
