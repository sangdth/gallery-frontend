import { v4 as uuidv4 } from 'uuid';
import { OptionValue, Tag } from '@/lib/types';

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
