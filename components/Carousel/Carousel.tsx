import React from 'react';
import deepmerge from 'deepmerge';
import SlickSlider from 'react-slick';
import { AspectRatio, Box, Image } from '@chakra-ui/react';
import { makeSrcFromPath } from '@/lib/helpers';
import type { Settings } from 'react-slick';
import type { ImageType } from '@/lib/types';

const defaultSettings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

type CarouselProps = {
  settings?: Settings;
  images: ImageType[];
  width?: number | string;
};

export const Carousel = (props: CarouselProps) => {
  const {
    settings = {},
    images,
    width = 600,
  } = props;
  
  const finalSettings = deepmerge(defaultSettings, settings);

  return (
    <Box width={width} marginX="auto">
      <SlickSlider {...finalSettings}>
        {images.map((image) => (
          <AspectRatio key={image.id} maxWidth={width} ratio={16 / 9}>
            <Image
              alt={image.name ?? ''}
              src={makeSrcFromPath(image.path)}
            />
          </AspectRatio>
        ))}
      </SlickSlider>
    </Box>
  );
};

export default Carousel;
