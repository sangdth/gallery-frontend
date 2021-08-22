import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';
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
  FormControl,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { ConfirmButton } from '../ConfirmButton';
import { meAtom, siteAtom } from '@/lib/jotai';
import { storage } from '@/lib/nhost';
import { collectionAtom } from '../panels/Collections';
import { ImageUpload } from '../ImageUpload';
import { ImageController } from '../ImageController';
import type { CollectionInput, ImageType } from '@/lib/types';

type Props = {
  onSubmit: (input: CollectionInput) => Promise<void>;
  refetch: () => void;
};

// TODO:
// - Delete button should not interfere with other tab or show number selected
const CollectionEditorModal = (props: Props) => {
  const toast = useToast();
  const { onSubmit, refetch } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [me] = useAtom(meAtom);
  const [site] = useAtom(siteAtom);
  const [collection, setCollection] = useAtom(collectionAtom);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState<Partial<ImageType>[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const initialInput = useMemo(() => ({
    id: uuidv4(),
    site_id: site?.id,
    name: '',
    description: '',
    images: [],
    ...(collection ?? {}),
  }), [site, collection]);

  const [input, setInput] = useState<CollectionInput>(initialInput);

  const cleanUp = useCallback(() => {
    setInput({ ...initialInput, id: uuidv4() });
    setCollection(null);
    setUploaded([]);
  }, [setInput, setCollection, setUploaded, initialInput]);

  const handleCancel = async () => {
    if (uploaded.length > 0) {
      await Promise.all(uploaded.map((image) => storage.delete(`/${image.path}`)));
    }

    cleanUp();
    onClose();
  };

  const handleOnChange = (key: string, value: string) => {
    setInput({
      ...input,
      [key]: value,
    });
  };

  const handleUploadImages = (images: Partial<ImageType>[]) => {
    const recentUploaded = images.map((image) => ({ ...image, id: uuidv4() }));

    setUploaded((prevUploaded) => {
      const filteredUploaded = recentUploaded
        .filter((recent) => {
          const existingImages = [...(input.images ?? []), ...prevUploaded];
          const found = existingImages.find((prev) => recent.path === prev.path);
          if (found) {
            toast({
              title: 'Image already uploaded',
              position: 'top',
              status: 'warning',
              isClosable: true,
              duration: 3000,
            });
          }
          return !found;
        });

      const updatedImages = [...prevUploaded, ...filteredUploaded];

      setInput({
        ...input,
        images: [...(input.images ?? []), ...updatedImages],
      });

      return updatedImages;
    });

    refetch();
  };

  const handleOnSelect = (selections: string[]) => {
    setSelected(selections);
  };

  const handleDeleteImages = async () => {
    setLoading(true);
    const selectedImages = selected
      .map((id) => (input.images ?? []).find((o) => o.id === id));

    await Promise.all(
      selectedImages.map(async (image) => {
        if (image) {
          return storage.delete(`/${image.path}`);
        }
      }),
    );

    const remainedImages = (input.images ?? []).filter((o) => !selected.includes(o.id ?? ''));

    setInput((preInput) => ({
      ...preInput,
      images: remainedImages,
    }));

    setLoading(false);
    refetch();
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    onClose();
  };

  const shouldDisable = !me?.id || loading;
  const hasChanged = collection && (
    uploaded.length > 0
    || input.name !== collection.name
    || input.description !== collection.description
  );

  useEffect(() => {
    if (!isOpen && collection && (!input.name && !input.description)) {
      setInput({
        description: collection.description,
        id: collection.id ?? uuidv4(),
        name: collection.name,
        site_id: collection.site_id,
        status: collection.status,
        images: collection.images,
      });
      onOpen();
    }
  }, [collection, onOpen, input, isOpen]);

  useEffect(() => {
    const isDirtyInput = input.name || input.description;
    if (!isOpen && (uploaded.length > 0 || isDirtyInput)) {
      cleanUp();
    }
  }, [isOpen, uploaded, input, cleanUp]);

  return (
    <>
      <Flex justify="flex-end">
        <Button
          size="lg"
          fontWeight={600}
          color="white"
          bg="green.400"
          leftIcon={<AddIcon />}
          disabled={shouldDisable}
          display={{
            base: 'none',
            md: 'inline-flex',
          }}
          _hover={{
            bg: 'green.300',
          }}
          onClick={onOpen}
        >
          Create New Collection
        </Button>
      </Flex>

      <Modal
        size="3xl"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleCancel}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {collection ? `Edit collection: ${input.name}` : 'Create new collection'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs width="100%" isLazy>
              <TabList>
                <Tab>General</Tab>
                <Tab>Images</Tab>
              </TabList>
              <TabPanels paddingX="0">
                <TabPanel>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder="Collection name"
                      value={input.name ?? ''}
                      onChange={(e) => handleOnChange('name', e.currentTarget.value)}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input
                      placeholder="Description"
                      value={input.description ?? ''}
                      onChange={(e) => handleOnChange('description', e.currentTarget.value)}
                    />
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <ImageController
                    images={input.images ?? []}
                    selected={selected}
                    onSelect={handleOnSelect}
                  />

                  <ImageUpload
                    collectionId={input.id}
                    onUpload={handleUploadImages}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Flex justifyContent="space-between" width="100%">
              {selected.length > 0 ? (
                <ConfirmButton
                  label="Delete"
                  message="Delete selected images?"
                  icon={<DeleteIcon />}
                  buttonProps={{ color: 'red', isLoading: loading }}
                  onConfirm={handleDeleteImages}
                />
              ) : <Flex />}

              <Flex>
                <ConfirmButton
                  label="Cancel"
                  message="Discard all changes?"
                  buttonProps={{ marginRight: 3 }}
                  ignoreConfirm={!hasChanged}
                  onConfirm={handleCancel}
                />

                <Button
                  isLoading={loading}
                  loadingText={collection ? 'Updating...' : 'Creating...'}
                  colorScheme="blue"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CollectionEditorModal;
