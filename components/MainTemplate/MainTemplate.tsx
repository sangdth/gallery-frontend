import React from 'react';
import { Flex } from '@chakra-ui/react';
import type { CollectionType, PageType } from '@/lib/types';

export type MainTemplateProps = {
  page?: PageType;
  collections?: CollectionType[];
};

const regExp = /\[\[(.*?)\]\]/;

export const MainTemplate = (props: MainTemplateProps) => {
  const { page, collections } = props;
  console.log('### collections: ', collections);
  const matches = regExp.exec(page?.content ?? '');
  console.log('### matches: ', matches);
  if (!page) {
    return <>Error getting page content</>;
  }

  return (
    <Flex>
      {page?.content}
    </Flex>
  );
};

export default MainTemplate;
