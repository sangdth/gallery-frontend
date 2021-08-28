import React, { useEffect } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ActionItem,
  MenuEditorModal,
  PageEditorModal,
} from '@/components';
import { OptionKey } from '@/lib/enums';
import { pageAtom } from '@/lib/jotai';
import { arrayHasValue } from '@/lib/helpers';
import {
  PAGES_AGGREGATE,
  UPSERT_PAGE_ONE,
  DELETE_PAGE_BY_PK,
  ALL_OPTIONS,
  UPDATE_OPTIONS,
} from '@/lib/graphqls';
import type {
  MenuOption,
  OptionType,
  OptionUpdated,
  OptionValue,
  PageDeletedData,
  PageInsertedData,
  PageInput,
  PagesAggregateData,
  SiteType,
  UserType,
} from '@/lib/types';

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
  console.log('### pages: ', pages);

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
    {
      loading: updateOptionLoading,
      // data: updatedOption,
      // error: updatedError,
    },
  ] = useMutation<OptionUpdated>(UPDATE_OPTIONS);

  const currentMenuData = optionData?.options.find(({ key }) => key === OptionKey.Menu);
  const currentMenu = currentMenuData?.value ?? [];

  const handleUpdateOption = async (key: OptionKey, value: OptionValue | OptionValue[]) => {
    await updateOption({
      variables: {
        siteId: site.id,
        key: key,
        value: value,
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
      variables: {
        object: {
          ...input,
          is_home: !arrayHasValue(pages),
          site_id: site.id,
        },
      },
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
          slug: newMenuItem.slug,
          label: newMenuItem.name,
          children: [],
        });
      }
      await handleUpdateOption(OptionKey.Menu, tmpMenu);
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
      await handleUpdateOption(OptionKey.Menu, remainedMenu);
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

  // TODO: get rid of 'as MenuOption'
  return (
    <Flex direction="column">
      <Flex justifyContent="space-between">
        <MenuEditorModal
          loading={updateOptionLoading}
          pages={pages}
          menu={currentMenuData as MenuOption}
          onSubmit={(menu) => handleUpdateOption(OptionKey.Menu, menu.value)}
          refetch={optionRefetch}
        />
        <PageEditorModal
          loading={insertLoading || deleteLoading}
          onSubmit={handleSubmit}
          refetch={pagesRefetch}
        />
      </Flex>

      <Stack spacing="10px">
        {pages.map((p) => (
          <ActionItem
            key={p.id}
            data={p}
            onEdit={() => setSelectedPage(p)}
            onDelete={(id) => handleDelete(id)}
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
