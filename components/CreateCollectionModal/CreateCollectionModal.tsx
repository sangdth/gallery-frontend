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
  Grid,
  Image,
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
import { AddIcon } from '@chakra-ui/icons';
import { userIdAtom, siteIdAtom } from '../../lib/jotai';
import { storage } from '../../lib/nhost';
import { BASE_ENDPOINT } from '../../lib/constants';
import { collectionAtom } from '../../pages/dashboard/panels/Collections';
import { ImageUpload } from '../ImageUpload';
import type { CollectionInput, ImageType } from '../../lib/types';

type Props = {
  loading?: boolean;
  onSubmit: (input: CollectionInput) => Promise<void>;
  refetch: () => void;
};

const CreatecollectionModal = (props: Props) => {
  const toast = useToast();
  const { loading, onSubmit, refetch } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userId] = useAtom(userIdAtom);
  const [siteId] = useAtom(siteIdAtom);
  const [collection, setCollection] = useAtom(collectionAtom);
  const [uploaded, setUploaded] = useState<Partial<ImageType>[]>([]);

  const initialInput = useMemo(() => ({
    id: uuidv4(),
    site_id: siteId,
    name: '',
    description: '',
    images: [],
  }), [siteId]);

  const [input, setInput] = useState<CollectionInput & { id: string }>(initialInput);

  const isChanged = useMemo(() => {
    if (uploaded.length > 0 || input.name || input.description) {
      return true;
    }
    return false;
  }, [input, uploaded]);

  const cleanUp = useCallback(() => {
    setInput(initialInput);
    setCollection(null);
    setUploaded([]);
  }, [setInput, setCollection, setUploaded, initialInput]);

  // TODO: Use the confirmation button here to detect the removing only when it has images
  // TODO: Make the ConfirmButton has option to by pass alert
  const handleCancel = async () => {
    if (isChanged) {
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

  const handleUpload = (images: Partial<ImageType>[]) => {
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

  const handleSubmit = async () => {
    await onSubmit(input);
    onClose();
  };

  const shouldDisable = !userId || loading;

  useEffect(() => {
    if (collection && !isChanged) {
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
  }, [collection, onOpen, isChanged]);

  useEffect(() => {
    if (!isOpen && isChanged) {
      cleanUp();
    }
  }, [isOpen, isChanged, cleanUp]);

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
          Create new collection
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
            {collection ? 'Edit collection' : 'Create new collection'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
                  <Grid mb={3}>
                    {(input.images ?? []).map((image) => (
                      <Image
                        key={image.id}
                        fit="cover"
                        boxSize="100px"
                        src={`${BASE_ENDPOINT}/storage/o/${image.path}`}
                      />
                    ))}
                  </Grid>

                  <ImageUpload
                    collectionId={input.id}
                    onUpload={handleUpload}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              disabled={!isChanged}
              loadingText={collection ? 'Updating...' : 'Creating...'}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatecollectionModal;
