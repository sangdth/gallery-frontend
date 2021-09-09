import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { useAtom } from 'jotai';
import { useAuth } from '@nhost/react-auth';
import { Logo } from '@/components';
import { makeLink } from '@/lib/helpers';
import { siteAtom } from '@/lib/jotai';
import type { NavItem } from '@/lib/types';

import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { UserInfo } from './UserInfo';

export type Props = {
  items: NavItem[];
};

export const Navbar = ({ items }: Props) => {
  const { isOpen, onToggle } = useDisclosure();
  const { signedIn } = useAuth();
  const [currentSite] = useAtom(siteAtom);
  const siteLink = makeLink(currentSite);

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Logo />

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            {currentSite && (
              <Link href={siteLink.href} isExternal>
                {siteLink.label}
                <ExternalLinkIcon marginLeft="2px" marginBottom="4px" />
              </Link>
            )}
            {false && <DesktopNav items={items} />}
          </Flex>
        </Flex>

        {signedIn ? (
          <UserInfo />
        ) : (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={6}
          >
            <Button
              as="a"
              fontSize="sm"
              fontWeight={400}
              variant="link"
              href="/login"
            >
              Login / Sign up
            </Button>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav items={items} />
      </Collapse>
    </Box>
  );
};

export default Navbar;
