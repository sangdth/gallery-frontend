import React from 'react';
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Spinner,
} from '@chakra-ui/react';

type LoadingScreenProps = {
  color?: string;
  label?: string;
  onFinish?: () => void;
};

export const LoadingScreen = (props: LoadingScreenProps) => {
  const { color, label, onFinish } = props;

  const handleClose = () => {
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  return (
    <Modal onClose={handleClose} size="full" isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex
            width="100%"
            height="100vh"
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner
              size="xl"
              thickness="4px"
              color={color ?? 'green.400'}
              label={label ?? 'Loading...'}
            />

            {label}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
