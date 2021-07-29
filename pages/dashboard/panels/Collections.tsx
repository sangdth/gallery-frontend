import React from 'react';
import { useToast } from '@chakra-ui/react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { CreateCollectionModal } from '../../../components/CreateCollectionModal';
import { CollectionItem } from '../../../components/CollectionItem';
import type {
  CollectionInsertedData,
  CollectionsAggregateData,
  CollectionDeletedData,
  CollectionType,
  SiteType,
  UserType,
} from '../../../lib/types';

export const COLLECTIONS_AGGREGATE = gql`
  query collectionS_AGGREGATE($userId: uuid!, $siteId: uuid!) {
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
        name
        description
        status
      }
    }
  }
`;

export const INSERT_COLLECTION_ONE = gql`
    mutation INSERT_COLLECTION_ONE($object: collections_insert_input!) {
      insert_collections_one(object: $object) {
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

export const Collections = (props: Props) => {
  const { site, user } = props;
  const toast = useToast();

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
    insertCollection,
    {
      data: insertData,
      loading: insertLoading,
      // error: insertError,
    },
  ] = useMutation<CollectionInsertedData>(INSERT_COLLECTION_ONE);

  const [
    deleteCollection,
    {
      // data: deleteData,
      loading: deleteLoading,
      // error: deleteError,
    },
  ] = useMutation<CollectionDeletedData>(DELETE_COLLECTION_BY_PK);

  const handleSubmit = async (input: Partial<CollectionType>) => {
    await insertCollection({
      variables: { object: { ...input, site_id: site.id } },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });
    collectionsRefetch();
    toast({
      title: 'Created successful',
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

  if (insertData) {
    collectionsRefetch();
  }

  if (collectionsLoading && !collectionsData) {
    return <div>Loading...</div>;
  }

  if (collectionsError || !collections) {
    return <div>Error getting collections data</div>;
  }

  return (
    <>
      <CreateCollectionModal
        loading={insertLoading || deleteLoading}
        onSubmit={handleSubmit}
      />

      {collections.map((collection) => (
        <CollectionItem
          key={collection.id}
          name={collection.name ?? ''}
          // onClick={() => handleEdit(collection.id)}
          onDelete={() => handleDelete(collection.id)}
        />
      ))}
    </>
  );
};

export default Collections;
