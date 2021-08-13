import React from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '@nhost/react-auth';
import { gql, useQuery } from '@apollo/client';
import { Layout } from '../../components/Layout';
import type { SitesAggregateData } from '../../lib/types';

const GET_SITE_BY_SLUG = gql`
  query GetSiteBySlug($slug: String!) {
    sites_aggregate(limit: 1, offset: 0, where: {slug: {_eq: $slug}, status: {_eq: "PUBLIC"}}) {
      nodes {
        description
        id
        name
        slug
        status
        options {
          id
          key
          value
        }
        pages {
          id
          name
          slug
        }
        collections {
          id
          description
          name
          type
          images {
            id
            name
            path
            description
          }
        }
      }
    }
  }
`;

const SingleSite = () => {
  const router = useRouter();
  // const { signedIn } = useAuth();
  const { slug } = router.query;

  const { loading, error, data } = useQuery<SitesAggregateData>(GET_SITE_BY_SLUG, {
    variables: { slug: slug ?? '' },
  });

  const site = data?.sites_aggregate?.nodes[0];
  console.log('### site: ', site);

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error || !site) {
    console.error(error); // eslint-disable-line
    return <div>Error getting site data</div>;
  }

  return (
    <Layout site={site}>
      <div>
        site:
        {' '}
        {site.name}
        :
        {site.slug}
      </div>
    </Layout>
  );
};

export default SingleSite;
