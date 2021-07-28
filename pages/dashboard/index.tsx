import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { WithPrivateRoute } from '../../components/WithPrivateRoute';
import { Layout } from '../../components/Layout';
import { ChangePassword } from './ChangePassword';
import { Pages } from './panels';

const Dashboard = () => (
  <Layout>
    <Tabs isLazy>
      <TabList>
        <Tab>Pages</Tab>
        <Tab>Collections</Tab>
        <Tab>Images</Tab>
        <Tab>Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Pages />
        </TabPanel>
        <TabPanel>
          <p>Collections</p>
        </TabPanel>
        <TabPanel>
          <p>Images</p>
        </TabPanel>
        <TabPanel>
          <p>Settings</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <div>
      <h1>Dashboard</h1>
      <div>
        <ChangePassword />
      </div>
    </div>
  </Layout>
);

export default WithPrivateRoute(Dashboard);
