import React, { useState } from 'react';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
} from '@chakra-ui/react';
import { Input } from '@/components';
import type { Folder, PageType } from '@/lib/types';

export type PageSelectorProps = {
  placeholder?: string;
  pages: PageType[];
  onSelect: (id: string) => void;
  onCreate: (folder: Folder) => void;
};

// TODO: Change name and add grouping only option (no page uuid)
export const PageSelector = (props: PageSelectorProps) => {
  const {
    placeholder = 'Select page to add',
    pages,
    onCreate,
    onSelect,
  } = props;

  const [selectedId, setSelectedId] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  // TODO: Make query to detect page slug usability, do not allow
  // user creates folder with slug already used
  // Make slug input as well
  const [formInput, setFormInput] = useState('');

  const handleClose = () => {
    setFormVisible(false);
    setFormInput('');
  };
  
  const handleOnSelect = (e: React.FormEvent<HTMLSelectElement>) => {
    const id = e.currentTarget.value;
    if (id === 'folder-only') {
      setFormVisible(true);
    } else {
      onSelect(id);
      setSelectedId(id);
    }
  };
 
  const handleSubmit = () => {
    onCreate({
      id: uuidv4(),
      label: formInput,
      slug: slugify(formInput, { lower:  true }),
      description: slugify(formInput),
    });

    handleClose();
  };

  // TODO: Can not stop the warning from Popover in development
  return (
    <Popover
      isOpen={formVisible}
      closeOnBlur={false}
      returnFocusOnClose={false}
      placement="right"
      onClose={handleClose}
    >
      <PopoverTrigger>
        <Select
          width="250px"
          placeholder={placeholder}
          value={selectedId}
          onChange={handleOnSelect}
        >
          <option key="create-folder" value="folder-only">
            Create folder only
          </option>
          {pages.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Input
            placeholder="Folder name"
            value={formInput}
            onChange={e => setFormInput(e.currentTarget.value)}
          />
        </PopoverBody>
        <PopoverFooter d="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button colorScheme="green" onClick={handleSubmit}>Apply</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default PageSelector;
