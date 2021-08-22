import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { siteAtom } from '@/lib/jotai';
import { storage } from '@/lib/nhost';
import { ImageUploadView } from './ImageUploadView';
import type { StorageResponse, ImageType } from '@/lib/types';

type Props = {
  collectionId: string;
  onUpload: (images: Partial<ImageType>[]) => void;
};

export const ImageUpload = (props: Props) => {
  const { collectionId, onUpload } = props;
  const [site] = useAtom(siteAtom);
  const [loading, setLoading] = useState(false);

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
    <ImageUploadView
      isLoading={loading}
      onDrop={handleDrop}
    />
  );
};

export default ImageUpload;
