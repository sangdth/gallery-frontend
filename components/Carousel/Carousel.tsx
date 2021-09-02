import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import SlickSlider from 'react-slick';
import { makeImageSrc } from '@/lib/helpers';
import type { Settings } from 'react-slick';
import type { ImageType } from '@/lib/types';

const defaultSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

type CarouselProps = {
  settings?: Settings;
  images: ImageType[];
};

export const Carousel = (props: CarouselProps) => {
  const {
    settings = defaultSettings,
    images,
  } = props;

  return (
    <Box width="100%" bg="green">
      <SlickSlider {...settings}>
        {images.map((image) => (
          <Image
            key={image.id}
            alt={image.name ?? ''}
            src={makeImageSrc(image.path)}
          />
        ))}
      </SlickSlider>
    </Box>
  );
};

export default Carousel;
