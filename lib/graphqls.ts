// Beware: Vittu gql from @apollo/client has problem with tests
import gql from 'graphql-tag';

export const GET_SELF = gql`
  query getSelf($userId: uuid!) {
    users_by_pk(id: $userId) {
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
      where: {
        profile_id: {_eq: $userId},
      }
    ) {
      nodes {
        description
        id
        name
        slug
        status
        profile {
          id
        }
        collections(where: {status: {_eq: "PUBLIC"}}) {
          id
          name
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
      profile_id
      status
    }
  }
`;

export const DELETE_SITE_BY_PK = gql`
  mutation DELETE_SITE_BY_PK($siteId: uuid!) {
    delete_sites_by_pk(id: $siteId) {
      id
      name
    }
  }
`;

export const SITE_BY_PK = gql`
  query SITE_BY_PK($siteId: uuid!) {
    sites_by_pk(id: $siteId) {
      description
      created_at
      id
      name
      slug
      status
      updated_at
      profile {
        id
      }
      collections {
        id
        name
      }
    }
  }
`;

export const PAGE_BY_PK = gql`
  query PAGE_BY_PK($pageId: uuid!) {
    page_by_pk(id: $pageId) {
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
  query ALL_OPTIONS($siteId: uuid!) {
    options(
      where: {site_id: {_eq: $siteId}}
    ) {
      id
      key
      value
    }
  }
`;

export const UPSERT_OPTIONS = gql`
  mutation UPSERT_OPTIONS($objects: [options_insert_input!]!) {
    insert_options(
      objects: $objects,
      on_conflict: {
        constraint: options_pkey,
        update_columns: [key,value,status]
      }
    ) {
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
        profile_id: {_eq: $userId},
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
        collection_id
      }
    }
  }
`;

export const UPSERT_PAGE_ONE = gql`
  mutation UPSERT_PAGE_ONE($object: pages_insert_input!) {
    insert_pages_one(
      object: $object,
      on_conflict: {
        constraint: pages_pkey,
        update_columns: [name, content, slug, status, collection_id]
      }
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
  mutation DELETE_PAGE_BY_PK($pageId: uuid!) {
    delete_pages_by_pk(id: $pageId) {
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
        profile_id: {_eq: $userId},
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
  mutation DELETE_LAYOUT_BY_PK($layoutId: uuid!) {
    delete_layouts_by_pk(id: $layoutId) {
      id
      name
    }
  }
`;

export const COLLECTIONS_AGGREGATE = gql`
  query COLLECTIONS_AGGREGATE($userId: uuid!, $siteId: uuid!) {
    collections_aggregate(
      limit: 999,
      offset: 0,
      where: {
        profile_id: {_eq: $userId},
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
  mutation DELETE_collection_BY_PK($collectionId: uuid!) {
    delete_collections_by_pk(id: $collectionId) {
      id
      name
    }
  }
`;

export const INSERT_IMAGES = gql`
  mutation INSERT_IMAGES($objects: [images_insert_input!]!) {
    insert_images(objects: $objects) {
      returning {
        id
        name
        description
        path
      }
    }
  }
`;

export const DELETE_IMAGES = gql`
  mutation DELETE_IMAGES($imageIds: [uuid!]!) {
    delete_images(where: {id: {_in: $imageIds}}) {
      affected_rows
    }
  }
`;

export const IMAGE_PAGINATED = gql`
  query IMAGE_PAGINATED(
    $collectionId: uuid!,
    $limit: Int!,
    $offset: Int!,
  ) {
    images_aggregate {
      aggregate {
        count
      }
    }
    images(
      limit: $limit,
      offset: $offset,
      where: {
        collection_id: {_eq: $collectionId},
        status: {_eq: "PUBLIC"}
      }
    ) {
      id
      name
      description
      path
    }
  }
`;

export const GET_EVERYTHING_BY_SITE_SLUG = gql`
  query GET_EVERYTHING_BY_SITE_SLUG($siteSlug: String!) {
    sites_aggregate(limit: 1, offset: 0, where: {slug: {_eq: $siteSlug}, status: {_eq: "PUBLIC"}}) {
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
        pages(where:{ status: {_eq: "PUBLIC"}}) {
          id
          name
          slug
          content
          collection {
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
