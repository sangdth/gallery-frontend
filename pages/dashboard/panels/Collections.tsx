import React, { useCallback } from 'react';
import { atom, useAtom } from 'jotai';
import { Flex, useToast } from '@chakra-ui/react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { CreateCollectionModal } from '../../../components/CreateCollectionModal';
import { CollectionItem } from '../../../components/CollectionItem';
import type {
  CollectionInsertedData,
  CollectionsAggregateData,
  CollectionDeletedData,
  CollectionInput,
  SiteType,
  UserType,
} from '../../../lib/types';

export const COLLECTIONS_AGGREGATE = gql`
  query COLLECTIONS_AGGREGATE($userId: uuid!, $siteId: uuid!) {
    collections_aggregate(
      limit: 10,
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
        site_id
        name
        description
        status
        images {
          id
          meta
          path
          status
        }
      }
    }
  }
`;

export const UPSERT_COLLECTION_ONE = gql`
  mutation UPSERT_COLLECTION_ONE($object: collections_insert_input!) {
    insert_collections_one(
      object: $object,
      on_conflict: {constraint: collections_pkey, update_columns: [name, description, status]}
    ) {
      created_at
      updated_at
      id
      name
      description
      status
    }
  }
`;

export const DELETE_COLLECTION_BY_PK = gql`
  mutation DELETE_collection_BY_PK($id: uuid!) {
    delete_collections_by_pk(id: $id) {
      id
      name
    }
  }
`;

type Props = {
  site: SiteType;
  user: UserType;
};

export const collectionAtom = atom<CollectionInput | null>(null);

export const Collections = (props: Props) => {
  console.log('### Render Collections'); // eslint-disable-line no-console

  const { site, user } = props;
  const toast = useToast();
  const [input, setInput] = useAtom(collectionAtom);

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

  const [
    upsertCollection,
    {
      // data: insertData,
      loading: upsertLoading,
      // error: insertError,
    },
  ] = useMutation<CollectionInsertedData>(UPSERT_COLLECTION_ONE);

  const [
    deleteCollection,
    {
      // data: deleteData,
      loading: deleteLoading,
      // error: deleteError,
    },
  ] = useMutation<CollectionDeletedData>(DELETE_COLLECTION_BY_PK);

  const handleSubmit = useCallback(async (data: CollectionInput) => {
    await upsertCollection({
      variables: {
        object: {
          ...data,
          site_id: site.id, // TODO: move to use atom instead of props
          images: {
            data: (data?.images ?? []).map((o) => ({
              id: o.id,
              meta: o.meta,
              path: o.path,
            })),
            on_conflict: {
              constraint: 'images_pkey',
              update_columns: ['meta', 'path', 'status', 'collection_id'],
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
  }, [site, toast, upsertCollection, collectionsRefetch]);

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
      <CreateCollectionModal
        loading={upsertLoading || deleteLoading}
        onSubmit={handleSubmit}
        refetch={collectionsRefetch}
      />

      {collections.map((collection) => (
        <CollectionItem
          key={collection.id}
          name={collection.name ?? ''}
          onEdit={() => !input && setInput(collection)}
          onDelete={() => handleDelete(collection.id)}
        />
      ))}
    </Flex>
  );
};

export default Collections;
