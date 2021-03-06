import React from 'react';
import {
  Divider,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ErrorBoundary } from '@/components';

type OptionSectionProps = {
  title: string;
  description?: string;
  isLastItem?: boolean;
  children: React.ReactElement;
};

const OptionSection = (props: OptionSectionProps) => {
  const {
    children,
    description = '',
    isLastItem = false,
    title,
  } = props;

  return (
    <ErrorBoundary>
      <Flex direction="column">
        <Heading as="h3" size="md">
          {title}
        </Heading>
        <Text fontSize="lg">
          {description}
        </Text>

        <Flex direction="row" marginY="10px">
          {children}
        </Flex>

        {!isLastItem && <Divider marginBottom="20px" />}
      </Flex>
    </ErrorBoundary>
  );
};

export default OptionSection;
