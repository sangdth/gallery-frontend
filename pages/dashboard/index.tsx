import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { gql, useLazyQuery } from '@apollo/client';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { WithPrivateRoute } from '../../components/WithPrivateRoute';
import { siteAtom, meAtom } from '../../lib/jotai';
import { EditingProvider, Layout } from '../../components';
import { Pages, Collections } from './panels';
import type { SiteData } from '../../lib/types';

export const SITE_BY_PK = gql`
  query SITE_BY_PK($id: uuid!) {
    sites_by_pk(id: $id) {
      description
      created_at
      id
      name
      slug
      status
      updated_at
    }
  }
`;

const tabs = ['pages', 'collections'];

const getIndex = (name: string) => {
  const found = tabs.findIndex((tab) => tab === name);
  if (found !== -1) {
    return found;
  }
  return 0;
};

const Dashboard = () => {
  const router = useRouter();
  const [me] = useAtom(meAtom);
  const [siteTom] = useAtom(siteAtom);
  const { site: siteId, tab } = router.query;
  const [index, setIndex] = useState(0);
  const [site, setLocalSite] = useState(siteTom);

  const [
    getSite,
    { data: siteData, error: siteError },
  ] = useLazyQuery<SiteData>(SITE_BY_PK, {
    variables: { id: siteId },
    context: {
      headers: {
        'x-hasura-role': 'me',
      },
    },
  });

  const handleTabsChange = (i: number) => {
    setIndex(i);
    if (tab !== tabs[i]) {
      router.push(`/dashboard?site=${siteId}&tab=${tabs[i]}`, undefined, {
        shallow: true,
      });
    }
  };

  useEffect(() => {
    if (site === null) {
      if (!!siteId && siteData === undefined) {
        getSite();
      }
      if (siteData && !siteError) {
        setLocalSite(siteData.sites_by_pk);
      }
    }
  }, [site, getSite, siteData, siteId, siteError, setLocalSite]);

  useEffect(() => {
    if (typeof tab === 'string') {
      const foundIndex = getIndex(tab);
      if (index !== foundIndex) {
        setIndex(foundIndex);
      }
    }
  }, [tab, index]);

  return (
    <Layout>
      <EditingProvider>
        <Tabs
          width="100%"
          index={index}
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab>Pages</Tab>
            <Tab>Collections</Tab>
          </TabList>
          <TabPanels paddingX="0">
            <TabPanel>
              {(site && me) && <Pages site={site} user={me} />}
            </TabPanel>
            <TabPanel>
              {(site && me) && <Collections site={site} user={me} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </EditingProvider>
    </Layout>
  );
};

export default WithPrivateRoute(Dashboard);
