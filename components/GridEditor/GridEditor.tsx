import React, {
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useMeasure } from 'react-use';
import { Box } from '@chakra-ui/react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import { GridItem, Ruler } from '../index';
import { DEFAULT_LAYOUT } from '../../lib/constants';

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridEditorProps = {
  onLayoutChange: (currentLayout: Layout[], allLayouts: Layouts) => void;
};

export const GridEditor = (props: GridEditorProps) => {
  const { onLayoutChange } = props;

  const [ref, { width }] = useMeasure<HTMLDivElement>();

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

  const handleItemOnClick = useCallback(() => setCurrentItem(null), []);
  const checkDragged = useCallback((id: string) => currentItem?.i === id, [currentItem]);

  const elements = useMemo(() => {
    return [
      {
        id: 'logo',
        name: 'Logo',
        isDragged: checkDragged('logo'),
        onClick: handleItemOnClick,
        component: <>Logo</>,
      },
      {
        id: 'menu',
        name: 'Menu',
        isDragged: checkDragged('menu'),
        onClick: handleItemOnClick,
        component: <>Menu</>,
      },
      {
        id: 'main',
        name: 'Main content',
        isDragged: checkDragged('main'),
        onClick: handleItemOnClick,
        component: <>Main</>,
      },
      {
        id: 'footer',
        name: 'Footer',
        isDragged: checkDragged('footer'),
        onClick: handleItemOnClick,
        component: <>Footer</>,
      },
    ];
  }, [checkDragged, handleItemOnClick]);

  return (
    <Box
      ref={ref}
      width="auto"
      maxWidth="1400px"
      marginX="auto"
    >
      <Ruler value={width} />

      <ResponsiveGridLayout
        layouts={layouts}
        breakpoints={DEFAULT_LAYOUT.breakpoints}
        cols={DEFAULT_LAYOUT.cols}
        rowHeight={40}
        onDragStart={handleOnDragStart}
        onDragStop={() => setCurrentItem(null)}
        onLayoutChange={handleLayoutChange}
      >
        {elements.map(({ id, isDragged, onClick, component }) => (
          <GridItem
            key={id}
            isDragged={isDragged}
            onClick={onClick}
          >
            {component}
          </GridItem>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default GridEditor;
