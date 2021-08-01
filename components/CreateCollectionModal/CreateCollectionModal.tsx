import React, { useState, useEffect, useCallback } from 'react';
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
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { userIdAtom } from '../../lib/jotai';
import { collectionAtom } from '../../pages/dashboard/panels/Collections';
import { ImageUpload } from '../ImageUpload';
import type { CollectionInput, Image } from '../../lib/types';

type Props = {
  loading?: boolean;
  onSubmit: (input: CollectionInput) => Promise<void>;
};

const CreatecollectionModal = (props: Props) => {
  const { loading, onSubmit } = props;
  const [userId] = useAtom(userIdAtom);
  const [collection, setCollection] = useAtom(collectionAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState<CollectionInput>({
    id: uuidv4(),
    name: '',
    description: '',
  });

  const handleCancel = useCallback(() => {
    setInput({
      name: '',
      description: '',
    });
    setCollection(null);
    onClose();
    // TODO: removeImages with onCancel prop in uploader
  }, [onClose, setCollection]);

  const handleDrop = (images: Partial<Image>[]) => {
    setInput({
      ...input,
      images: images.map((o) => ({ ...o, id: uuidv4() })),
    });
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    handleCancel();
  };

  const shouldDisable = !userId || loading;

  useEffect(() => {
    if (collection) {
      setInput({
        description: collection.description,
        id: collection.id,
        name: collection.name,
        site_id: collection.site_id,
        status: collection.status,
        images: collection.images,
      });
      onOpen();
    }
  }, [collection, onOpen, handleCancel]);

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
                      onChange={(e) => setInput({
                        ...input,
                        name: e.currentTarget.value,
                      })}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input
                      placeholder="Description"
                      value={input.description ?? ''}
                      onChange={(e) => setInput({
                        ...input,
                        description: e.currentTarget.value,
                      })}
                    />
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  {(collection?.images ?? []).map((o) => (
                    <div key={o.id}>{o.path}</div>
                  ))}
                  <ImageUpload
                    collection={collection ?? { id: input.id }}
                    onDrop={handleDrop}
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
