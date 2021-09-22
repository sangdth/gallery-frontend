import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { LogoOptionSection } from '@/components';
import { useOptions } from '@/lib/hooks';
import type {
  SiteType,
} from '@/lib/types';

type OptionsPanelProps = {
  site: SiteType;
};

const OptionsPanel = (props: OptionsPanelProps) => {
  const { site } = props;
  const { data: optionData } = useOptions(site.id);
  console.log('### optionData: ', optionData);

  return (
    <>
      <LogoOptionSection />
    </>
  );
};

export default OptionsPanel;
