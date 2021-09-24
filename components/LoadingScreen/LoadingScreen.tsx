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

const LoadingScreen = (props: LoadingScreenProps) => {
  const { color, label, onFinish } = props;

  const handleClose = () => {
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  return (
    <Modal
      isOpen
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={handleClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent borderRadius="0">
        <ModalBody display="flex" justifyContent="center" alignItems="center">
          <Flex
            width="100%"
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

            <Flex marginTop="10px">
              {label}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingScreen;
