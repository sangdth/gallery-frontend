import React, { useState } from 'react';
import { useAtom } from 'jotai';
import {
  Button,
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
import type { CollectionType } from '../../lib/types';

type Props = {
  loading?: boolean;
  onSubmit: (input: Partial<CollectionType>) => Promise<void>;
};

const CreatecollectionModal = (props: Props) => {
  const { loading, onSubmit } = props;
  const [userId] = useAtom(userIdAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState<Partial<CollectionType>>({
    name: '',
    description: '',
  });

  const handleClose = () => {
    setInput({
      name: '',
      description: '',
    });
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    handleClose();
  };

  const shouldDisable = !userId || loading;

  return (
    <>
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
                onChange={(e) => setInput({ ...input, name: e.currentTarget.value })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                value={input.description ?? ''}
                onChange={(e) => setInput({ ...input, description: e.currentTarget.value })}
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
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatecollectionModal;
