import React, {
// useCallback,
// useEffect,
// useMemo,
  useState,
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
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { MinusIcon, SettingsIcon } from '@chakra-ui/icons';
import { ActionItem, ConfirmButton, PageSelector } from '@/components';
import { recursiveRemove, recursiveInsert } from '@/lib/helpers';
import type { MenuOption, PageType } from '@/lib/types';

type Props = {
  loading?: boolean;
  pages: PageType[];
  menu: MenuOption;
  onSubmit?: (menu: MenuOption) => void;
  refetch?: () => void;
};

export const MenuEditorModal = (props: Props) => {
  const {
    loading,
    pages,
    menu: originalMenu,
    onSubmit,
    refetch,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuValue, setMenuValue] = useState(originalMenu?.value ?? []);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ ...originalMenu, value: menuValue });
    }
    if (refetch) {
      refetch();
    }
    onClose();
  };

  const handleOpen = () => {
    setMenuValue(originalMenu.value);
    onOpen();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDeleteMenuItem = (id: string) => {
    const remainedMenu = recursiveRemove(menuValue, id);
    setMenuValue(remainedMenu);
  };

  const handleAddNewItem = (pageId: string, itemId?: string) => {
    const foundPage = pages.find((p) => p.id === pageId);
    if (foundPage) {
      const newNode = {
        id: foundPage.id,
        label: foundPage.name,
        slug: foundPage.slug,
      };
     
      if (itemId) {
        const newMenu = recursiveInsert(menuValue, itemId, newNode);
        setMenuValue(newMenu);
      } else {
        const newMenu = [...menuValue];
        newMenu.push(newNode);
        setMenuValue(newMenu);
      }
    }
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
            <Stack spacing="10px" marginBottom="10px">
              {menuValue.map((o) => (
                <ActionItem
                  compactMode
                  key={`${o.id}`}
                  data={o}
                  customActions={(itemId) => (
                    <PageSelector
                      pages={pages.filter(p => p.id !== o.id)}
                      onSelect={(pageId) => handleAddNewItem(pageId, itemId)}
                    />
                  )}
                  onDeleteIcon={<MinusIcon />}
                  onDelete={(id) => handleDeleteMenuItem(id)}
                />
              ))}
            </Stack>

            {pages && pages.length > 0 && (
              <PageSelector
                pages={pages}
                onSelect={(pageId) => handleAddNewItem(pageId)}
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
