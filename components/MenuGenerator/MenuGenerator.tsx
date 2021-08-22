import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';
import { Box } from '@chakra-ui/react';
import { ActionItem } from '../ActionItem';
import type { DragItemType, ActionItemDataType } from '../../lib/types';

const grid = 10;

const reorder = (list: DragItemType[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging: boolean, draggableProps: DraggableProvidedDraggableProps) => ({
  // padding: grid * 2,
  ...draggableProps.style,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '4px',
  background: isDragging ? 'lightgreen' : 'white',
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'white' : 'white',
  padding: 0,
  width: 'auto',
});

type MenuGeneratorProps<T> = {
  id?: string;
  data: T[];
  menu: DragItemType[];
  onChange: (newMenu: DragItemType[]) => void;
  onDelete?: (id: string) => void;
  onEdit?: (o: T) => void;
};

export const MenuGenerator = <T extends ActionItemDataType>(props: MenuGeneratorProps<T>) => {
  const {
    menu,
    data,
    onChange,
    onDelete,
    onEdit,
    id = 'root',
  } = props;

  const [items, setItems] = useState(menu);

  const dataMap = data.reduce((acc, row) => {
    acc[row.id] = row;
    return acc;
  }, {} as { [key: string]: T });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) { // dropped outside the list
      return;
    }

    const newItems = reorder(items, source.index, destination.index);

    setItems(newItems);
    onChange(newItems);
  };

  const handleEdit = (o: T) => {
    if (typeof onEdit === 'function') {
      onEdit(o);
    }
  };

  const handleDelete = (item: DragItemType) => {
    if (typeof onDelete === 'function') {
      onDelete(item.id);
    }
  };

  useEffect(() => {
    if (menu !== items) {
      setItems(menu);
    }
  }, [menu, items]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`droppable-${id}`}>
        {(dropProvided, snapshot) => (
          <div
            {...dropProvided.droppableProps}
            ref={dropProvided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, draggableSnapshot) => (
                  <Box
                    as="div"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={getItemStyle(draggableSnapshot.isDragging, provided.draggableProps)}
                  >
                    <ActionItem
                      draggable
                      data={dataMap[item.id] ?? {}}
                      onEdit={() => handleEdit(dataMap[item.id])}
                      onDelete={() => handleDelete(item)}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MenuGenerator;
