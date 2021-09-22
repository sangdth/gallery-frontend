import {
  useEffect,
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
import { ThumbnailControl } from '@/components';
import deepmerge from 'deepmerge';
import SlickSlider from 'react-slick';
import { makeSrcFromPath } from '@/lib/helpers';
import { Position } from '@/lib/enums';
import { THUMBNAIL_LIMIT } from '@/lib/constants';
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


type CarouselPlainProps = {
  images: ImageType[];
  onClickThumbnail?: (image: ImageType) => void;
  onPageChange?: (index: number) => void;
  settings?: Settings;
  sliderRatio?: number;
  sliderWidth?: number;
  thumbnailColumns?: number,
  thumbnailPosition?: Position;
  thumbnailWidth?: number;
  totalCount: number;
};

const CarouselPlain = (props: CarouselPlainProps) => {
  const {
    images,
    onClickThumbnail,
    onPageChange,
    settings = {},
    sliderRatio = 16 / 9,
    sliderWidth = 600,
    thumbnailColumns = 2,
    thumbnailPosition = Position.Left,
    thumbnailWidth = 80,
    totalCount,
  } = props;

  const slickRef = useRef<SlickSlider>(null);

  const wrapperWidth = useMemo(() => {
    return sliderWidth + thumbnailWidth * thumbnailColumns + 8;
  }, [sliderWidth, thumbnailWidth, thumbnailColumns]);

  const [current, setCurrent] = useState<ImageType | null>(null);

  useEffect(() => {
    if (images && !current) {
      setCurrent(images[0]);
    }
  }, [images, current]);

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

  const handleOnClickThumbnail = (image: ImageType) => {
    const foundIndex = images.findIndex((o) => o.id === image.id);
    if (slickRef.current && foundIndex > -1) {
      slickRef.current.slickGoTo(foundIndex);
      setCurrent(images[foundIndex]);
    }
    if (typeof onClickThumbnail === 'function') {
      onClickThumbnail(image);
    }
  };

  return (
    <Flex width={wrapperWidth} marginX="auto">
      <ThumbnailControl
        position={thumbnailPosition}
        images={images}
        totalCount={totalCount}
        current={current}
        pageSize={THUMBNAIL_LIMIT}
        nextLabel="〉"
        previousLabel="〈"
        onClickThumbnail={handleOnClickThumbnail}
        onPageChange={onPageChange}
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
  );
};

export default CarouselPlain;
