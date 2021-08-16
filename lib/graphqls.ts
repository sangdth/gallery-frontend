import { gql } from '@apollo/client';

export const GET_SELF = gql`
  query getSelf($user_id: uuid!) {
    users_by_pk(id: $user_id) {
      id
      display_name
      account {
        id
        email
      }
    }
  }
`;

export const SITES_AGGREGATE = gql`
  query SITES_AGGREGATE($userId: uuid!) {
    sites_aggregate(
      limit: 10,
      offset: 0,
      where: {user: {id: {_eq: $userId}}}
    ) {
      nodes {
        description
        id
        name
        slug
        status
        user {
          id
        }
      }
    }
  }
`;

export const UPSERT_SITE_ONE = gql`
  mutation UPSERT_SITE_ONE($object: sites_insert_input!) {
    insert_sites_one(
      object: $object,
      on_conflict: {constraint: sites_pkey, update_columns: [name,description,slug,status]}
    ) {
      created_at
      updated_at
      id
      description
      name
      slug
      user_id
      status
    }
  }
`;

export const DELETE_SITE_BY_PK = gql`
  mutation DELETE_SITE_BY_PK($id: uuid!) {
    delete_sites_by_pk(id: $id) {
      id
      name
    }
  }
`;

export const PAGE_BY_PK = gql`
  query PAGE_BY_PK($id: uuid!) {
    page_by_pk(id: $id) {
      id
      name
      slug
      content
      type
      created_at
      updated_at
    }
  }
`;

export const INSERT_PAGE = gql`
  mutation INSERT_PAGE($objects: [page_insert_input!]!) {
    insert_page(
      objects: $objects,
      on_conflict: {constraint: page_pkey, update_columns: content}
    ) {
      affected_rows
    }
  }
`;
