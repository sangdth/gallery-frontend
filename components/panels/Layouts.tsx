import React, { useEffect } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ActionItem,
  LayoutEditorModal,
} from '../index';
import { layoutAtom } from '../../lib/jotai';
import {
  LAYOUTS_AGGREGATE,
  UPSERT_LAYOUT_ONE,
  DELETE_LAYOUT_BY_PK,
} from '../../lib/graphqls';
import type {
  LayoutDeletedData,
  LayoutInsertedData,
  LayoutInput,
  LayoutsAggregateData,
  SiteType,
  UserType,
} from '../../lib/types';

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
    upsertLayout,
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
    console.log('### input: ', input);
    await upsertLayout({
      variables: {
        object: {
          ...input,
          site_id: site.id,
          value: input.value ?? {},
        },
      },
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
            Empty layouts! Start create new Layout by clicking the green button
          </Flex>
        )}
      </Stack>

    </Flex>
  );
};

export default Layouts;
