import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { useAtom } from 'jotai';
import {
  Button,
  Code,
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
import { ConfirmButton } from '../ConfirmButton';
import { userIdAtom, pageAtom } from '../../lib/jotai';
import type { PageInput } from '../../lib/types';

type Props = {
  loading?: boolean;
  onSubmit: (input: PageInput) => Promise<void>;
  refetch: () => void;
};

const CreatePageModal = (props: Props) => {
  const { loading, onSubmit, refetch } = props;
  const [userId] = useAtom(userIdAtom);
  const [selectedPage, setSelectedPage] = useAtom(pageAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialInput = {
    id: uuidv4(),
    name: '',
    content: '',
    slug: '',
    ...(selectedPage ?? {}),
  };

  const [input, setInput] = useState<PageInput>(initialInput);

  const shouldDisable = !userId || loading;
  const isEmptyInput = !input.name && !input.content;
  const hasChanged = selectedPage && (
    input.name !== selectedPage.name || input.content !== selectedPage.content
  );

  const cleanUp = () => {
    setInput({ ...initialInput, id: uuidv4() });
    setSelectedPage(null);
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    onClose();
    refetch();
  };

  const handleCancel = async () => {
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
    const slug = slugify(input.name ?? '', { lower: true });
    if (input.name && input.slug !== slug) {
      setInput({ ...input, slug });
    }
  }, [input]);

  useEffect(() => {
    if (!isOpen && selectedPage && (!input.name && !input.content)) {
      setInput({
        id: selectedPage.id,
        name: selectedPage.name,
        content: selectedPage.content,
        slug: selectedPage.slug,
        status: selectedPage.status,
      });

      onOpen();
    }
  }, [isOpen, onOpen, selectedPage, input]);

  useEffect(() => {
    if (!isOpen && !isEmptyInput) {
      cleanUp();
    }
  }, [isOpen, input, cleanUp]);

  return (
    <>
      <Flex justify="flex-end" marginBottom="20px">
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
          Create New Page
        </Button>
      </Flex>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleCancel}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedPage ? `Edit page: ${selectedPage.name}` : 'Create new page'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Page name"
                value={input.name}
                onChange={(e) => handleOnChange('name', e.currentTarget.value)}
              />
              Slug: <Code children={`/pages/${input.slug}`} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Content</FormLabel>
              <Input
                placeholder="Page content"
                value={input.content ?? ''}
                onChange={(e) => handleOnChange('content', e.currentTarget.value)}
              />
            </FormControl>
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

export default CreatePageModal;
