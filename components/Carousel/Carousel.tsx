import { useState } from 'react';
import { ErrorBoundary, LoadingScreen } from '@/components';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/client';
import { IMAGE_AGGREGATE } from '@/lib/graphqls';
import { THUMBNAIL_LIMIT } from '@/lib/constants';
import { Position } from '@/lib/enums';
import type { Settings } from 'react-slick';
import type { ImageAggregatedData } from '@/lib/types';
import CarouselPlain from './CarouselPlain';

type CarouselProps = {
  collectionId: string;
  settings?: Settings;
  sliderRatio?: number;
  sliderWidth?: number;
  thumbnailColumns?: number,
  thumbnailPosition?: Position;
  thumbnailWidth?: number;
};

const Carousel = (props: CarouselProps) => {
  const {
    collectionId,
    settings = {},
    sliderRatio = 16 / 9,
    sliderWidth = 600,
    thumbnailColumns = 2,
    thumbnailPosition = Position.Left,
    thumbnailWidth = 80,
  } = props;

  const [offset, setOffset] = useState(0);

  const {
    data: imagesData,
    error: queryImagesError,
  } = useQuery<ImageAggregatedData>(IMAGE_AGGREGATE, {
    variables: {
      collectionId,
      offset,
      limit: THUMBNAIL_LIMIT,
    },
    context: {
      headers: {
        'x-hasura-role': 'me',
      },
    },
  });

  useErrorHandler(queryImagesError);

  const handleOnPageChange = (index: number) => {
    setOffset((index - 1) * THUMBNAIL_LIMIT);
  };

  if (!imagesData) {
    return <LoadingScreen label="Getting images..." />;
  }

  const {
    images,
    images_aggregate: { aggregate: { count } },
  } = imagesData;

  return (
    <ErrorBoundary>
      <CarouselPlain
        onPageChange={handleOnPageChange}
        images={images}
        settings={settings}
        sliderRatio={sliderRatio}
        sliderWidth={sliderWidth}
        thumbnailColumns={thumbnailColumns}
        thumbnailPosition={thumbnailPosition}
        thumbnailWidth={thumbnailWidth}
        totalCount={count}
      />
    </ErrorBoundary>
  );
};

export default Carousel;
