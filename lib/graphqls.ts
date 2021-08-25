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

export const SITE_BY_PK = gql`
  query SITE_BY_PK($id: uuid!) {
    sites_by_pk(id: $id) {
      description
      created_at
      id
      name
      slug
      status
      updated_at
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
export const ALL_OPTIONS = gql`
  query ALL_OPTIONS($id: uuid!) {
    options(
      where: {site_id: {_eq: $id}}
    ) {
      id
      key
      value
    }
  }
`;

export const UPDATE_OPTIONS = gql`
  mutation UPDATE_OPTIONS($siteId: uuid!, $key: String!, $value: jsonb!) {
   update_options(where: {site_id: {_eq: $siteId}, key: {_eq: $key}}, _set: {value: $value}) {
      returning {
        id
        key
        value
      }
    }
  }
`;

export const PAGES_AGGREGATE = gql`
  query PAGES_AGGREGATE($userId: uuid!, $siteId: uuid!) {
    pages_aggregate(
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
        content
        slug
        status
      }
    }
  }
`;

export const UPSERT_PAGE_ONE = gql`
  mutation UPSERT_PAGE_ONE($object: pages_insert_input!) {
    insert_pages_one(
      object: $object,
      on_conflict: {constraint: pages_pkey, update_columns: [name, content, slug, status]}
    ) {
      created_at
      updated_at
      id
      name
      content
      slug
      status
    }
  }
`;

export const DELETE_PAGE_BY_PK = gql`
  mutation DELETE_PAGE_BY_PK($id: uuid!) {
    delete_pages_by_pk(id: $id) {
      id
      name
    }
  }
`;

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

export const GET_EVERYTHING_BY_SITE_SLUG = gql`
  query GET_EVERYTHING_BY_SITE_SLUG($slug: String!) {
    sites_aggregate(limit: 1, offset: 0, where: {slug: {_eq: $slug}, status: {_eq: "PUBLIC"}}) {
      nodes {
        description
        id
        name
        slug
        status
        options {
          id
          key
          value
        }
        pages {
          id
          name
          slug
          content
        }
        collections {
          id
          description
          name
          type
          images {
            id
            name
            path
            description
          }
        }
        layouts {
          id
          name
          value
        }
      }
    }
  }
`;
