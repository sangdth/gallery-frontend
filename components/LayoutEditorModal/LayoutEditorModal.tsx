import React, { useEffect, useState } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ConfirmButton } from '../ConfirmButton';
import { Input } from '../Input';
import { GridEditor } from '../GridEditor';
import { meAtom, layoutAtom } from '../../lib/jotai';
import type { LayoutInput } from '../../lib/types';

type Props = {
  loading?: boolean;
  onSubmit: (input: LayoutInput) => Promise<void>;
  refetch: () => void;
};

const LayoutEditorModal = (props: Props) => {
  const {
    loading,
    onSubmit,
    refetch,
  } = props;

  const [me] = useAtom(meAtom);
  const [selectedLayout, setSelectedLayout] = useAtom(layoutAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialInput = {
    id: uuidv4(),
    name: '',
    value: null,
    ...(selectedLayout ?? {}),
  };

  const [input, setInput] = useState<LayoutInput>(initialInput);

  const shouldDisable = !me?.id || loading;
  const isEmptyInput = !input.name && !input.value;
  const hasChanged = selectedLayout && (
    input.name !== selectedLayout.name || input.value !== selectedLayout.value
  );

  const cleanUp = () => {
    setInput({ ...initialInput, id: uuidv4() });
    setSelectedLayout(null);
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    onClose();
    refetch();
  };

  const handleOpen = () => {
    onOpen();
  };

  const handleCancel = () => {
    cleanUp();
    onClose();
  };

  const handleOnChange = (key: string, value: string) => {
    setInput({
      ...input,
      [key]: value,
    });
  };

  useEffect(() => {
    if (!isOpen && selectedLayout && isEmptyInput) {
      setInput({
        id: selectedLayout.id,
        name: selectedLayout.name,
        value: selectedLayout.value,
        status: selectedLayout.status,
      });

      onOpen();
    }
  }, [isEmptyInput, isOpen, onOpen, selectedLayout, input]);

  useEffect(() => {
    // TODO: Compare input.value with default layout
    const isDirtyInput = !!input.name;
    if (!isOpen && isDirtyInput) {
      cleanUp();
    }
  }, [isOpen, input, cleanUp]);

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
          onClick={handleOpen}
        >
          Create New Layout
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
            {selectedLayout ? `Edit Layout: ${selectedLayout.name}` : 'Create New Layout'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Layout name"
                width="300px"
                value={input.name}
                onChange={(e) => handleOnChange('name', e.currentTarget.value)}
              />
            </FormControl>

            <GridEditor />
          </ModalBody>

          <ModalFooter>
            <ConfirmButton
              label="Cancel"
              message="Ignore changes?"
              buttonProps={{ marginRight: 3 }}
              ignoreConfirm={isEmptyInput || !hasChanged}
              onConfirm={handleCancel}
            />
            <Button
              isLoading={loading}
              loadingText="Creating..."
              colorScheme="blue"
              mr={3}
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

export default LayoutEditorModal;
