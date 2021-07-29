import React from 'react';
import NextLink from 'next/link';
import {
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  name: string;
  path: string;
  onClick: () => void;
  onDelete: () => void;
};

export const SiteItem = (props: Props) => {
  const {
    name,
    onDelete,
    path,
    onClick,
  } = props;

  return (
    <LinkBox as="article" onClick={onClick}>
      <HStack
        border="1px"
        borderColor="gray.200"
        borderRadius="4px"
        marginY="10px"
        padding="20px"
        _hover={{ bg: useColorModeValue('blue.50', 'gray.900'), cursor: 'pointer' }}
      >
        <NextLink href={path}>
          <LinkOverlay>
            <Text fontSize="2em">{name}</Text>
          </LinkOverlay>
        </NextLink>
        <IconButton
          aria-label="Delete this site"
          colorScheme="red"
          variant="outline"
          icon={<DeleteIcon />}
          _hover={{ bg: useColorModeValue('red.400', 'gray.900'), color: 'white' }}
          onClick={onDelete}
        />
      </HStack>
    </LinkBox>
  );
};

export default SiteItem;
