import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Carousel } from '@/components';
import type { PageType } from '@/lib/types';

export type MainTemplateProps = {
  page?: PageType;
};

export const MainTemplate = (props: MainTemplateProps) => {
  const { page } = props;
  console.log('### page: ', page);

  if (!page) {
    return <>Error getting page content</>;
  }

  return (
    <Flex>
      {page.collection && (
        <Carousel images={page.collection.images} />
      )}
      {page?.content}
    </Flex>
  );
};

export default MainTemplate;
