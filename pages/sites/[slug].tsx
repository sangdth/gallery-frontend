import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Layout } from '../../components/Layout';
import { Entity } from '../../lib/enums';
import type { AggregateData, SiteType } from '../../lib/types';

type SitesAggregateData = AggregateData<SiteType, Entity.Sites>;

const GET_SITE_BY_SLUG = gql`
  query GetSiteBySlug($slug: String!) {
    sites_aggregate(
      limit: 1,
      offset: 0,
      where: {
        slug: {_eq: $slug},
        status: {_eq: "PUBLIC"}
      }
    ) {
      nodes {
        description
        id
        name
        slug
        status
      }
    }
  }
`;

const Settings = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery<SitesAggregateData>(GET_SITE_BY_SLUG, {
    variables: { slug: slug ?? '' },
  });

  const site = data?.sites_aggregate?.nodes[0];

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error || !site) {
    console.error(error); // eslint-disable-line
    return <div>Error getting site data</div>;
  }

  return (
    <>
      <Head>
        <title>{site.name}</title>
        <meta name="description" content={site.description ?? ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>
          site:
          {' '}
          {site.name}
          :
          {site.slug}
        </div>
      </Layout>
    </>
  );
};

export default Settings;
