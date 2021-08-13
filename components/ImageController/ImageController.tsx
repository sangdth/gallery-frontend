import React from 'react';
import {
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { BASE_ENDPOINT } from '../../lib/constants';
import type { RecursivePartial, ImageType } from '../../lib/types';

type ImageControllerProps = {
  images: RecursivePartial<ImageType>[];
  selected: string[];
  onSelect: (selections: string[]) => void;
};

export const ImageController = (props: ImageControllerProps) => {
  const { images, selected, onSelect } = props;

  const isSelected = (target: string) => selected.some(id => id === target);

  const handleSelect = (target: string) => {
    const tmp = [...selected];
    const foundIndex = tmp.findIndex(id => id === target);

    if (foundIndex > -1) {
      tmp.splice(foundIndex, 1);
    } else {
      tmp.push(target);
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
          fit="cover"
          padding="1px"
          boxSize="110px"
          border="4px"
          borderRadius="8px"
          _hover={{ cursor: 'pointer' }}
          borderColor={isSelected(image.id ?? '') ? 'blue.500' : 'white'}
          src={`${BASE_ENDPOINT}/storage/o/${image.path}`}
          onClick={() => handleSelect(image.id ?? '')}
        />
      ))}
    </SimpleGrid>
  );
};

export default ImageController;
