import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Divider,
} from '@chakra-ui/react';

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
};

export const ErrorFallback = (props: ErrorFallbackProps) => {
  const { error, resetErrorBoundary } = props;

  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />

      <AlertTitle mt={4} mb={1} fontSize="lg">
        Something went wrong!
      </AlertTitle>

      <AlertDescription maxWidth="sm">
        {error.message}
      </AlertDescription>

      <Divider marginY="12px"/>

      <Button onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Alert>
  );
};
