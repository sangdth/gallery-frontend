import React, { useEffect, useMemo, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';
import {
  Button,
  Checkbox,
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
  const currentRedirect = domainOptionData?.value?.redirect ?? false;

  const [domainInput, setDomainInput] = useState('example.com');
  const [domainRedirect, setDomainRedirect] = useState(false);

  const hasChanged = useMemo(() => {
    return currentDomain !== domainInput || currentRedirect !== domainRedirect;
  }, [currentDomain, currentRedirect, domainInput, domainRedirect]);

  const buttonBg = hasChanged ? 'green.600' : 'gray.300';
  const hoverBg = useColorModeValue('green.500', 'gray.600');

  const handleSaveDomain = async () => {
    try {
      await updateOptions({
        id: domainOptionData?.id ?? uuidv4(),
        key: OptionKey.Domain,
        value: {
          name: domainInput,
          redirect: domainRedirect,
        },
      });
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (currentDomain.length > 0 && domainInput === 'example.com') {
      setDomainInput(currentDomain);
      setDomainRedirect(currentRedirect);
    }
  }, [currentDomain, domainInput]);

  return (
    <OptionSection title="Domain">
      <HStack>
        <Input
          placeholder="example.com"
          value={domainInput}
          onChange={(e) => setDomainInput(e.currentTarget.value)}
        />
        <Checkbox
          isChecked={domainRedirect}
          onChange={(e) => setDomainRedirect(e.target.checked)}
        >
          Redirect to wwww.{domainInput}
        </Checkbox>
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
