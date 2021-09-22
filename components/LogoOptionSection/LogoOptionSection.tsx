import React from 'react';
import {
  Flex,
  HStack,
} from '@chakra-ui/react';
import { ImageUpload, OptionSection } from '@/components';

type LogoOptionSectionProps = {
};

const LogoOptionSection = (props: LogoOptionSectionProps) => {

  return (
    <OptionSection title="Logo">
      <HStack>
        <ImageUpload
          viewType="button"
          onUpload={(what) => console.log(what)}
        />
      </HStack>
    </OptionSection>
  );
};

export default LogoOptionSection;
