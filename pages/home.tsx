import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { WithPrivateRoute } from '@/components/WithPrivateRoute';
import {
  ActionItem,
  Layout,
  LoadingScreen,
  SiteEditorModal,
} from '@/components';
import { auth } from '@/lib/nhost';
import { siteAtom } from '@/lib/jotai';
import { makeLink } from '@/lib/helpers';
import {
  SITES_AGGREGATE,
  UPSERT_SITE_ONE,
  DELETE_SITE_BY_PK,
} from '@/lib/graphqls';
import { DEFAULT_LAYOUT } from '@/lib/constants';
import { OptionKey } from '@/lib/enums';
import type {
  SiteType,
  SitesAggregateData,
  SiteInsertedOneData,
  SiteDeletedData,
  OptionType,
} from '@/lib/types';

const defaultOptions: Partial<OptionType>[] = [
  { key: OptionKey.Menu, value: [] },
];

function Home() {
  const router = useRouter();
  const toast = useToast();
  const [currentSite, setCurrentSite] = useAtom(siteAtom);
  const [isEditing, setEditing] = useState(false);

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
    refetch: queryRefetch,
  } = useQuery<SitesAggregateData>(
    SITES_AGGREGATE,
    {
      variables: {
        userId: auth.getClaim('x-hasura-user-id'),
      },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    },
  );

  const [
    upsertSite,
    {
      data: insertData,
      loading: insertLoading,
      // error: insertError,
    },
  ] = useMutation<SiteInsertedOneData>(UPSERT_SITE_ONE);

  const [
    deleteSite,
    {
      data: deleteData,
      loading: deleteLoading,
      // error: deleteError,
    },
  ] = useMutation<SiteDeletedData>(DELETE_SITE_BY_PK);

  const sites = queryData?.sites_aggregate?.nodes?.filter((s) => !!s);

  const handleEdit = (o: SiteType) => {
    setCurrentSite(o);
    setEditing(true);
  };

  const handleSubmit = async (input: Partial<SiteType>) => {
    const siteDataObject = {
      ...input,
      options: !currentSite ? {
        data: defaultOptions,
        on_conflict: {
          constraint: 'options_pkey',
          update_columns: ['key', 'value', 'status'],
        },
      } : undefined,
      layouts: !currentSite ? {
        data: {
          name: 'Default Layouts',
          value: DEFAULT_LAYOUT.layouts,
        },
        on_conflict: {
          constraint: 'layouts_pkey',
          update_columns: ['name', 'value', 'status'],
        },
      } : undefined,
    };
    await upsertSite({
      variables: {
        object: siteDataObject,
      },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    setEditing(false);
  };

  const handleClick = (o: SiteType) => {
    setCurrentSite(o);
    router.push(`/dashboard?site=${o.id}&tab=pages`);
  };

  const handleDelete = async (siteId: string) => {
    await deleteSite({
      variables: { siteId },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });
  };

  useEffect(() => {
    if (currentSite && !isEditing) {
      setCurrentSite(null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (insertData) {
      queryRefetch();
      toast({
        title: `Created ${insertData.insert_sites_one.name} successful`,
        position: 'top',
        status: 'success',
        isClosable: true,
        duration: 1000,
      });
    }
  }, [insertData, toast, queryRefetch]);

  useEffect(() => {
    if (deleteData) {
      queryRefetch();
      toast({
        title: `Deleted site: ${deleteData.delete_sites_by_pk.name} successful`,
        position: 'top',
        status: 'warning',
        isClosable: true,
        duration: 3000,
      });
    }
  }, [deleteData, toast, queryRefetch]);

  if (queryLoading && !queryData) {
    return <LoadingScreen label="Loading dashboard data..." />;
  }

  if (queryError || !sites) {
    console.error(queryError); // eslint-disable-line
    return <div>Error getting sites data</div>;
  }

  return (
    <Layout>
      <Flex direction="column" width="100%" padding="20px">
        <SiteEditorModal
          isEditing={isEditing}
          loading={insertLoading || deleteLoading}
          refetch={queryRefetch}
          onSubmit={handleSubmit}
          onOpen={() => setEditing(true)}
          onClose={() => setEditing(false)}
        />

        <Stack spacing="10px" marginTop="20px">
          {sites.map((s) => (
            <ActionItem
              key={s.id}
              data={s}
              externalLink={makeLink(s)}
              onClick={() => handleClick(s)}
              onDelete={() => handleDelete(s.id)}
              onEdit={() => handleEdit(s)}
            />
          ))}
        </Stack>
      </Flex>
    </Layout>
  );
}

export default WithPrivateRoute(Home);
