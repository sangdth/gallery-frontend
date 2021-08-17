import React, { useEffect } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  ActionItem,
  LayoutEditorModal,
  // MenuGenerator,
} from '../../../components';
import { layoutAtom } from '../../../lib/jotai';
import type {
  LayoutDeletedData,
  LayoutInsertedData,
  LayoutInput,
  LayoutsAggregateData,
  SiteType,
  UserType,
} from '../../../lib/types';

export const LAYOUTS_AGGREGATE = gql`
  query LAYOUTS_AGGREGATE($userId: uuid!, $siteId: uuid!) {
    layouts_aggregate(
      limit: 999,
      offset: 0,
      where: {
        user_id: {_eq: $userId},
        site_id: {_eq: $siteId}
      }
    ) {
      nodes {
        created_at
        updated_at
        id
        name
        value
        status
      }
    }
  }
`;

export const UPSERT_LAYOUT_ONE = gql`
  mutation UPSERT_LAYOUT_ONE($object: layouts_insert_input!) {
    insert_layouts_one(
      object: $object,
      on_conflict: {constraint: layouts_pkey, update_columns: [name, value, status]}
    ) {
      created_at
      updated_at
      id
      name
      value
      status
    }
  }
`;

export const DELETE_LAYOUT_BY_PK = gql`
  mutation DELETE_LAYOUT_BY_PK($id: uuid!) {
    delete_layouts_by_pk(id: $id) {
      id
      name
    }
  }
`;

type Props = {
  site: SiteType;
  user: UserType;
};

export const Layouts = (props: Props) => {
  const { site, user } = props;
  const toast = useToast();
  const setSelectedLayout = useUpdateAtom(layoutAtom);

  const {
    data: layoutsData,
    loading: layoutsLoading,
    error: layoutsError,
    refetch: layoutsRefetch,
  } = useQuery<LayoutsAggregateData>(
    LAYOUTS_AGGREGATE,
    {
      variables: { userId: user.id, siteId: site.id },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    },
  );

  const layouts = layoutsData?.layouts_aggregate?.nodes;

  const [
    insertLAYOUT,
    {
      data: insertData,
      loading: insertLoading,
      // error: insertError,
    },
  ] = useMutation<LayoutInsertedData>(UPSERT_LAYOUT_ONE);

  const [
    deleteLayout,
    {
      // data: deleteData,
      loading: deleteLoading,
      // error: deleteError,
    },
  ] = useMutation<LayoutDeletedData>(DELETE_LAYOUT_BY_PK);

  const handleSubmit = async (input: LayoutInput) => {
    await insertLAYOUT({
      variables: { object: { ...input, site_id: site.id } },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteLayout({
      variables: { id },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    layoutsRefetch();
  };

  useEffect(() => {
    if (insertData) {
      // layoutsRefetch();
      toast({
        title: `Created ${insertData.insert_layouts_one.name} successful`,
        position: 'top',
        status: 'success',
        isClosable: true,
        duration: 1000,
      });
    }
  }, [insertData, toast, layoutsRefetch]);

  if (layoutsLoading && !layoutsData) {
    return <div>Loading...</div>;
  }

  if (layoutsError || !layouts) {
    return <div>Error getting layouts data</div>;
  }

  // <MenuGenerator
  //   data={layouts}
  //   menu={currentMenu as DragItemType[]}
  //   onChange={handleUpdateMenu}
  //   onDelete={handleDelete}
  //   onEdit={(p) => setSelectedLAYOUT(p)}
  // />

  return (
    <Flex direction="column">
      <LayoutEditorModal
        loading={insertLoading || deleteLoading}
        onSubmit={handleSubmit}
        refetch={layoutsRefetch}
      />

      <Stack spacing="10px" marginTop="20px">
        {layouts.map((p) => (
          <ActionItem
            key={p.id}
            data={p}
            onEdit={() => setSelectedLayout(p)}
            onDelete={() => handleDelete(p.id)}
          />
        ))}

        {(layouts.length === 0) && (
          <Flex>
            Empty layouts! Start create new LAYOUT by clicking the green button
          </Flex>
        )}
      </Stack>

    </Flex>
  );
};

export default Layouts;
