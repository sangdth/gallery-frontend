import React from 'react';
import Uppy from '@uppy/core';
import { useAtom } from 'jotai';
import { DragDrop, useUppy } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { siteIdAtom } from '../../lib/jotai';
import { storage } from '../../lib/nhost';
import type { StorageResponse, ImageType } from '../../lib/types';

type Props = {
  collectionId: string;
  onUpload: (images: Partial<ImageType>[]) => void;
};

type DragDropEvent = MouseEvent | React.DragEvent<HTMLDivElement>;

// export const INSERT_IMAGES = gql`
//   mutation INSERT_IMAGES($objects: [images_insert_input!]!) {
//     insert_images(
//       objects: $objects,
//       on_conflict: {constraint: images_pkey, update_columns: [meta, path, status, collection_id]}
//     ) {
//       returning {
//         created_at
//         updated_at
//         id
//         path
//       }
//     }
//   }
// `;

export const ImageUpload = (props: Props) => {
  const { collectionId, onUpload } = props;
  const [siteId] = useAtom(siteIdAtom);

  const uppy = useUppy(
    () => new (Uppy as any)({ id: 'image-upload' }),
  );

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    try {
      if (e.dataTransfer) {
        const files = Array.from(e.dataTransfer.files);

        const responses: StorageResponse[] = await Promise.all(
          files.map(async (file) => {
            const path = `/site/${siteId}/collection/${collectionId}/${file.name}`;
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
    }
  };

  return (
    <DragDrop
      width="100%"
      height="100%"
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
  );
};

export default ImageUpload;
