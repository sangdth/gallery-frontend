import React, {
// useCallback,
// useEffect,
// useMemo,
// useState,
} from 'react';
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { ActionItem, ConfirmButton, PageSelector } from '@/components';
import type { MenuOption, PageType } from '@/lib/types';

type Props = {
  loading?: boolean;
  pages: PageType[] | undefined;
  menu: MenuOption | undefined;
  onSubmit?: (menu: MenuOption) => Promise<void>;
  refetch?: () => void;
};

export const MenuEditorModal = (props: Props) => {
  const { loading, pages, menu, onSubmit, refetch } = props;
  // console.log('### menu: ', menu);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async () => {
    if (menu && typeof onSubmit === 'function' && typeof refetch === 'function') {
      await onSubmit(menu);
      refetch();
    }
    onClose();
  };

  const handleOpen = () => {
    onOpen();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Flex justify="flex-end">
        <Button
          size="lg"
          fontWeight={600}
          color="white"
          bg="blue.400"
          leftIcon={<SettingsIcon />}
          disabled={false}
          display={{
            base: 'none',
            md: 'inline-flex',
          }}
          _hover={{
            bg: 'blue.300',
          }}
          onClick={handleOpen}
        >
          Config Menu
        </Button>
      </Flex>

      <Modal
        closeOnOverlayClick={false}
        size="6xl"
        isOpen={isOpen}
        onClose={handleCancel}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Config Menu
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {menu?.value.map((o) => (
              <ActionItem
                key={typeof o.id === 'string' ? o.id : 'no-id'}
                data={o}
              />
            ))}

            {pages && pages.length > 0 && (
              <PageSelector
                pages={pages}
                onSelect={(id) => console.log('selected', id)}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <ConfirmButton
              label="Cancel"
              message="Ignore changes?"
              buttonProps={{ marginRight: 3 }}
              ignoreConfirm={true}
              onConfirm={handleCancel}
            />
            <Button
              isLoading={loading}
              loadingText="Updating..."
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              Save Menu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MenuEditorModal;
