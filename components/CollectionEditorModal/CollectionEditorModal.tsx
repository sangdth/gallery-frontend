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
import { useMutation } from '@apollo/client';
import { useErrorHandler } from 'react-error-boundary';
import { meAtom, siteAtom } from '@/lib/jotai';
import { DELETE_IMAGES } from '@/lib/graphqls';
import { storage } from '@/lib/nhost';
import {
  ConfirmButton,
  ErrorBoundary,
  ImageUpload,
  ImageController,
} from '@/components';
import { collectionAtom } from '@/components/panels/CollectionsPanel';
import type { CollectionInput, ImageType } from '@/lib/types';

type Props = {
  onSubmit: (input: CollectionInput) => Promise<void>;
  refetch: () => void;
};

const CollectionEditorModal = (props: Props) => {
  const toast = useToast();
  const handleError = useErrorHandler();

  const { onSubmit, refetch } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [me] = useAtom(meAtom);
  const [site] = useAtom(siteAtom);
  const [collection, setCollection] = useAtom(collectionAtom);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState<Partial<ImageType>[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const initialInput = useMemo(() => ({
    id: uuidv4(),
    site_id: site?.id,
    name: '',
    description: '',
    images: [],
    ...(collection ?? {}),
  }), [site, collection]);

  const [input, setInput] = useState<CollectionInput>(initialInput);

  const [deleteImages] = useMutation(DELETE_IMAGES);

  const cleanUp = useCallback(() => {
    setInput({ ...initialInput, id: uuidv4() });
    setCollection(null);
    setUploaded([]);
  }, [setInput, setCollection, setUploaded, initialInput]);

  const handleCancel = async () => {
    if (uploaded.length > 0) {
      try {
        await Promise.all(
          uploaded.map((image) => storage.delete(`/${image.path}`)),
        );
        cleanUp();
        onClose();
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleOnChange = (key: string, value: string) => {
    setInput({
      ...input,
      [key]: value,
    });
  };

  const handleUploadImages = (uploadedImages: Partial<ImageType>[]) => {
    const recentUploaded = uploadedImages.map((image) => ({ ...image, id: uuidv4() }));

    const filteredUploaded = recentUploaded
      .filter((recent) => {
        const existingImages = [...(input.images ?? []), ...uploaded];
        const found = existingImages.find((prev) => recent.path === prev.path);
        if (found) {
          toast({
            title: 'Duplicated Action',
            description: `Image "${found.name}" already uploaded.`,
            position: 'top',
            status: 'warning',
            isClosable: true,
            duration: 3000,
          });
        }
        return !found;
      });

    const updatedImages = [...uploaded, ...filteredUploaded];

    setUploaded(updatedImages);
    setInput({
      ...input,
      images: [...(input.images ?? []), ...filteredUploaded],
    });

    refetch();
  };

  const handleOnSelect = (selections: string[]) => {
    setSelected(selections);
  };

  const handleDeleteImages = async () => {
    setLoading(true);

    const selectedImages = selected
      .map((id) => (input.images ?? []).find((o) => o.id === id))
      .filter((o) => o !== undefined);

    const uploadedRemained = uploaded.filter((o) => selected.includes(o.id ?? ''));
    setUploaded(uploadedRemained);

    try {
      await deleteImages({
        variables: { ids: selected },
        context: {
          headers: {
            'x-hasura-role': 'me',
          },
        },
      });

      await Promise.all(
        selectedImages.map(async (image) => {
          if (image) {
            return storage.delete(`/${image.path}`);
          }
        }),
      );
    } catch (err) {
      if (err) {
        handleError(err);

        toast({
          title: 'Deletion Error',
          description: '[CollectionEditorModal] Error on storage.delete()',
          position: 'top',
          status: 'warning',
          isClosable: true,
          duration: 3000,
        });
      }
    }

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

  const handleTabsChange = (i: number) => {
    setIndex(i);
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
    return () => {
      setSelected([]);
    };
  }, [isOpen, uploaded, input, cleanUp]);

  return (
    <ErrorBoundary>
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
            <Tabs
              isLazy
              width="100%"
              index={index}
              onChange={handleTabsChange}
            >
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
              {selected.length > 0 && index === 1 ? (
                <ConfirmButton
                  label="Delete"
                  message="You can't undo this action. Delete selected images?"
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
    </ErrorBoundary>
  );
};

export default CollectionEditorModal;
