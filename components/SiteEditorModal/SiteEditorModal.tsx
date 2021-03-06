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
  Box,
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
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useErrorHandler } from 'react-error-boundary';
import {
  ConfirmButton,
  ErrorBoundary,
  Input,
} from '@/components';
import { meAtom, siteAtom } from '@/lib/jotai';
import type { SiteType, SiteInput } from '@/lib/types';

type Props = {
  isEditing: boolean;
  loading?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (input: Partial<SiteType>) => Promise<void>;
  refetch: () => void;
};

const SiteEditorModal = (props: Props) => {
  const {
    isEditing,
    loading,
    onClose: onCloseProp,
    onOpen: onOpenProp,
    onSubmit,
    refetch,
  } = props;

  const [me] = useAtom(meAtom);
  const [selectedSite, setSelectedSite] = useAtom(siteAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleError = useErrorHandler();

  const initialInput = useMemo(() => ({
    id: uuidv4(),
    name: '',
    description: '',
    slug: '',
  }), []);

  const [input, setInput] = useState<SiteInput>(initialInput);
  const [manual, setManual] = useState(false);

  const shouldDisable = !me?.id || loading;
  const isEmptyInput = !input.name && !input.description;
  const hasChanged = useMemo(() => !!selectedSite && (
    input.name !== selectedSite.name || input.description !== selectedSite.description
  ), [input, selectedSite]);

  const cleanUp = useCallback(() => {
    setInput({ ...initialInput, id: uuidv4() });
    setSelectedSite(null);
  }, [initialInput, setSelectedSite]);

  const handleSubmit = async () => {
    try {
      await onSubmit(input);
      onClose();
      refetch();
    } catch (err) {
      handleError(err);
    }
  };

  const handleOpen = () => {
    onOpen();
    onOpenProp();
  };

  const handleCancel = () => {
    cleanUp();
    onClose();
    onCloseProp();
  };

  const handleOnChange = (key: string, value: string) => {
    if (key === 'slug') {
      setManual(true);
    }

    setInput({
      ...input,
      [key]: value,
    });
  };

  useEffect(() => {
    const slug = slugify(input.name ?? '', { lower: true });
    if (input.name && input.slug !== slug && !manual) {
      setInput({ ...input, slug });
    }
  }, [input, manual, setManual]);

  useEffect(() => {
    if (isOpen && selectedSite && isEmptyInput) {
      setInput({
        id: selectedSite.id,
        name: selectedSite.name,
        slug: selectedSite.slug,
        description: selectedSite.description,
        status: selectedSite.status,
      });
    }
  }, [isOpen, isEmptyInput, selectedSite, input]);

  useEffect(() => {
    if (!isOpen && isEditing) {
      onOpen();
    }
    if (isOpen && !isEditing) {
      cleanUp();
      onClose();
    }
  }, [isOpen, isEditing, input, cleanUp, onClose, onOpen]);

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
          onClick={handleOpen}
        >
          Create new site
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
            {selectedSite ? `Edit Site: ${selectedSite.name}` : 'Create new site'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Site name"
                value={input.name}
                onChange={(e) => handleOnChange('name', e.currentTarget.value)}
              />
              <Box>
                <Code>
                  {`/sites/${input.slug}`}
                </Code>
              </Box>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Slug</FormLabel>
              <Input
                type="action"
                icon={<RepeatIcon />}
                placeholder="site-slug"
                value={input.slug ?? ''}
                onClick={() => setManual(false)}
                onChange={(e) => handleOnChange('slug', e.currentTarget.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Site description"
                value={input.description ?? ''}
                onChange={(e) => handleOnChange('description', e.currentTarget.value)}
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

export default SiteEditorModal;
