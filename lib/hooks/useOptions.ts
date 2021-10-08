import { useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_OPTIONS, UPSERT_OPTIONS } from '@/lib/graphqls';
import { OptionKey } from '@/lib/enums';
import type {
  DomainOption,
  HomeOption,
  LayoutOption,
  LogoOption,
  MenuOption,
  OptionValue,
  OptionQueryData,
  OptionInsertedData,
} from '@/lib/types';

const useOptions = (siteId?: string) => {
  const toast = useToast();

  const {
    data: optionData,
    loading: queryLoading,
    error: queryError,
    refetch: optionRefetch,
  } = useQuery<OptionQueryData>(ALL_OPTIONS, {
    variables: { siteId },
    context: {
      headers: {
        'x-hasura-role': 'me',
      },
    },
  });

  const [updateOption, {
    loading: mutationLoading,
    error: mutationError,
  }] = useMutation<OptionInsertedData>(UPSERT_OPTIONS);

  const menuOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Menu) as MenuOption;
  const homeOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Home) as HomeOption;
  const layoutOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Layout) as LayoutOption;
  const logoOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Logo) as LogoOption;
  const domainOptionData = optionData?.options
    .find(({ key }) => key === OptionKey.Domain) as DomainOption;

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
      [OptionKey.Domain]: domainOptionData,
    },
    error: { queryError, mutationError },
    updateOptions,
  };
};

export default useOptions;
