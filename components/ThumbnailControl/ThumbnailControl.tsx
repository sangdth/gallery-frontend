import React, { useMemo } from 'react';
import {
  AspectRatio,
  Box,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@/components';
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
    if (typeof onClick === 'function') {
      onClick(image);
    }
  };

  return (
    <Box {...calculatedMargins}>
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        <PaginationContainer>
          <PaginationPrevious
            _hover={{
              bg: 'yellow.400',
            }}
            bg="yellow.300"
            onClick={() => console.warn("I'm clicking the previous")}
          >
            Previous
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
            _hover={{
              bg: 'yellow.400',
            }}
            bg="yellow.300"
            onClick={() => console.warn("I'm clicking the next")}
          >
            Next
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
  );
};

export default ThumbnailControl;
