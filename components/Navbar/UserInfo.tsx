import React from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ChevronDownIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { meAtom } from '@/lib/jotai';
import { nhost } from '@/lib/nhost';

const UserInfo = () => {
  const router = useRouter();
  const [me] = useAtom(meAtom);

  const handleSettings = async () => router.push('/settings');

  const handleLogout = async () => {
    await nhost.auth.signOut();

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
            name={me?.displayName ?? ''}
            src={me?.avatarUrl ?? ''}
          />
          <Box>{me?.displayName}</Box>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<SettingsIcon />} onClick={handleSettings}>
          Settings
        </MenuItem>

        <MenuDivider />

        <MenuItem icon={<ArrowBackIcon />} onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserInfo;
