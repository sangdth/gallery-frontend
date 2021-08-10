import React, { useEffect, useState, useRef } from 'react';
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
  alertProps?: Partial<React.ComponentProps<typeof AlertDialog>>;
  buttonProps?: Partial<React.ComponentProps<typeof Button | typeof IconButton>>;
  cancelText?: string;
  confirmText?: string;
  icon?: JSX.Element;
  iconOnly?: boolean;
  ignoreConfirm?: boolean;
  label: string;
  message?: string;
  onCancel?: () => void;
  onConfirm: () => void;
};

export const ConfirmButton = (props: Props) => {
  const {
    alertProps,
    buttonProps,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    icon,
    iconOnly = false,
    ignoreConfirm = false,
    label,
    message = '',
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

  const handleAnchorClick = () => {
    if (ignoreConfirm) {
      onConfirm();
    } else {
      setIsOpen(true);
    }
  };

  const hoverBg = useColorModeValue('red.400', 'gray.600');

  useEffect(() => {
    if (isOpen) {
      return () => setIsOpen(false);
    }
  }, [isOpen, setIsOpen]);

  return (
    <>
      {iconOnly ? (
        <IconButton
          {...buttonProps}
          aria-label={label}
          icon={icon}
          borderRadius="4px"
          _hover={{ bg: hoverBg, color: 'white' }}
          onClick={handleAnchorClick}
        />
      ) : (
        <Button
          {...buttonProps}
          leftIcon={icon}
          borderRadius="4px"
          _hover={{ bg: hoverBg, color: 'white' }}
          onClick={handleAnchorClick}
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
