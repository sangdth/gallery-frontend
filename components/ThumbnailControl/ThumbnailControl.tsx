import React, { useMemo } from 'react';
import {
  AspectRatio,
  Box,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  ErrorBoundary,
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination,
} from '@/components';
import { makeSrcFromPath } from '@/lib/helpers';
import { Position } from '@/lib/enums';
import type { ImageType } from '@/lib/types';

const pageJumperStyles = {
  _hover: {
    bg: 'transparent',
  },
  _focus: {
    bg: 'transparent',
  },
  _active: {
    bg: 'transparent',
  },
  bg: 'transparent',
};

export type ThumbnailControlProps = {
  columns?: number;
  current: ImageType | null;
  images: ImageType[];
  nextLabel?: string;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  onClickThumbnail?: (image: ImageType) => void;
  onPageChange?: (p: number) => void;
  position?: Position;
  previousLabel?: string;
  thumbnailWidth?: number;
  width?: number;
};

export const ThumbnailControl = (props: ThumbnailControlProps) => {
  const {
    columns = 2,
    current,
    images,
    nextLabel,
    onClickNext,
    onClickPrevious,
    onClickThumbnail,
    onPageChange,
    position = Position.Left,
    previousLabel,
    thumbnailWidth = 80,
    width = 164,
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


  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
  } = usePagination({
    total: images.length,
    initialState: {
      pageSize: 5,
      isDisabled: false,
      currentPage: 1,
    },
  });

  const handleOnClick = (image: ImageType) => {
    if (typeof onClickThumbnail === 'function') {
      onClickThumbnail(image);
    }
  };

  const handleOnPageChange = (index: number) => {
    if (typeof onPageChange === 'function') {
      onPageChange(index);
    }
    setCurrentPage(index);
  };

  return (
    <ErrorBoundary>
      <Box {...calculatedMargins}>
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handleOnPageChange}
        >
          <PaginationContainer>
            <PaginationPrevious
              {...pageJumperStyles}
              onClick={onClickPrevious}
            >
              {previousLabel ?? 'Previous'}
            </PaginationPrevious>

            <PaginationPageGroup>
              {pages.map((page: number) => (
                <PaginationPage 
                  key={`pagination_page_${page}`} 
                  page={page} 
                />
              ))}
            </PaginationPageGroup>

            <PaginationNext
              {...pageJumperStyles}
              onClick={onClickNext}
            >
              {nextLabel ?? 'Next'}
            </PaginationNext>
          </PaginationContainer>
        </Pagination>

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
    </ErrorBoundary>
  );
};

export default ThumbnailControl;
