import React, { useEffect, useState } from 'react';
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
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { userIdAtom } from '../../lib/jotai';
import type { SiteType } from '../../lib/types';

type Props = {
  loading?: boolean;
  onSubmit: (input: Partial<SiteType>) => Promise<void>;
};

const CreateSiteModal = (props: Props) => {
  const { loading, onSubmit } = props;
  const [userId] = useAtom(userIdAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState<Partial<SiteType>>({
    name: '',
    description: '',
    slug: '',
  });

  const handleClose = () => {
    setInput({
      name: '',
      description: '',
      slug: '',
    });
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    handleClose();
  };

  useEffect(() => {
    const slug = slugify(input.name ?? '', { lower: true });
    if (input.name && input.slug !== slug) {
      setInput({ ...input, slug });
    }
  }, [input]);

  const shouldDisable = !userId || loading;

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
          Create new site
        </Button>
      </Flex>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new site</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Site name"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.currentTarget.value })}
              />
              <Box>
                Slug: <Code children={`/sites/${input.slug}`} />
              </Box>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Site description"
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

export default CreateSiteModal;
