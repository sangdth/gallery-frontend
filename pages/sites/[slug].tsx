import React from 'react';
import { useRouter } from 'next/router';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useQuery } from '@apollo/client';
import { GridItem, MenuTemplate } from '@/components';
import { GET_EVERYTHING_BY_SITE_SLUG } from '@/lib/graphqls';
import { DEFAULT_LAYOUT } from '@/lib/constants';
import { useGenerateDom } from '@/lib/hooks';
import { OptionKey, SectionElement } from '@/lib/enums';
import type { OptionValue, SiteType } from '@/lib/types';

const ResponsiveLayout = WidthProvider(Responsive);

export const SingleSite = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(GET_EVERYTHING_BY_SITE_SLUG, {
    variables: { slug: slug ?? '' },
  });

  const site: NonNullable<SiteType> = data?.sites_aggregate?.nodes[0] ?? {};
  const { collections, layouts, options } = site;
  const currentLayouts = layouts ? layouts[0] : undefined;
  const currentMenuData = options?.find(({ key }) => key === OptionKey.Menu);
  console.log('### currentMenuData: ', currentMenuData);

  // console.log('### options: ', options);
  // console.log('### layouts: ', layouts);
  console.log('### collections: ', collections);

  const elements = useGenerateDom({
    component: ({ key }) => <>{key.toUpperCase()}</>, // eslint-disable-line react/display-name
  });

  console.log('### elements: ', elements);

  const handleSelect = (item: OptionValue) => {
    console.log('### item: ', item);
  };

  if (loading && !data && currentLayouts) {
    return <div>Loading...</div>;
  }

  if (error || !site) {
    console.warn(error); // eslint-disable-line
    return <div>Error getting site data</div>;
  }

  return (
    <ResponsiveLayout
      layouts={currentLayouts?.value}
      breakpoints={DEFAULT_LAYOUT.breakpoints}
      cols={DEFAULT_LAYOUT.cols}
      rowHeight={40}
      isDraggable={false}
      isResizable={false}
    >
      {elements.map(({ id, component }) => (
        <GridItem key={id}>
          {id === SectionElement.Menu && currentMenuData?.value ? (
            <MenuTemplate
              menu={currentMenuData?.value as OptionValue[]}
              onSelect={handleSelect}
            />
          ) : component}
        </GridItem>
      ))}
    </ResponsiveLayout>
  );
};

export default SingleSite;
