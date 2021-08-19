import React, { useState } from 'react';
// import { isEqual } from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
// import { Navbar } from '../Navbar';
import { GridItem, Logo } from '../index';
import { DEFAULT_LAYOUT } from '../../lib/constants';

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridEditorProps = {
  onLayoutChange: (currentLayout: Layout[], allLayouts: Layouts) => void;
};

export const GridEditor = (props: GridEditorProps) => {
  const { onLayoutChange } = props;

  const [layouts] = useState(DEFAULT_LAYOUT.layouts);
  const [currentItem, setCurrentItem] = useState<Layout | null>(null);

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    if (typeof onLayoutChange === 'function') {
      onLayoutChange(currentLayout, allLayouts);
    }
  };

  const handleOnDragStart = (_: Layout[], item: Layout) => {
    setCurrentItem(item);
  };

  const handleItemOnClick = () => setCurrentItem(null);
  const isDragged = (id: string) => currentItem?.i === id;

  return (
    <ResponsiveGridLayout
      layouts={layouts}
      cols={DEFAULT_LAYOUT.cols}
      rowHeight={40}
      width={900}
      onDragStart={handleOnDragStart}
      onDragStop={() => setCurrentItem(null)}
      onLayoutChange={handleLayoutChange}
    >
      <GridItem
        key="logo"
        isDragged={isDragged('logo')}
        onClick={handleItemOnClick}
      >
        <Logo key="a" preview />
      </GridItem>
      <GridItem
        key="menu"
        isDragged={isDragged('menu')}
        onClick={handleItemOnClick}
      >
        Menu
      </GridItem>
      <GridItem
        key="side"
        onClick={handleItemOnClick}
        isDragged={isDragged('side')}
      >
        Side
      </GridItem>
      <GridItem
        key="main"
        onClick={handleItemOnClick}
        isDragged={isDragged('main')}
      >
        Main
      </GridItem>
    </ResponsiveGridLayout>
  );
};

export default GridEditor;
