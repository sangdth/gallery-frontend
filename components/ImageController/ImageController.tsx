import React from 'react';
import {
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { makeImageSrc } from '@/lib/helpers';
import type { RecursivePartial, ImageType } from '@/lib/types';

type ImageControllerProps = {
  images: RecursivePartial<ImageType>[];
  selected: string[];
  onSelect: (selections: string[]) => void;
};

// TODO: Make select all and discard action to select/deselect all
export const ImageController = (props: ImageControllerProps) => {
  const { images, selected, onSelect } = props;

  const isSelected = (target?: string) => selected.some((id) => id === target);

  const handleSelect = (target?: string) => {
    const tmp = [...selected];
    const foundIndex = tmp.findIndex((id) => id === target);

    if (foundIndex > -1) {
      tmp.splice(foundIndex, 1);
    } else {
      tmp.push(target ?? '');
    }

    onSelect(tmp);
  };

  return (
    <SimpleGrid
      mb={6}
      columns={5}
      spacingY={5}
      maxHeight={300}
      overflowY="scroll"
    >
      {images.map((image) => (
        <Image
          key={image.id}
          alt={image.name ?? ''}
          fit="cover"
          padding="1px"
          boxSize="110px"
          border="4px"
          borderRadius="8px"
          _hover={{ cursor: 'pointer' }}
          borderColor={isSelected(image.id) ? 'blue.500' : 'white'}
          src={makeImageSrc(image.path)}
          onClick={() => handleSelect(image.id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default ImageController;
