import React, { useLayoutEffect } from 'react';
import { useMeasure } from 'react-use';
import { useUpdateAtom } from 'jotai/utils';
import { Flex } from '@chakra-ui/react';
import { Carousel } from '@/components';
import { childrenHeightAtom } from '@/lib/jotai';
import type { PageType } from '@/lib/types';

export type MainTemplateProps = {
  page?: PageType;
};

export const MainTemplate = (props: MainTemplateProps) => {
  const { page } = props;
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const updateChildrenHeight = useUpdateAtom(childrenHeightAtom);

  useLayoutEffect(() => {
    updateChildrenHeight(height);
  }, [height, updateChildrenHeight]);

  if (!page) {
    return <>Error getting page content</>;
  }

  return (
    <Flex ref={ref} bg="gray" >
      {page.collection && (
        <Carousel
          images={page.collection.images}
          width={600}
        />
      )}
      {!page.collection && page?.content}
    </Flex>
  );
};

export default MainTemplate;
