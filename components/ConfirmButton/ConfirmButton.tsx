import React, { useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';

export type Props = {
  iconOnly?: boolean;
  icon?: JSX.Element;
  message?: string;
  label: string;
  alertProps?: Partial<React.ComponentProps<typeof AlertDialog>>;
  buttonProps?: Partial<React.ComponentProps<typeof Button | typeof IconButton>>;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm: () => void;
};

export const ConfirmButton = (props: Props) => {
  const {
    alertProps,
    buttonProps,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    iconOnly = false,
    label,
    message = '',
    icon,
    onCancel,
    onConfirm,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    onClose();
  };

  const hoverBg = useColorModeValue('red.400', 'gray.600');

  return (
    <>
      {iconOnly ? (
        <IconButton
          {...buttonProps}
          aria-label={label}
          icon={icon}
          borderRadius="4px"
          _hover={{ bg: hoverBg, color: 'white' }}
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <Button
          {...buttonProps}
          leftIcon={icon}
          borderRadius="4px"
          _hover={{ bg: hoverBg, color: 'white' }}
          onClick={() => setIsOpen(true)}
        >
          {label}
        </Button>
      )}

      <AlertDialog
        {...alertProps}
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {message}
            </AlertDialogHeader>

            <AlertDialogBody>
              {message ?? 'Are you sure?'}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancel}>
                {cancelText}
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                {confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmButton;
