import { useState } from 'react';
import {
  Flex,
  HStack,
  Image,
} from '@chakra-ui/react';
import { ImageUpload, OptionSection } from '@/components';
import { makeSrcFromPath } from '@/lib/helpers';
import type { ImageType } from '@/lib/types';

type LogoOptionSectionProps = {
};

const LogoOptionSection = (props: LogoOptionSectionProps) => {
  const [uploaded, setUploaded] = useState();

  const handleUpload = (images: Partial<ImageType>[]) => {
    console.log('### images: ', images);
    setUploaded(images);
  };

  return (
    <OptionSection title="Logo">
      <HStack>
        {uploaded?.map((o) => (
          <Image
            key={o.path}
            alt={o.name}
            src={makeSrcFromPath(o?.path ?? '')}
          />
        ))}

        <ImageUpload
          viewType="button"
          onUpload={handleUpload}
        />
      </HStack>
    </OptionSection>
  );
};

export default LogoOptionSection;
