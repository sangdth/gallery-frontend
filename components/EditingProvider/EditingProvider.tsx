import React, { createContext } from 'react';
import type {
  DataType,
  EditingItem,
  EditingItemType,
} from '@/lib/types';

export type EditingContextType<T extends DataType> = {
  // isEditing: boolean;
  // isLoading: boolean;
  editingItems: EditingItem<T>[];
  setItems?: (items: EditingItem<T>[]) => void;
  // getItems: () => void;
};

const EditingContext = createContext<EditingContextType<DataType>>({
  // isEditing: false,
  // isLoading: false,
  editingItems: [],
});

export type EditingProviderProps<ItemType extends EditingItemType> = {
  // changeType?: Entity;
  children: React.ReactNode;
  mapDataToEditingItems: (row: DataType) => ItemType;
};

export const EditingProvider = <ItemType extends EditingItemType>(
  props: EditingProviderProps<ItemType>,
) => {
  const {
    children,
    // changeType,
    // mapDataToEditingItems,
  } = props;

  // const [value, setValue] = useState(null);
  // const [edited, setEdited] = useState(null);

  const context = {
    editingItems: [],
    // value,
    // edited,
    // setValue,
    // setEdited,
  };

  return (
    <EditingContext.Provider value={context}>
      {typeof children === 'function' ? children(context) : children}
    </EditingContext.Provider>
  );
};

export default EditingProvider;
