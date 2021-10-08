import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';
import {
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Input, OptionSection } from '@/components';
import { siteAtom } from '@/lib/jotai';
import { useOptions } from '@/lib/hooks';
import { OptionKey } from '@/lib/enums';

export const DomainOptionSection = () => {
  const handleError = useErrorHandler();
  const [site] = useAtom(siteAtom);

  const {
    isLoading: updateOptionLoading,
    data: optionData,
    updateOptions,
  } = useOptions(site?.id);

  const domainOptionData = optionData[OptionKey.Domain];
  const currentDomain = domainOptionData?.value?.name ?? '';

  const [domainInput, setDomainInput] = useState(currentDomain);

  const buttonBg = currentDomain === domainInput ? 'gray.300' : 'green.600';
  const hoverBg = useColorModeValue('green.500', 'gray.600');

  const handleSaveDomain = async () => {
    try {
      await updateOptions({
        id: domainOptionData?.id ?? uuidv4(),
        key: OptionKey.Domain,
        value: {
          name: domainInput,
        },
      });
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (!domainInput && currentDomain.length > 0) {
      setDomainInput(currentDomain);
    }
  }, [currentDomain, domainInput]);

  return (
    <OptionSection title="Logo">
      <HStack>
        <Input
          placeholder="example.com"
          value={domainInput}
          onChange={(e) => setDomainInput(e.currentTarget.value)}
        />
        <Button
          isLoading={updateOptionLoading}
          color="white"
          backgroundColor={buttonBg}
          _hover={{ bg: hoverBg }}
          onClick={handleSaveDomain}
        >
          Save
        </Button>
      </HStack>
    </OptionSection>
  );
};
