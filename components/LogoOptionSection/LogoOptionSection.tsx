import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';
import { useMutation } from '@apollo/client';
import { useErrorHandler } from 'react-error-boundary';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Flex,
  HStack,
  Image,
} from '@chakra-ui/react';
import {
  ImageUpload,
  ConfirmButton,
  OptionSection,
} from '@/components';
import { INSERT_IMAGES, DELETE_IMAGES } from '@/lib/graphqls';
import { makeSrcFromPath } from '@/lib/helpers';
import { useOptions } from '@/lib/hooks';
import { siteAtom } from '@/lib/jotai';
import { OptionKey } from '@/lib/enums';
import { storage } from '@/lib/nhost';
import type { ImageType } from '@/lib/types';

const LogoOptionSection = () => {
  const [site] = useAtom(siteAtom);

  const [insertImages, { error: insertImagesError }] = useMutation(INSERT_IMAGES);
  const [deleteImages, { error: deleteImagesError }] = useMutation(DELETE_IMAGES);

  const {
    // isLoading: updateOptionLoading,
    data: optionData,
    updateOptions,
  } = useOptions(site?.id ?? '');

  const logoOptionData = optionData[OptionKey.Logo];

  const anyError = insertImagesError || deleteImagesError;

  const handleError = useErrorHandler(anyError);

  const handleUpload = async (images: Partial<ImageType>[]) => {
    try {
      const response = await insertImages({
        variables: {
          objects: images,
        },
        context: {
          headers: {
            'x-hasura-role': 'me',
          },
        },
      });

      if (response?.data.insert_images.returning) {
        const [uploaded] = response?.data.insert_images.returning;
        await updateOptions({
          id: logoOptionData?.id ?? uuidv4(),
          key: OptionKey.Logo,
          value: {
            id: uploaded.id,
            path: uploaded.path,
          },
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async () => {
    if (logoOptionData?.value) {
      const currentLogo = logoOptionData.value;
      try {
        await deleteImages({
          variables: { ids: [currentLogo.id] },
          context: {
            headers: {
              'x-hasura-role': 'me',
            },
          },
        });

        await storage.delete(`/${currentLogo.path}`);

        await updateOptions({
          id: logoOptionData.id,
          key: OptionKey.Logo,
          value: { 
            ...currentLogo,
            path: null,
          },
        });
      } catch (err) {
        handleError(err);
      }
    }
  };

  return (
    <OptionSection title="Logo">
      <HStack>
        <Image
          maxWidth="200px"
          alt={logoOptionData?.value?.path ?? 'no name'}
          src={makeSrcFromPath(logoOptionData?.value?.path ?? '')}
        />
        <Flex direction="column" justify="space-around">
          {logoOptionData?.value ? (
            <ConfirmButton
              icon={<DeleteIcon />}
              label="Delete current logo"
              message={'Delete the current logo?'}
              onConfirm={handleDelete}
            />
          ) : (
            <ImageUpload
              viewType="button"
              onUpload={handleUpload}
            />
          )}

        </Flex>
      </HStack>
    </OptionSection>
  );
};

export default LogoOptionSection;
