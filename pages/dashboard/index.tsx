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
import { Layout } from '../../components/Layout';
import { ChangePassword } from './ChangePassword';
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

const tabs = ['pages', 'collections', 'images', 'settings'];
const getIndex = (name: string) => {
  const found = tabs.findIndex((tab) => tab === name);
  if (found !== -1) {
    return found;
  }
  return 0;
};

const Dashboard = () => {
  const [site, setSite] = useAtom(siteAtom);
  const [me] = useAtom(meAtom);
  const router = useRouter();
  const { site: siteId, tab } = router.query;
  const [index, setIndex] = useState(0);

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
        setSite(siteData.sites_by_pk);
      }
    }
  }, [site, getSite, siteData, siteId, siteError, setSite]);

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
      <Tabs width="100%" isLazy index={index} onChange={handleTabsChange}>
        <TabList>
          <Tab>Pages</Tab>
          <Tab>Collections</Tab>
          <Tab>Images</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels paddingX="0">
          <TabPanel>
            {(site && me) && <Pages site={site} user={me} />}
          </TabPanel>
          <TabPanel>
            {(site && me) && <Collections site={site} user={me} />}
          </TabPanel>
          <TabPanel>
            <p>Images</p>
          </TabPanel>
          <TabPanel>
            <ChangePassword />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default WithPrivateRoute(Dashboard);
