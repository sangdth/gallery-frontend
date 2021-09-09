import React from 'react';
import { AspectRatio, Box, Image } from '@chakra-ui/react';
import SlickSlider from 'react-slick';
import { makeImageSrc } from '@/lib/helpers';
import type { Settings } from 'react-slick';
import type { ImageType } from '@/lib/types';

const defaultSettings = {
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
    settings = defaultSettings,
    images,
    width = 600,
  } = props;

  return (
    <Box width={width} height="1200px" marginX="auto">
      <SlickSlider {...settings}>
        {images.map((image) => (
          <AspectRatio key={image.id} maxWidth={width} ratio={16 / 9}>
            <Image
              alt={image.name ?? ''}
              src={makeImageSrc(image.path)}
            />
          </AspectRatio>
        ))}
      </SlickSlider>
    </Box>
  );
};

export default Carousel;
