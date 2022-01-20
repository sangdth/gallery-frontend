import Uppy from '@uppy/core';
import { useCallback, useEffect, useState } from 'react';
import { DragDrop, FileInput, useUppy } from '@uppy/react';
import { useErrorHandler } from 'react-error-boundary';
import { ErrorBoundary } from '@/components';
import { Skeleton } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import { useAtom } from 'jotai';
import { siteAtom } from '@/lib/jotai';
import { nhost } from '@/lib/nhost';
import { DRAGDROP_DESCRIPTION } from '@/lib/constants';
// import { makeRandomName } from '@/lib/helpers';
import type { ImageType } from '@/lib/types';

type DragDropUploadViewProps = {
  collectionId?: string;
  onUpload: (images: Partial<ImageType>[]) => void;
  viewType?: 'dragdrop' | 'button';
};

type DragDropEvent = MouseEvent | React.DragEvent<HTMLDivElement>;

const ImageUpload = (props: DragDropUploadViewProps) => {
  const {
    collectionId,
    onUpload,
    viewType = 'dragdrop',
  } = props;

  const [site] = useAtom(siteAtom);
  const handleError = useErrorHandler();

  const [currentFiles, setCurrentFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);

  const uppy = useUppy(
    () => new (Uppy as any)({ id: 'image-upload' }),
  );

  const handleUpload = useCallback(async (files: File[]) => {
    try {
      if (site && files.length > 0) {
        setLoading(true);

        const responses = await Promise.all(
          files.map(async (file) => {
            // const destination = collectionId ? `collection/${collectionId}` : 'general';
            // const path = `/site/${site.id}/${destination}/${makeRandomName(file.name)}`;
            return nhost.storage.upload({ file });
          }),
        );

        const imageObjects = responses.map(({ fileMetadata }) => ({
          meta: JSON.stringify(fileMetadata),
          path: nhost.storage.getUrl({ fileId: fileMetadata?.id ?? '' }),
          // name: key.substring(key.lastIndexOf('/') + 1),
          name: fileMetadata?.name,
          collection_id: collectionId ?? null,
        }));

        onUpload(imageObjects);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setCurrentFiles(null);
      setLoading(false);
    }
  }, [collectionId, handleError, onUpload, site]);

  const handleOnDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setLoading(true);
      const files = Array.from(e.dataTransfer.files);
      setCurrentFiles(files);
      await handleUpload(files);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    uppy.on('file-added', async ({ data }) => {
      const shouldAutoUpload = viewType !== 'dragdrop' && isSubscribed && !isEqual(currentFiles, data);

      if (data instanceof File && shouldAutoUpload) {
        setCurrentFiles([data]);
        return handleUpload([data]);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [uppy, handleUpload, currentFiles, viewType]);

  return (
    <ErrorBoundary>
      <Skeleton speed={0.3} isLoaded={!loading}>
        {viewType === 'dragdrop' && (
          <DragDrop
            width="100%"
            height="150px"
            uppy={uppy}
            note="Deletion is permanent. Cancellation DOES NOT bring images back!"
            onDrop={(e: DragDropEvent) => handleOnDrop(e as React.DragEvent<HTMLDivElement>)}
            locale={{
              strings: { dropHereOr: DRAGDROP_DESCRIPTION },
            }}
          />
        )}

        {viewType === 'button' && (
          <FileInput
            pretty
            uppy={uppy}
            inputName="files[]"
          />
        )}
      </Skeleton>
    </ErrorBoundary>
  );
};

export default ImageUpload;
