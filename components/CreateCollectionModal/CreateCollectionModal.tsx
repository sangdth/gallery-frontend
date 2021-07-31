import React, { useState, useEffect, useCallback } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { userIdAtom } from '../../lib/jotai';
import { collectionAtom } from '../../pages/dashboard/panels/Collections';
import type { CollectionInput } from '../../lib/types';

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
    name: '',
    description: '',
  });

  const handleClose = useCallback(() => {
    setInput({
      name: '',
      description: '',
    });
    setCollection(null);
    onClose();
  }, [onClose, setCollection]);

  const handleSubmit = useCallback(async () => {
    await onSubmit(input);
    handleClose();
  }, [input, handleClose, onSubmit]);

  const shouldDisable = !userId || loading;

  useEffect(() => {
    if (collection) {
      setInput({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        status: collection.status,
      });
      onOpen();
    }
  }, [collection, onOpen, handleClose]);

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
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              loadingText="Creating..."
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatecollectionModal;
