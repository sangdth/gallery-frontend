import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import ServiceCommandUnit from './ServiceCommandUnit';
import type { DragMenuItem } from '../../lib/types';

const grid = 8;
// a little function to help us with reordering the result
const reorder = (list: DragMenuItem[], startIndex: number, endIndex: number) => {
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

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 200,
});

type Props = {
  menu: DragMenuItem[];
  onChange: (newMenu: DragMenuItem[]) => void;
};

export const MenuGenerator = (props: Props) => {
  const { menu } = props;

  const [items, setItems] = useState(menu);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) { // dropped outside the list
      return;
    }

    const sourceIndex = source.index;
    const destIndex = destination.index;

    if (result.type === 'droppableItem') {
      const reorderedItems = reorder(items, sourceIndex, destIndex);

      setItems(recorderedItems);
    } else if (result.type === 'droppableSubItem') {
      const itemSubItemMap = items.reduce((acc, item) => {
        acc[item.id] = item.children;
        return acc;
      }, {});

      const sourceParentId = parseInt(source.droppableId, 10);
      const destParentId = parseInt(destination.droppableId, 10);

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...items];

      /** In this case children are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex,
        );
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.children = reorderedSubItems;
          }
          return item;
        });
        setItems(newItems);
      } else {
        const newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        const newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.children = newSourceSubItems;
          } else if (item.id === destParentId) {
            item.children = newDestSubItems;
          }
          return item;
        });
        setItems(newItems);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="droppableItem">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                      )}
                    >
                      {item.content}
                      <span
                        {...provided.dragHandleProps}
                        style={{
                          display: 'inline-block',
                          margin: '0 10px',
                          border: '1px solid #000',
                        }}
                      >
                        Drag
                      </span>
                      <ServiceCommandUnit
                        children={item.children}
                        type={item.id}
                      />
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MenuGenerator;
