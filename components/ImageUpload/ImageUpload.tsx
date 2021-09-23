import Uppy from '@uppy/core';
import { useCallback, useEffect, useState } from 'react';
import { DragDrop, FileInput, useUppy } from '@uppy/react';
import { useErrorHandler } from 'react-error-boundary';
import { ErrorBoundary } from '@/components';
import { Skeleton } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import { useAtom } from 'jotai';
import { siteAtom } from '@/lib/jotai';
import { storage } from '@/lib/nhost';
import { makeRandomName } from '@/lib/helpers';
import type { StorageResponse, ImageType } from '@/lib/types';

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
    console.log('### files: ', files);
    try {
      if (site && files.length > 0) {
        setLoading(true);

        const responses: StorageResponse[] = await Promise.all(
          files.map(async (file) => {
            const destination = collectionId ? `collection/${collectionId}` : 'general';
            const path = `/site/${site.id}/${destination}/${makeRandomName(file.name)}`;
            return storage.put(path, file);
          }),
        );

        const imageObjects = responses.map(({ Metadata, key }) => ({
          meta: JSON.stringify(Metadata),
          path: key,
          name: key.substring(key.lastIndexOf('/') + 1),
          collection_id: collectionId ?? 'general',
        }));

        onUpload(imageObjects);

        uppy.reset();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [collectionId, handleError, onUpload, site, uppy]);

  const handleOnDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setLoading(true);
      const files = Array.from(e.dataTransfer.files);
      await handleUpload(files);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    uppy.on('file-added', async (file) => {
      if (file.data instanceof File && isSubscribed && !isEqual(currentFiles, file.data)) {
        setCurrentFiles([file.data]);
        return handleUpload([file.data]);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [uppy, handleUpload, currentFiles]);

  return (
    <ErrorBoundary>
      <Skeleton speed={0.3} isLoaded={!loading}>
        {viewType === 'dragdrop' && (
          <DragDrop
            width="100%"
            height="150px"
            uppy={uppy}
            note="Deletion is permanent. Cancellation DOES NOT bring images back!"
            onClick={() => console.log('fucking click')}
            onDrop={(e: DragDropEvent) => handleOnDrop(e as React.DragEvent<HTMLDivElement>)}
            locale={{
              strings: {
                dropHereOr: 'Drop file(s) here or %{browse}',
              },
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
