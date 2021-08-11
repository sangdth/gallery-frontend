import React, { createContext, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { atom, useAtom } from 'jotai';
import type {
  // ActionItemDataType,
  RecursivePartial,
} from '../../lib/types';

export type EditingItem = {
  value?: any | null;
  edited?: RecursivePartial<any> | null;
};

export type EditingProviderProps = {
  children: React.ReactNode;
};

export type EditingContextType = {
  current: EditingItem;
};


export const EditingProvider = (props: EditingProviderProps) => {
  const {
    children,
  } = props;

  const EditingContext = createContext({
    value: null,
  });
  
  const [value, setValue] = useState(null);
  const [edited, setEdited] = useState(null);

  const context = {
    value,
    edited,
    setValue,
    setEdited,
  };

  return (
    <EditingContext.Provider value={context}>
      {typeof children === 'function' ? children(context) : children}
    </EditingContext.Provider>
  );
};

export default EditingProvider;
