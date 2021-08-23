import React, { useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react';
import type { PageType } from '@/lib/types';

export type PageSelectorProps = {
  placeholder?: string;
  pages: PageType[];
  onSelect: (id: string) => void;
};

export const PageSelector = (props: PageSelectorProps) => {
  const {
    placeholder = 'Select page to add',
    pages,
    onSelect,
  } = props;
  const [selectedId, setSelectedId] = useState('');
  
  const handleOnSelect = (e: React.FormEvent<HTMLSelectElement>) => {
    const id = e.currentTarget.value;
    onSelect(id);
    setSelectedId(id);
  };
  
  useEffect(() => {
    return () => {
      setSelectedId('');
    };
  }, []);

  return (
    <Select
      width="250px"
      placeholder={placeholder}
      value={selectedId}
      onChange={handleOnSelect}
    >
      {pages.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </Select>
  );
};

export default PageSelector;
