import { useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_OPTIONS, UPSERT_OPTIONS } from '@/lib/graphqls';
import { OptionKey } from '@/lib/enums';
import type {
  HomeOption,
  LayoutOption,
  LogoOption,
  MenuOption,
  OptionType,
  OptionValue,
} from '@/lib/types';

const useOptions = (siteId: string) => {
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
  const logoOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Logo) as LogoOption;

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
      [OptionKey.Logo]: logoOptionData,
    },
    error: { queryError, mutationError },
    updateOptions,
  };
};

export default useOptions;
