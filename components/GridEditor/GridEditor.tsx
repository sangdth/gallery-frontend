import React from 'react';
import GridLayout from 'react-grid-layout';
// import { Navbar } from '../Navbar';
import { Logo } from '../index';

type GridEditorProps = {
};

export const GridEditor = (props: GridEditorProps) => {
  console.log('### props: ', props);
  const layout = [
    {
      i: 'a', x: 0, y: 0, w: 1, h: 2,
    },
    {
      i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4,
    },
    {
      i: 'c', x: 4, y: 0, w: 1, h: 2,
    },
  ];

  return (
    <GridLayout layout={layout} cols={12} rowHeight={30} width={1200}>
      <div key="a"><Logo key="a" preview /></div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
  );
};

export default GridEditor;
