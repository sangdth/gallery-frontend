import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
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

type SiteInput = {
  name: string;
  description: string;
  slug: string;
  user_id: string;
};
type Props = {
  onSubmit: (input: any) => void;
};

const CreateSiteModal = (props: Props) => {
  const { onSubmit } = props;
  const [userId] = useAtom(userIdAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState<SiteInput>({
    name: '',
    description: '',
    slug: '',
    user_id: userId,
  });

  const handleClose = () => {
    setInput({
      name: '',
      description: '',
      slug: '',
      user_id: userId,
    });
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({
      variables: { object: input },
    });
  };

  useEffect(() => {
    const slug = slugify(input.name, { lower: true });
    if (input.name && input.slug !== slug) {
      setInput({ ...input, slug });
    }
  }, [input]);

  return (
    <>
      <Button
        size="lg"
        fontWeight={600}
        color="white"
        bg="green.400"
        leftIcon={<AddIcon />}
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
            </FormControl>

            <FormControl>
              <FormLabel>Slug (auto generated)</FormLabel>
              <Input placeholder="site-slug" value={input.slug} readOnly />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Site description"
                value={input.description}
                onChange={(e) => setInput({ ...input, description: e.currentTarget.value })}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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
