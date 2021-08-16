import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { WithPrivateRoute } from '../components/WithPrivateRoute';
import { ActionItem, Layout, SiteEditorModal } from '../components';
import { auth } from '../lib/nhost';
import { siteAtom } from '../lib/jotai';
import {
  SITES_AGGREGATE,
  UPSERT_SITE_ONE,
  DELETE_SITE_BY_PK,
} from '../lib/graphqls';
import { OptionKey } from '../lib/enums';
import type {
  SiteType,
  SitesAggregateData,
  SiteInsertedData,
  SiteDeletedData,
  OptionType,
} from '../lib/types';

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
    insertSite,
    {
      data: insertData,
      loading: insertLoading,
      // error: insertError,
    },
  ] = useMutation<SiteInsertedData>(UPSERT_SITE_ONE);

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
    await insertSite({
      variables: {
        object: {
          ...input,
          options: !isEditing ? {
            data: defaultOptions,
            on_conflict: {
              constraint: 'options_pkey',
              update_columns: ['key', 'value', 'status'],
            },
          } : undefined,
        },
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

  const handlePreview = (o: SiteType) => {
    router.push(`/sites/${o.slug}?preview`);
  };

  const handleDelete = async (id: string) => {
    await deleteSite({
      variables: { id },
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
    return <div>Loading...</div>;
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
              onClick={() => handleClick(s)}
              onClickExternal={() => handlePreview(s)}
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
