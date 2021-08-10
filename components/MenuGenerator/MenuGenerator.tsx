import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';
import { PageItem } from '../PageItem';
import type { DragItemType, PageType } from '../../lib/types';

const grid = 8;

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
  background: isDragging ? 'lightgreen' : 'white',
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'white' : 'white',
  padding: 0,
  width: 'auto',
});

type Props = {
  id?: string;
  pages: PageType[];
  menu: DragItemType[];
  onChange: (newMenu: DragItemType[]) => void;
  onDelete: (id: string) => void;
};

export const MenuGenerator = (props: Props) => {
  const { menu, pages, onChange, onDelete, id = 'root' } = props;

  const [items, setItems] = useState(menu);

  const pagesMap = pages.reduce((acc, page) => {
    acc[page.id] = page;
    return acc;
  }, {} as {[key: string]: PageType });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) { // dropped outside the list
      return;
    }

    const newItems = reorder(items, source.index, destination.index);

    setItems(newItems);
    onChange(newItems);
  };

  useEffect(() => {
    if (menu !== items) {
      setItems(menu);
    }
  }, [menu]);

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
                {(provided, { isDragging }) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={getItemStyle(isDragging, provided.draggableProps)}
                  >
                    <PageItem
                      {...pagesMap[item.id]}
                      name={item.label}
                      onDelete={() => onDelete(item.id)}
                    />
                  </div>
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
