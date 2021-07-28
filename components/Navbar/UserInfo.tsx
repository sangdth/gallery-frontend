import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { meAtom } from '../../lib/jotai';
import { auth } from '../../lib/nhost';
import { Entity } from '../../lib/enums';
import type { SingleData, UserType } from '../../lib/types';

export type UserData = SingleData<UserType, Entity.Users>;

export const GET_SELF = gql`
  query getSelf($user_id: uuid!) {
    users_by_pk(id: $user_id) {
      id
      display_name
      account {
        id
        email
      }
    }
  }
`;

export const UserInfo = () => {
  const router = useRouter();
  const [me, setMe] = useAtom(meAtom);

  const { loading, error, data } = useQuery<UserData>(GET_SELF, {
    variables: {
      user_id: auth.getClaim('x-hasura-user-id'),
    },
    context: {
      headers: {
        'x-hasura-role': 'me',
      },
    },
  });

  const meData = data?.users_by_pk;

  useEffect(() => {
    if (me === null && !!meData) {
      setMe(meData);
    }
  }, [me, meData, setMe]);

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error || !me) {
    console.error(error); // eslint-disable-line
    return <div>Error getting user data</div>;
  }

  const handleLogout = async () => {
    await auth.logout();

    return router.push('/login');
  };

  return (
    <Menu>
      <MenuButton
        p={2}
        transition="all 0.2s"
        borderRadius="md"
        _hover={{ bg: 'gray.100' }}
        _expanded={{ bg: 'gray.200' }}
      >
        <HStack alignItems="center" spacing="10px">
          <Avatar
            size="sm"
            name={me.display_name ?? ''}
            src={me.avatar_url ?? ''}
          />
          <Box>{me.display_name}</Box>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem>Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserInfo;
