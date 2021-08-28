import React, {
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useMeasure } from 'react-use';
import { Box } from '@chakra-ui/react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import { GridItem, Ruler } from '@/components';
import { DEFAULT_LAYOUT } from '@/lib/constants';
import { SectionElement } from '@/lib/enums';

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridEditorProps = {
  layouts: Layouts;
  onLayoutChange: (allLayouts: Layouts) => void;
};

export const GridEditor = (props: GridEditorProps) => {
  const {
    layouts,
    onLayoutChange,
  } = props;

  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const [layoutsLocal, setLayoutsLocal] = useState(layouts);
  const [currentItem, setCurrentItem] = useState<Layout | null>(null);

  const handleLayoutChange = ({}, allLayouts: Layouts) => {
    setLayoutsLocal(allLayouts);

    if (typeof onLayoutChange === 'function') {
      onLayoutChange(allLayouts);
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
        id: SectionElement.Logo,
        name: 'Logo',
        isDragged: checkDragged('logo'),
        onClick: handleItemOnClick,
        component: <>Logo</>,
      },
      {
        id: SectionElement.Menu,
        name: 'Menu',
        isDragged: checkDragged('menu'),
        onClick: handleItemOnClick,
        component: <>Menu</>,
      },
      {
        id: SectionElement.Main,
        name: 'Main content',
        isDragged: checkDragged('main'),
        onClick: handleItemOnClick,
        component: <>Main</>,
      },
      {
        id: SectionElement.Footer,
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
        layouts={layoutsLocal}
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
            editable
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
