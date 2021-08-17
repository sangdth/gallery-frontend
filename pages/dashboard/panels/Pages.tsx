import React, { useEffect } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ActionItem,
  PageEditorModal,
  // MenuGenerator,
} from '../../../components';
import { OptionKey } from '../../../lib/enums';
import { pageAtom } from '../../../lib/jotai';
import {
  PAGES_AGGREGATE,
  UPSERT_PAGE_ONE,
  DELETE_PAGE_BY_PK,
  ALL_OPTIONS,
  UPDATE_OPTIONS,
} from '../../../lib/graphqls';
import type {
  // DragItemType,
  OptionType,
  OptionUpdated,
  OptionValue,
  PageDeletedData,
  PageInsertedData,
  PageInput,
  PagesAggregateData,
  SiteType,
  UserType,
} from '../../../lib/types';

type Props = {
  site: SiteType;
  user: UserType;
};

export const Pages = (props: Props) => {
  const { site, user } = props;
  const toast = useToast();
  const setSelectedPage = useUpdateAtom(pageAtom);

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
  ] = useMutation<PageInsertedData>(UPSERT_PAGE_ONE);

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
    refetch: optionRefetch,
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
    // {
    //   data: updatedOption,
    //   error: updatedError,
    // },
  ] = useMutation<OptionUpdated>(UPDATE_OPTIONS);

  const currentMenuData = optionData?.options.find((option) => option.key === OptionKey.Menu);
  const currentMenu = currentMenuData?.value ?? [];

  const handleUpdateMenu = async (newValue: OptionValue[]) => {
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

    optionRefetch();
  };

  const handleSubmit = async (input: PageInput) => {
    const response = await insertPage({
      variables: { object: { ...input, site_id: site.id } },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    // Push new page item in menu
    if (response && response.data && Array.isArray(currentMenu)) {
      const tmpMenu = [...currentMenu];
      const newMenuItem = response?.data?.insert_pages_one;
      const found = tmpMenu.find((o) => o.id === newMenuItem.id);
      if (!found) {
        tmpMenu.push({
          id: newMenuItem.id,
          label: newMenuItem.name,
          children: [],
        });
      }
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

    // TODO: use the menu to get id path, then delete page and update menu
    // This way can not delete page nested
    if (Array.isArray(currentMenu)) {
      const remainedMenu = currentMenu.filter((o) => o.id !== id);
      await handleUpdateMenu(remainedMenu);
    }

    pagesRefetch();
  };

  useEffect(() => {
    if (insertData) {
      // pagesRefetch();
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

  // <MenuGenerator
  //   data={pages}
  //   menu={currentMenu as DragItemType[]}
  //   onChange={handleUpdateMenu}
  //   onDelete={handleDelete}
  //   onEdit={(p) => setSelectedPage(p)}
  // />

  return (
    <Flex direction="column">
      <PageEditorModal
        loading={insertLoading || deleteLoading}
        onSubmit={handleSubmit}
        refetch={pagesRefetch}
      />

      <Stack spacing="10px" marginTop="20px">
        {pages.map((p) => (
          <ActionItem
            key={p.id}
            data={p}
            onEdit={() => setSelectedPage(p)}
            onDelete={() => handleDelete(p.id)}
          />
        ))}

        {(pages.length === 0) && (
          <Flex>
            Empty pages! Start create new page by clicking the green button
          </Flex>
        )}
      </Stack>

    </Flex>
  );
};

export default Pages;
