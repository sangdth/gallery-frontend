import React, { useEffect } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  CreatePageModal,
  // MenuGenerator,
  PageItem,
} from '../../../components';
import { OptionKey } from '../../../lib/enums';
import type {
  PageInsertedData,
  PagesAggregateData,
  PageDeletedData,
  PageType,
  SiteType,
  UserType,
  OptionType,
  OptionValue,
  OptionUpdated,
} from '../../../lib/types';

export const ALL_OPTIONS = gql`
  query ALL_OPTIONS($id: uuid!) {
    options(
      where: {site_id: {_eq: $id}}
    ) {
      id
      name
      value
    }
  }
`;

export const UPDATE_OPTIONS = gql`
  mutation UPDATE_OPTIONS($siteId: uuid!, $key: String!, $value: jsonb!) {
   update_options(where: {site_id: {_eq: $siteId}, name: {_eq: $key}}, _set: {value: $value}) {
      returning {
        id
        name
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

export const INSERT_PAGE_ONE = gql`
  mutation INSERT_PAGE_ONE($object: pages_insert_input!) {
    insert_pages_one(object: $object) {
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

type Props = {
  site: SiteType;
  user: UserType;
};

export const Pages = (props: Props) => {
  const { site, user } = props;
  const toast = useToast();

  const {
    data: pagesData,
    loading: pagesLoading,
    error: pagesError,
    refetch: pagesRefetch,
  } = useQuery<PagesAggregateData>(
    PAGES_AGGREGATE,
    {
      variables: { userId: user.id, siteId: site.id },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    },
  );

  const pages = pagesData?.pages_aggregate?.nodes;

  const [
    insertPage,
    {
      data: insertData,
      loading: insertLoading,
      // error: insertError,
    },
  ] = useMutation<PageInsertedData>(INSERT_PAGE_ONE);

  const [
    deletePage,
    {
      // data: deleteData,
      loading: deleteLoading,
      // error: deleteError,
    },
  ] = useMutation<PageDeletedData>(DELETE_PAGE_BY_PK);

  const {
    data: optionData,
    // loading: optionLoading,
    // error: optionError,
  } = useQuery<{ options: OptionType[] }>(ALL_OPTIONS, {
    variables: { id: site.id },
    context: {
      headers: {
        'x-hasura-role': 'me',
      },
    },
  });

  const [
    updateOption,
    {
      data: updatedOption,
      error: updatedError,
    },
  ] = useMutation<OptionUpdated>(UPDATE_OPTIONS);

  const currentMenuData = optionData?.options.find((option) => option.name === OptionKey.Menu);
  const currentMenu = currentMenuData?.value ?? [];

  console.log('### updatedOption: ', updatedOption);
  console.log('### updatedError: ', updatedError);

  console.log('### currentMenu: ', currentMenu);

  const handleUpdateMenu = async (newValue: OptionValue) => {
    await updateOption({
      variables: {
        siteId: site.id,
        key: OptionKey.Menu,
        value: newValue,
      },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });
  };

  const handleSubmit = async (input: Partial<PageType>) => {
    const response = await insertPage({
      variables: { object: { ...input, site_id: site.id } },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    if (response && response.data && Array.isArray(currentMenu)) {
      const tmpMenu = [...currentMenu];
      const newMenuItem = response?.data?.insert_pages_one;
      tmpMenu.push({
        id: newMenuItem.id,
        label: newMenuItem.name,
        children: [],
      });
      console.log('### tmpMenu: ', tmpMenu);

      await handleUpdateMenu(tmpMenu);
    }

    pagesRefetch();
  };

  const handleDelete = async (id: string) => {
    await deletePage({
      variables: { id },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });
    pagesRefetch();
  };

  useEffect(() => {
    if (insertData) {
      pagesRefetch();
      toast({
        title: `Created ${insertData.insert_pages_one.name} successful`,
        position: 'top',
        status: 'success',
        isClosable: true,
        duration: 1000,
      });
    }
  }, [insertData, toast, pagesRefetch]);

  if (pagesLoading && !pagesData) {
    return <div>Loading...</div>;
  }

  if (pagesError || !pages) {
    return <div>Error getting pages data</div>;
  }

  return (
    <Flex direction="column">
      <CreatePageModal
        loading={insertLoading || deleteLoading}
        onSubmit={handleSubmit}
      />

      {pages.map((page) => (
        <PageItem
          key={page.id}
          name={page.name}
          // onClick={() => handleEdit(page.id)}
          onDelete={() => handleDelete(page.id)}
        />
      ))}
    </Flex>
  );
};

export default Pages;
