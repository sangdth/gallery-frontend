import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import {
  GridItem,
  Logo,
  MainTemplate,
  MenuTemplate,
} from '@/components';
import { GET_EVERYTHING_BY_SITE_SLUG } from '@/lib/graphqls';
import { DEFAULT_LAYOUT, ROW_HEIGHT } from '@/lib/constants';
import { useGenerateDom, useOptions } from '@/lib/hooks';
import {
  makeProductionLayouts,
  makeSrcFromPath,
} from '@/lib/helpers';
import { childrenHeightAtom } from '@/lib/jotai';
import { OptionKey, SectionElement } from '@/lib/enums';
import type { OptionValue, SitesAggregateData, SiteType } from '@/lib/types';

const ResponsiveLayout = WidthProvider(Responsive);

const SingleSiteView = () => {
  const [childrenHeight] = useAtom(childrenHeightAtom);
  const router = useRouter();
  const { slugs } = router.query;

  const { siteSlug, pageSlug } = useMemo(() => {
    if (slugs && Array.isArray(slugs)) {
      const siteParam = slugs[0];
      const pageParam = slugs[slugs.length - 1];
      return {
        siteSlug: siteParam,
        pageSlug: slugs.length !== 1 ? pageParam : '',
      };
    }
    return {
      siteSlug: '',
      pageSlug: '',
    };
  }, [slugs]);


  const { loading, error, data } = useQuery<SitesAggregateData>(GET_EVERYTHING_BY_SITE_SLUG, {
    variables: { siteSlug },
  });

  const site = data?.sites_aggregate?.nodes[0] as SiteType;

  const {
    id: siteId,
    name: siteName,
    layouts,
    options,
    pages,
  } = site;

  const { data: optionData } = useOptions(siteId);

  // const menuOptionData = optionData[OptionKey.Menu];
  const homeOptionData = optionData[OptionKey.Home];
  const logoOptionData = optionData[OptionKey.Logo];

  let currentLayouts = layouts ? layouts[0] : undefined;
  const currentMenuData = options?.find(({ key }) => key === OptionKey.Menu);

  const productionLayouts = makeProductionLayouts(childrenHeight, currentLayouts?.value);

  const handleSelect = (items: OptionValue[]) => {
    const pagePath = items.reduce((acc, current) => {
      const { slug, id } = current;
      const isHome = id === homeOptionData.value.id;
      if (!isHome) {
        return acc.concat('/', `${slug}`.toLowerCase());
      }
      return siteSlug;
    }, siteSlug);

    router.push(`/sites/${pagePath}`, undefined, {
      shallow: true,
    });
  };

  const currentPage = useMemo(() => {
    if (pageSlug) {
      return pages?.find((o) => o.slug === pageSlug);
    }
    return pages?.find((o) => o.id === homeOptionData?.value.id);
  }, [pageSlug, pages, homeOptionData]);

  const componentSwitcher = (key: SectionElement) => {
    switch (key) {
    case SectionElement.Logo:
      return (
        <Logo
          name={siteName}
          imagePath={makeSrcFromPath(logoOptionData?.value?.path)}
          url={`/sites/${siteSlug}`}
        />
      );
    case SectionElement.Menu:
      return (
        <MenuTemplate
          menu={currentMenuData?.value as OptionValue[] ?? []}
          onSelect={handleSelect}
        />
      );
    case SectionElement.Main:
      return <MainTemplate page={currentPage} />;
    default:
      return <>{key.toUpperCase()}</>;
    }
  };

  const elements = useGenerateDom({
    component: ({ key }) => componentSwitcher(key),
  });

  if (loading && !data && currentLayouts) {
    return <div>Loading...</div>;
  }

  if (error || !site) {
    console.warn(error); // eslint-disable-line
    return <div>Error getting site data</div>;
  }

  return (
    <Box maxWidth="1400px" marginX="auto">
      <ResponsiveLayout
        layouts={productionLayouts}
        breakpoints={DEFAULT_LAYOUT.breakpoints}
        cols={DEFAULT_LAYOUT.cols}
        rowHeight={ROW_HEIGHT}
        isDraggable={false}
        isResizable={false}
      >
        {elements.map(({ id, component }) => (
          <GridItem key={id}>
            {component}
          </GridItem>
        ))}
      </ResponsiveLayout>
    </Box>
  );
};

export default SingleSiteView;
