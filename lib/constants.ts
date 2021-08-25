import { SectionElement } from './enums';
import type { NavItem } from './types';

export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '';
export const BASE_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || '';
export const STORAGE_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || ''}/storage`;
export const IS_DEV = process.env.NODE_ENV === 'development';

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Inspiration',
    children: [
      {
        label: 'Explore Design Work',
        subLabel: 'Trending Design to inspire you',
        href: '#',
      },
      {
        label: 'New & Noteworthy',
        subLabel: 'Up-and-coming Designers',
        href: '#',
      },
    ],
  },
  {
    label: 'Find Work',
    children: [
      {
        label: 'Job Board',
        subLabel: 'Find your dream design job',
        href: '#',
      },
      {
        label: 'Freelance Projects',
        subLabel: 'An exclusive list for contract work',
        href: '#',
      },
    ],
  },
  {
    label: 'Learn Design',
    href: '#',
  },
  {
    label: 'Hire Designers',
    href: '#',
  },
];

export const DEFAULT_DOM_ELEMENTS = Object.values(SectionElement);

const tempLayout = [
  {
    i:   'logo', x:  0, y:  0, w:  2, h:  1, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'menu', x:  3, y:  0, w: 10, h:  1, minW: 6, maxW: 12, minH: 1, maxH: 2,
  },
  {
    i:   'main', x:  0, y:  1, w:  12, h: 10, minW: 6, maxW: 12, minH: 10, maxH: 12,
  },
  {
    i: 'footer', x:  0, y:  11, w:  12, h:  1, minW: 6, maxW: 12, minH: 1, maxH: 2,
  },
];
const mediumLayout = [
  {
    i:   'logo', x:  4, y:  0, w:  2, h:  1, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'menu', x:  0, y:  1, w: 10, h:  1, minW: 6, maxW: 10, minH: 1, maxH: 2,
  },
  {
    i:   'main', x:  0, y:  2, w:  10, h: 10, minW: 6, maxW: 10, minH: 10, maxH: 12,
  },
  {
    i: 'footer', x:  0, y:  11, w:  10, h:  1, minW: 6, maxW: 10, minH: 1, maxH: 2,
  },
];
const smallLayout = [
  {
    i:   'logo', x:  2, y:  0, w: 2, h:  1, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'menu', x:  0, y:  1, w: 6, h:  1, minW: 6, maxW: 6, minH: 1, maxH: 2,
  },
  {
    i:   'main', x:  0, y:  2, w:  6, h: 12, minW: 6, maxW: 6, minH: 12, maxH: 20,
  },
  {
    i: 'footer', x:  0, y:  11, w:  6, h:  1, minW: 6, maxW: 6, minH: 1, maxH: 2,
  },
];
const littleLayout = [
  {
    i:   'logo', x: 1, y:  0, w:  2, h:  1, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'menu', x: 0, y:  1, w: 4, h:  1, minW: 4, maxW: 4, minH: 1, maxH: 2,
  },
  {
    i:   'main', x: 0, y:  2, w: 4, h: 12, minW: 4, maxW: 4, minH: 12, maxH: 20,
  },
  {
    i: 'footer', x:  0, y:  11, w: 4, h:  1, minW: 4, maxW: 4, minH: 1, maxH: 2,
  },
];
const tinyLayout = [
  {
    i:   'logo', x: 0, y:  0, w:  2, h:  2, minW: 1, maxW:  2, minH: 1, maxH:  3,
  },
  {
    i:   'menu', x: 0, y:  1, w: 2, h:  1, minW: 2, maxW: 2, minH: 1, maxH: 2,
  },
  {
    i:   'main', x: 0, y:  2, w: 2, h: 12, minW: 2, maxW: 2, minH: 12, maxH: 20,
  },
  {
    i: 'footer', x:  0, y:  11, w: 2, h:  1, minW: 2, maxW: 2, minH: 1, maxH: 2,
  },
];
export const DEFAULT_LAYOUT = {
  layouts: {
    lg: tempLayout,
    md: mediumLayout,
    sm: smallLayout,
    xs: littleLayout,
    xxs: tinyLayout,
  },
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  },
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2,
  },
};
