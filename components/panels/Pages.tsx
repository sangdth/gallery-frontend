import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUpdateAtom } from 'jotai/utils';
import {
  Flex,
  Icon,
  IconButton,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';
import { useQuery, useMutation } from '@apollo/client';
import {
  ActionItem,
  MenuEditorModal,
  PageEditorModal,
} from '@/components';
import { OptionKey } from '@/lib/enums';
import { pageAtom } from '@/lib/jotai';
import {
  PAGES_AGGREGATE,
  UPSERT_PAGE_ONE,
  DELETE_PAGE_BY_PK,
  ALL_OPTIONS,
  UPSERT_OPTIONS,
} from '@/lib/graphqls';
import type {
  HomeOption,
  MenuOption,
  OptionType,
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

  const [
    upsertPage,
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
  ] = useMutation(UPSERT_OPTIONS);

  const menuOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Menu) as MenuOption;
  const homeOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Home) as HomeOption;

  const currentMenu = menuOptionData?.value ?? [];

  const handleUpdateOption = async ({ id, key, value }: {
    id: string;
    key: OptionKey;
    value: OptionValue | OptionValue[];
  }) => {
    await updateOption({
      variables: {
        objects: [{ site_id: site.id, id, key, value }],
      },
      context: {
        headers: {
          'x-hasura-role': 'me',
        },
      },
    });

    optionRefetch();

    toast({
      title: 'Updated successful',
      position: 'top',
      status: 'success',
      isClosable: true,
      duration: 1000,
    });
  };

  const handleSubmit = async (input: PageInput) => {
    const response = await upsertPage({
      variables: {
        object: {
          ...input,
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
      await handleUpdateOption({
        id: menuOptionData?.id ?? uuidv4(),
        key: OptionKey.Menu,
        value: tmpMenu,
      });
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
    if (menuOptionData && Array.isArray(currentMenu)) {
      const remainedMenu = currentMenu.filter((o) => o.id !== id);
      await handleUpdateOption({
        id: menuOptionData.id,
        key: OptionKey.Menu,
        value: remainedMenu,
      });
    }

    pagesRefetch();
  };

  const setHomePage = async (pageId: string) => {
    await handleUpdateOption({
      id: homeOptionData?.id ?? uuidv4(),
      key: OptionKey.Home,
      value: { id: pageId },
    });
  };

  useEffect(() => {
    if (insertData) {
      // pagesRefetch();
      toast({
        title: `Task on ${insertData.insert_pages_one.name} successful`,
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
          menu={menuOptionData as MenuOption}
          onSubmit={(menu) => handleUpdateOption({
            id: menuOptionData?.id ?? uuidv4(),
            key: OptionKey.Menu,
            value: menu.value,
          })}
          refetch={optionRefetch}
        />
        <PageEditorModal
          collections={site.collections}
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
            customActions={() => (
              <IconButton
                aria-label="Open"
                colorScheme="green"
                variant={homeOptionData?.value.id === p.id ? 'solid' : 'outline'}
                borderRadius="4px"
                icon={<Icon as={MdHome}/>}
                onClick={() => setHomePage(p.id)}
              />
            )}
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
