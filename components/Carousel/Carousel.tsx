import React, { useMemo } from 'react';
import deepmerge from 'deepmerge';
import SlickSlider from 'react-slick';
import {
  AspectRatio,
  Box,
  Flex,
  Image,
} from '@chakra-ui/react';
import { ThumbnailControl } from '@/components';
import { makeSrcFromPath } from '@/lib/helpers';
import type { Settings } from 'react-slick';
import type { ImageType } from '@/lib/types';

const defaultSettings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 500,
  // fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};

type CarouselProps = {
  settings?: Settings;
  images: ImageType[];
  thumbnailColumns?: number,
  thumbnailWidth?: number;
  sliderWidth?: number;
  sliderRatio?: number;
};

export const Carousel = (props: CarouselProps) => {
  const {
    settings = {},
    images,
    thumbnailColumns = 2,
    thumbnailWidth = 80,
    sliderWidth = 600,
    sliderRatio = 16 / 9,
  } = props;
  
  const finalSettings = deepmerge(defaultSettings, settings);

  const wrapperWidth = useMemo(() => {
    return sliderWidth + thumbnailWidth * thumbnailColumns + 8;
  }, [sliderWidth, thumbnailWidth, thumbnailColumns]);

  const onClickImage = (image: ImageType) => {
    console.log('### image: ', image);
  };

  return (
    <Flex width={wrapperWidth} marginX="auto">
      <ThumbnailControl
        images={images}
        onClick={onClickImage}
      />
      <Box width={sliderWidth}>
        <SlickSlider {...finalSettings}>
          {images.map((image) => (
            <AspectRatio
              key={`slide-${image.id}`}
              maxWidth={sliderWidth}
              ratio={sliderRatio}
            >
              <Image
                alt={image.name ?? ''}
                src={makeSrcFromPath(image.path)}
              />
            </AspectRatio>
          ))}
        </SlickSlider>
      </Box>
    </Flex>
  );
};

export default Carousel;
