import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { useAtom } from 'jotai';
import {
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ConfirmButton, ErrorBoundary } from '@/components';
import { useErrorHandler } from 'react-error-boundary';
import { meAtom, pageAtom } from '@/lib/jotai';
import type { PageInput, CollectionType } from '@/lib/types';

type Props = {
  loading?: boolean;
  collections?: CollectionType[];
  onSubmit: (input: PageInput) => Promise<void>;
  refetch: () => void;
};

const PageEditorModal = (props: Props) => {
  const {
    loading,
    collections,
    onSubmit,
    refetch,
  } = props;

  const [me] = useAtom(meAtom);
  const [selectedPage, setSelectedPage] = useAtom(pageAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleError = useErrorHandler();

  const initialInput = useMemo(() => ({
    id: uuidv4(),
    name: '',
    content: '',
    slug: '',
    collection_id: null,
    ...(selectedPage ?? {}),
  }), [selectedPage]);

  const [input, setInput] = useState<PageInput>(initialInput);

  const shouldDisable = !me?.id || loading;
  const isEmptyInput = !input.name && !input.content;
  const hasChanged = selectedPage && (
    input.name !== selectedPage.name || input.content !== selectedPage.content
  );

  const cleanUp = useCallback(() => {
    setInput({ ...initialInput, id: uuidv4() });
    setSelectedPage(null);
  }, [initialInput, setSelectedPage]);

  const handleSubmit = async () => {
    try {
      await onSubmit(input);
      onClose();
      refetch();
    } catch (err) {
      handleError(err);
    }
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

  const handleOnSelect = (e: React.FormEvent<HTMLSelectElement>) => {
    const id = e.currentTarget.value;
    handleOnChange('collection_id', id ?? null);
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
        collection_id: selectedPage.collection_id,
      });

      onOpen();
    }
  }, [isOpen, onOpen, selectedPage, input]);

  useEffect(() => {
    if (!isOpen && !isEmptyInput) {
      cleanUp();
    }
  }, [isOpen, isEmptyInput, input, cleanUp]);

  return (
    <ErrorBoundary>
      <Flex justify="flex-end" marginBottom="20px">
        <Button
          size="lg"
          fontWeight={600}
          color="white"
          bg="green.400"
          leftIcon={<AddIcon />}
          isLoading={loading}
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
              <Code>
                {`/pages/${input.slug}`}
              </Code>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Attach Collection</FormLabel>
              <Select
                placeholder="Select collection"
                value={input.collection_id ?? undefined}
                onChange={handleOnSelect}
              >
                {collections && collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </Select>
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
    </ErrorBoundary>
  );
};

export default PageEditorModal;
