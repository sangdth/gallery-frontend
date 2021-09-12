import React, { useMemo } from 'react';
import { AspectRatio, Box, Image, SimpleGrid } from '@chakra-ui/react';
import { makeSrcFromPath } from '@/lib/helpers';
import { Position } from '@/lib/enums';
import type { ImageType } from '@/lib/types';

export type ThumbnailControlProps = {
  images: ImageType[];
  columns?: number;
  thumbnailWidth?: number;
  width?: number;
  position?: Position;
  onClick: (image: ImageType) => void;
  current: ImageType | null;
};

export const ThumbnailControl = (props: ThumbnailControlProps) => {
  const {
    images,
    columns = 2,
    thumbnailWidth = 80,
    width = 164,
    position = Position.Left,
    onClick,
    current,
  } = props;
 
  const calculatedMargins = useMemo(() => {
    switch (position) {
    case Position.Left:
      return {
        marginRight: '4px',
      };
    case Position.Right:
      return {
        marginLeft: '4px',
      };
    case Position.Top:
      return {
        marginDown: '4px',
      };
    case Position.Down:
      return {
        marginTop: '4px',
      };
    default:
      return {
        marginRight: '4px',
      };
    }
  }, [position]);

  const handleOnClick = (image: ImageType) => {
    if (typeof onClick === 'function') {
      onClick(image);
    }
  };

  return (
    <Box {...calculatedMargins}>
      <SimpleGrid
        columns={columns}
        width={width}
        spacing={1}
      >
        {images.map((image) => (
          <AspectRatio
            key={`thumb-${image.id}`}
            maxWidth={thumbnailWidth}
            ratio={1}
            onClick={() => handleOnClick(image)}
            _hover={{ cursor: 'pointer' }}
            opacity={image.id === current?.id ? 1 : 0.7}
          >
            <Image
              src={makeSrcFromPath(image.path)}
              alt={image.name ?? image.path}
            />
          </AspectRatio>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ThumbnailControl;
