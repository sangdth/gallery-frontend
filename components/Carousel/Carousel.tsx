import deepmerge from 'deepmerge';
import SlickSlider from 'react-slick';
import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AspectRatio,
  Box,
  Flex,
  Image,
} from '@chakra-ui/react';
import {
  ErrorBoundary,
  ThumbnailControl,
} from '@/components';
import { makeSrcFromPath } from '@/lib/helpers';
import { Position } from '@/lib/enums';
import type { Settings } from 'react-slick';
import type { ImageType } from '@/lib/types';

const defaultSettings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 100,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};

type CarouselProps = {
  settings?: Settings;
  images: ImageType[];
  thumbnailColumns?: number,
  thumbnailPosition?: Position;
  thumbnailWidth?: number;
  sliderWidth?: number;
  sliderRatio?: number;
};

export const Carousel = (props: CarouselProps) => {
  const {
    settings = {},
    images,
    thumbnailColumns = 2,
    thumbnailPosition = Position.Left,
    thumbnailWidth = 80,
    sliderWidth = 600,
    sliderRatio = 16 / 9,
  } = props;

  const [current, setCurrent] = useState<ImageType>(images[0]);
 
  const slickRef = useRef<SlickSlider>(null);

  const finalSettings = deepmerge(
    {
      ...defaultSettings,
      afterChange: (index: number) => {
        if (slickRef.current && index > -1) {
          slickRef.current.slickGoTo(index);
          setCurrent(images[index]);
        }
      },
    },
    settings,
  );

  const wrapperWidth = useMemo(() => {
    return sliderWidth + thumbnailWidth * thumbnailColumns + 8;
  }, [sliderWidth, thumbnailWidth, thumbnailColumns]);

  const onClickImage = (image: ImageType) => {
    const foundIndex = images.findIndex((o) => o.id === image.id);
    if (slickRef.current && foundIndex > -1) {
      slickRef.current.slickGoTo(foundIndex);
      setCurrent(images[foundIndex]);
    }
  };

  return (
    <ErrorBoundary>
      <Flex width={wrapperWidth} marginX="auto">
        <ThumbnailControl
          position={thumbnailPosition}
          images={images}
          current={current}
          nextLabel="〉"
          previousLabel="〈"
          onClickThumbnail={onClickImage}
        />
        <Box width={sliderWidth}>
          <SlickSlider ref={slickRef} {...finalSettings}>
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
    </ErrorBoundary>
  );
};

export default Carousel;
