import React, { useState } from 'react';
import {
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { BASE_ENDPOINT } from '../../lib/constants';
import type { RecursivePartial, ImageType } from '../../lib/types';

type ImageControllerProps = {
  images: RecursivePartial<ImageType>[];
  onSelect: (selections: string[]) => void;
};

export const ImageController = (props: ImageControllerProps) => {
  const { images, onSelect } = props;
  const [selected, setSelected] = useState<string[]>([]);

  const isSelected = (target: string) => selected.some(id => id === target);

  const handleSelect = (target: string) => {
    const tmpSelected = [...selected];
    const foundIndex = selected.findIndex(id => id === target);
    if (foundIndex > -1) {
      tmpSelected.splice(foundIndex, 1);
    } else {
      tmpSelected.push(target);
    }
    setSelected(tmpSelected);

    if (typeof onSelect === 'function') {
      onSelect(tmpSelected);
    }
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
