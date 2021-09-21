import { useMemo } from 'react';
import { DEFAULT_DOM_ELEMENTS } from '@/lib/constants';
import { SectionElement } from '@/lib/enums';

export type GenerateDomProps = {
  isDragged?: boolean | ((key: SectionElement) => boolean);
  onClick?: (key: SectionElement) => void;
  component?: JSX.Element | JSX.Element[] | (({ key }: { key: SectionElement }) => JSX.Element);
};

export const useGenerateDom = (props: GenerateDomProps) => {
  const { isDragged, onClick, component } = props;

  const elements = useMemo(() => {
    return DEFAULT_DOM_ELEMENTS.map((key) => ({
      id: key,
      name: key,
      onClick: onClick,
      isDragged: typeof isDragged === 'function' ? isDragged(key) : isDragged,
      component: typeof component === 'function' ? component({ key }) : component,
    }));
  }, [isDragged, onClick, component]);

  return elements;
};

export default useGenerateDom;
