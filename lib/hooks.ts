import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { DEFAULT_DOM_ELEMENTS } from '@/lib/constants';
import { ALL_OPTIONS, UPSERT_OPTIONS } from '@/lib/graphqls';
import { SectionElement, OptionKey } from '@/lib/enums';
import type {
  HomeOption,
  MenuOption,
  LayoutOption,
  OptionType,
  OptionValue,
} from '@/lib/types';

export type GenerateDomProps = {
  isDragged?: boolean | ((key: SectionElement) => boolean);
  onClick?: (key: SectionElement) => void;
  component?: JSX.Element | JSX.Element[] | (({ key }: { key: SectionElement }) => JSX.Element);
};

export const useGenerateDom = (props: GenerateDomProps) => {
  const { isDragged, onClick, component } = props;

  const elements = React.useMemo(() => {
    return DEFAULT_DOM_ELEMENTS.map((key) => ({
      id: key,
      name: key,
      onClick: onClick,
      isDragged: typeof isDragged === 'function' ? isDragged(key) : isDragged,
      component: typeof component === 'function' ? component({ key }) : component,
    }));
  }, [isDragged, onClick, component]);

  return elements;
};

export const useOptions = (siteId: string) => {
  const toast = useToast();
  const {
    data: optionData,
    loading: queryLoading,
    error: queryError,
    refetch: optionRefetch,
  } = useQuery<{ options: OptionType[] }>(ALL_OPTIONS, {
    variables: { id: siteId },
    context: {
      headers: {
        'x-hasura-role': 'me',
      },
    },
  });

  const [updateOption, {
    loading: mutationLoading,
    error: mutationError,
  }] = useMutation(UPSERT_OPTIONS);

  const menuOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Menu) as MenuOption;
  const homeOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Home) as HomeOption;
  const layoutOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Layout) as LayoutOption;

  const updateOptions = async ({ id, key, value }: {
    id: string;
    key: OptionKey;
    value: OptionValue | OptionValue[];
  }) => {
    await updateOption({
      variables: {
        objects: [{ site_id: siteId, id, key, value }],
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
      duration: 800,
    });
  };
  
  return {
    isLoading: queryLoading || mutationLoading,
    data: {
      [OptionKey.Home]: homeOptionData,
      [OptionKey.Menu]: menuOptionData,
      [OptionKey.Layout]: layoutOptionData,
    },
    error: { queryError, mutationError },
    updateOptions,
  };
};
