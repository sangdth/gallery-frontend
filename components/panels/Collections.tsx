import React from 'react';
import { atom, useAtom } from 'jotai';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { ActionItem, CollectionEditorModal } from '@/components';
import {
  COLLECTIONS_AGGREGATE,
  UPSERT_COLLECTION_ONE,
  DELETE_COLLECTION_BY_PK,
} from '@/lib/graphqls';
import type {
  CollectionInsertedData,
  CollectionsAggregateData,
  CollectionDeletedData,
  CollectionInput,
  SiteType,
  UserType,
} from '@/lib/types';

type CollectionsProps = {
  site: SiteType;
  user: UserType;
};

export const collectionAtom = atom<CollectionInput | null>(null);

export const Collections = (props: CollectionsProps) => {
  const toast = useToast();

  const { site, user } = props;
  const [, setCollection] = useAtom(collectionAtom);

  const {
    data: collectionsData,
    loading: collectionsLoading,
    error: collectionsError,
    refetch: collectionsRefetch,
  } = useQuery<CollectionsAggregateData>(
    COLLECTIONS_AGGREGATE,
    {
      variables: { userId: user.id, siteId: site.id },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    },
  );

  const collections = collectionsData?.collections_aggregate?.nodes;

  // TODO: Make the query/mutation out of single component, because after this upsert
  // the other places like Pages can not get correct Collections in their queries.
  // With the central place it can refetch anything.
  const [
    upsertCollection,
    {
      // data: insertData,
      // loading: upsertLoading,
      // error: insertError,
    },
  ] = useMutation<CollectionInsertedData>(UPSERT_COLLECTION_ONE);

  const [
    deleteCollection,
    {
      // data: deleteData,
      // loading: deleteLoading,
      // error: deleteError,
    },
  ] = useMutation<CollectionDeletedData>(DELETE_COLLECTION_BY_PK);

  const handleSubmit = async (data: CollectionInput) => {
    await upsertCollection({
      variables: {
        object: {
          ...data,
          site_id: site.id,
          images: {
            data: (data?.images ?? []).map(({ id, meta, path, description }) => ({
              id,
              meta,
              path,
              description,
            })),
            on_conflict: {
              constraint: 'images_pkey',
              update_columns: ['meta', 'path', 'status', 'description', 'collection_id'],
            },
          },
        },
      },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    collectionsRefetch();

    toast({
      title: 'Successful',
      position: 'top',
      status: 'success',
      isClosable: true,
      duration: 1000,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteCollection({
      variables: { id },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    collectionsRefetch();

    toast({
      title: 'Deleted successful',
      position: 'top',
      status: 'warning',
      isClosable: true,
      duration: 3000,
    });
  };

  if (collectionsLoading && !collectionsData) {
    return <div>Loading...</div>;
  }

  if (collectionsError || !collections) {
    return <div>Error getting collections data</div>;
  }

  return (
    <Flex direction="column">
      <CollectionEditorModal
        onSubmit={handleSubmit}
        refetch={collectionsRefetch}
      />

      <Stack spacing="10px" marginTop="20px">
        {collections.map((collection) => (
          <ActionItem
            key={collection.id}
            data={collection}
            onEdit={() => setCollection(collection)}
            onDelete={(id) => handleDelete(id)}
          />
        ))}

        {(collections.length === 0) && (
          <Flex>
            Empty collections! Start create new collection by clicking the green button
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

export default Collections;
