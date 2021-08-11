import { atom } from 'jotai';
import type { UserType, SiteType, PageType } from './types';

export const meAtom = atom<UserType | null>(null);
export const userIdAtom = atom((get) => get(meAtom)?.id ?? '');

export const siteAtom = atom<SiteType | null>(null);
export const siteIdAtom = atom((get) => get(siteAtom)?.id ?? '');

export const pageAtom = atom<PageType | null>(null);
