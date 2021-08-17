import { atom } from 'jotai';
import type {
  UserType,
  SiteType,
  PageType,
  CollectionType,
  LayoutType,
} from './types';

export const meAtom = atom<UserType | null>(null);
export const siteAtom = atom<SiteType | null>(null);
export const pageAtom = atom<PageType | null>(null);
export const collectionAtom = atom<CollectionType | null>(null);
export const layoutAtom = atom<LayoutType | null>(null);
