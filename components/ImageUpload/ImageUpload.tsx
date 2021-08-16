import React, { useState } from 'react';
import { Skeleton } from "@chakra-ui/react"
import Uppy from '@uppy/core';
import { useAtom } from 'jotai';
import { DragDrop, useUppy } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { siteAtom } from '../../lib/jotai';
import { storage } from '../../lib/nhost';
import type { StorageResponse, ImageType } from '../../lib/types';

type Props = {
  collectionId: string;
  onUpload: (images: Partial<ImageType>[]) => void;
};

type DragDropEvent = MouseEvent | React.DragEvent<HTMLDivElement>;

export const ImageUpload = (props: Props) => {
  const { collectionId, onUpload } = props;
  const [site] = useAtom(siteAtom);
  const [loading, setLoading] = useState(false);

  const uppy = useUppy(
    () => new (Uppy as any)({ id: 'image-upload' }),
  );

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    try {
      if (e.dataTransfer && site) {
        const files = Array.from(e.dataTransfer.files);
        setLoading(true);
        const responses: StorageResponse[] = await Promise.all(
          files.map(async (file) => {
            const path = `/site/${site.id}/collection/${collectionId}/${file.name}`;
            return storage.put(path, file);
          }),
        );

        const imageObjects = responses.map(({ Metadata, key }) => ({
          meta: JSON.stringify(Metadata),
          path: key,
          collection_id: collectionId,
        }));

        onUpload(imageObjects);
      }
    } catch (error) {
      console.log(error); // eslint-disable-line
    } finally {
      setLoading(false);
    }
  };

  return (
    <Skeleton speed={0.3} isLoaded={!loading}>
      <DragDrop
        width="100%"
        height="150px"
        uppy={uppy}
        note="Remember to press Submit to save collection!"
        onDrop={(e: DragDropEvent) => handleDrop(e as React.DragEvent<HTMLDivElement>)}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: 'Drop file here, browse does not work', // 'Drop here or %{browse}',
            // Used as the label for the link that opens the system file selection dialog.
          },
        }}
      />
    </Skeleton>
  );
};

export default ImageUpload;
