import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import {
  ErrorBoundary,
  Layout,
  WithPrivateRoute,
} from '@/components';
import {
  Pages,
  Collections,
  Layouts,
  OptionsPanel,
} from '@/components/panels';
import { siteAtom, meAtom } from '@/lib/jotai';
import { SITE_BY_PK } from '@/lib/graphqls';
import type { SiteData } from '@/lib/types';

const tabs = [
  'pages',
  'collections',
  'layouts',
  'options',
];

const getIndex = (name: string) => {
  const found = tabs.findIndex((tab) => tab === name);
  if (found !== -1) {
    return found;
  }
  return 0;
};

// export async function getServerSideProps() {
//   await new Promise((resolve) => {
//     setTimeout(resolve, 500);
//   });
//   return { props: {} };
// }

const Dashboard = () => {
  const router = useRouter();
  const [me] = useAtom(meAtom);
  const [selectedSite, setSelectedSite] = useAtom(siteAtom);
  const { site: siteId, tab } = router.query;
  const [index, setIndex] = useState(0);
  const [site, setLocalSite] = useState(selectedSite);

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
      router.push(
        `/dashboard?site=${siteId}&tab=${tabs[i]}`,
        undefined,
        { shallow: true },
      );
    }
  };

  useEffect(() => {
    if (site === null) {
      if (!!siteId && siteData === undefined) {
        getSite();
      }
      if (siteData && !siteError) {
        setLocalSite(siteData.sites_by_pk);
        setSelectedSite(siteData.sites_by_pk);
      }
    }
  }, [
    site,
    getSite,
    siteData,
    siteId,
    siteError,
    setLocalSite,
    setSelectedSite,
  ]);

  useEffect(() => {
    if (typeof tab === 'string') {
      const foundIndex = getIndex(tab);
      if (index !== foundIndex) {
        setIndex(foundIndex);
      }
    }
  }, [tab, index]);

  return (
    <ErrorBoundary>
      <Layout>
        <Tabs
          width="100%"
          index={index}
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab>Pages</Tab>
            <Tab>Collections</Tab>
            <Tab>Layouts</Tab>
            <Tab>Options</Tab>
          </TabList>

          <TabPanels paddingX="0">
            <TabPanel>
              {(site && me) && <Pages site={site} user={me} />}
            </TabPanel>
            <TabPanel>
              {(site && me) && <Collections site={site} user={me} />}
            </TabPanel>
            <TabPanel>
              {(site && me) && <Layouts site={site} user={me} />}
            </TabPanel>
            <TabPanel>
              {(site && me) && <OptionsPanel />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layout>
    </ErrorBoundary>
  );
};

export default WithPrivateRoute(Dashboard);
