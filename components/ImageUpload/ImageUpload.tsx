import Uppy from '@uppy/core';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { ErrorBoundary } from '@/components';
import { Skeleton } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { siteAtom } from '@/lib/jotai';
import { storage } from '@/lib/nhost';
import { DragDrop, FileInput, useUppy } from '@uppy/react';
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

  const [loading, setLoading] = useState(false);

  const uppy = useUppy(
    () => new (Uppy as any)({ id: 'image-upload' }),
  );

  const handleUpload = async (files: File[]) => {
    try {
      if (site) {
        setLoading(true);
        const responses: StorageResponse[] = await Promise.all(
          files.map(async (file) => {
            const destination = collectionId ? `collection/${collectionId}` : 'general';
            const path = `/site/${site.id}/${destination}/${file.name}`;
            console.log('### path: ', path);
            return storage.put(path, file);
          }),
        );

        const imageObjects = responses.map(({ Metadata, key }) => ({
          meta: JSON.stringify(Metadata),
          path: key,
          name: key.substring(key.lastIndexOf('/') + 1),
          collection_id: collectionId ?? 'general',
        }));

        console.log('### imageObjects: ', imageObjects);

        onUpload(imageObjects);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

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
    // let isSubscribe = true;

    uppy.on('file-added', async (file) => {
      if (!collectionId && viewType === 'button') {
        await handleUpload([file]);
      }
    });
  }, [uppy]);

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
              // Text to show on the droppable area.
              // `%{browse}` is replaced with a link that opens the system file selection dialog.
                dropHereOr: 'Drop file here, browse does not work', // 'Drop here or %{browse}',
              // Used as the label for the link that opens the system file selection dialog.
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
