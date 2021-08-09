import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { PageItem } from '../PageItem';
import type { DragItemType } from '../../lib/types';

const grid = 8;

const reorder = (list: DragItemType[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 'auto',
});

type Props = {
  menu: DragItemType[];
  onChange: (newMenu: DragItemType[]) => void;
};

export const MenuGenerator = (props: Props) => {
  const { menu } = props;

  const [items, setItems] = useState(menu);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) { // dropped outside the list
      return;
    }

    const newItems = reorder(items, source.index, destination.index);

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(dropProvided, snapshot) => (
          <div
            {...dropProvided.droppableProps}
            ref={dropProvided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, dragSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      dragSnapshot.isDragging,
                      provided.draggableProps.style,
                    )}
                  >
                    <PageItem
                      // ref={provided.innerRef}
                      name={item.label}
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