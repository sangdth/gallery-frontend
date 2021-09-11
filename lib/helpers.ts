import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { BASE_ENDPOINT, DEFAULT_LAYOUT, ROW_HEIGHT } from '@/lib/constants';
import type { Layouts } from 'react-grid-layout';
import type { OptionValue, SiteType, Tag } from '@/lib/types';

export const recursiveRemove = (tree: OptionValue[], id: string): OptionValue[] => {
  return tree.map(o => o).filter(a => a.id !== id).map(e => {
    const childTree = Array.isArray(e?.children) ? e.children : [];
    return { ...e, children: recursiveRemove(childTree, id) };
  });
};

export const recursiveInsert = (
  tree: OptionValue[],
  id: string,
  value: OptionValue,
): OptionValue[] => {
  return tree.map(e => {
    const childTree = Array.isArray(e?.children) ? e.children : [];
    if (e.id === id) {
      return { ...e, children: [...childTree, value] };
    }
    return { ...e, children: recursiveInsert(childTree, id, value) };
  });
};

export const makeId = (item?: OptionValue | null): string => {
  if (!item) {
    return uuidv4();
  }
  return `${item.id}-${item.slug}`;
};

export const arrayHasValue = (data: unknown): boolean => {
  if (!data) {
    return false;
  }
  return Array.isArray(data) && data.length > 0;
};

export const curlyBracketsRegex = /[^{\{]+(?=}\})/g;
export const curlyBracketsRegex2 = /{([^}]+)}+/g;
export const parseTags = (content?: string | null): Tag[] => {
  if (!content) {
    return [];
  }
  const matches = content.match(curlyBracketsRegex);
  return (matches ?? []).reduce<Tag[]>((acc, current) => {
    const [type, id] = current.split(':').map((s) => s.trim().toLowerCase());
    acc.push({ type, id });
    return acc;
  }, []);
};

export const makeSrcFromPath = (path?: string) => {
  if (path) {
    return `${BASE_ENDPOINT}/storage/o/${path}`;
  }
  return '/fallback-image.png';
};

export const makeLink = (o: SiteType | null) => ({
  href: `/sites/${o?.slug ?? ''}?preview`,
  label: o?.name ?? 'No site',
});

export const makeProductionLayouts = (
  height: number,
  layouts: Layouts = DEFAULT_LAYOUT.layouts,
): Layouts => {
  if (!height) {
    return layouts;
  }
  const h = Math.ceil((height - height % ROW_HEIGHT) / ROW_HEIGHT) + 1;
  const tmpLayouts = cloneDeep(layouts);
  Object.keys(tmpLayouts).forEach((k: string) => {
    const mainIndex = tmpLayouts[k].findIndex((o) => o.i === 'MAIN');
    if (mainIndex > -1) {
      const tmpMain = tmpLayouts[k][mainIndex];
      tmpMain.h = h > tmpMain.h ? h : tmpMain.h;
      tmpLayouts[k].splice(mainIndex, 1, tmpMain);
    }
  });
  return tmpLayouts;
};
