import { gql } from '@apollo/client';

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
