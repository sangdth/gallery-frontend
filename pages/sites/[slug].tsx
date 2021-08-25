import React from 'react';
import { useRouter } from 'next/router';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useQuery } from '@apollo/client';
import { GET_EVERYTHING_BY_SITE_SLUG } from '@/lib/graphqls';
import { useGenerateDom } from '@/lib/hooks';
import type { SiteType } from '@/lib/types';

const ReactGridLayout = WidthProvider(RGL);

const SingleSite = () => {
  const router = useRouter();
  // const { signedIn } = useAuth();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(GET_EVERYTHING_BY_SITE_SLUG, {
    variables: { slug: slug ?? '' },
  });

  const site: NonNullable<SiteType> = data?.sites_aggregate?.nodes[0] ?? {};
  const { collections, layouts, options } = site;
  console.log('### options: ', options);
  console.log('### layouts: ', layouts);
  console.log('### collections: ', collections);

  const elements = useGenerateDom({
    component: ({ key }) => <>{key.toUpperCase()}</>, // eslint-disable-line react/display-name
  });

  console.log('### elements: ', elements);

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error || !site) {
    console.error(error); // eslint-disable-line
    return <div>Error getting site data</div>;
  }

  return (
    <ReactGridLayout>
      <div>
        site:
        {' '}
        {site.name}
        :
        {site.slug}
      </div>
    </ReactGridLayout>
  );
};

export default SingleSite;
