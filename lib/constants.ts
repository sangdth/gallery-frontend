import { SectionElement } from './enums';
import type { NavItem } from './types';

export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '';
export const BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT ?? 'http://localhost:1337';
export const STORAGE_ENDPOINT = `${BACKEND_ENDPOINT}/storage`;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const THUMBNAIL_LIMIT = 8;

export const DRAGDROP_DESCRIPTION = 'Drop file(s) here or browse';

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

export const ROW_HEIGHT = 40;

export const DEFAULT_DOM_ELEMENTS = [
  SectionElement.Logo,
  SectionElement.Menu,
  SectionElement.Main,
  SectionElement.Footer,
];

const tempLayout = [
  {
    i:   'LOGO', x:  0, y:  0, w:  2, h:  2, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'MENU', x:  3, y:  0, w: 10, h:  2, minW: 6, maxW: 12, minH: 1, maxH: 2,
  },
  {
    i:   'MAIN', x:  0, y:  1, w:  12, h: 16, minW: 6, maxW: 12, minH: 10,
  },
  {
    i: 'FOOTER', x:  0, y:  11, w:  12, h:  1, minW: 6, maxW: 12, minH: 1, maxH: 2,
  },
];
const mediumLayout = [
  {
    i:   'LOGO', x:  4, y:  0, w:  2, h:  2, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'MENU', x:  0, y:  1, w: 10, h:  2, minW: 6, maxW: 10, minH: 1, maxH: 2,
  },
  {
    i:   'MAIN', x:  0, y:  2, w:  10, h: 16, minW: 6, maxW: 10, minH: 10,
  },
  {
    i: 'FOOTER', x:  0, y:  11, w:  10, h:  1, minW: 6, maxW: 10, minH: 1, maxH: 2,
  },
];
const smallLayout = [
  {
    i:   'LOGO', x:  2, y:  0, w: 2, h:  2, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'MENU', x:  0, y:  1, w: 6, h:  2, minW: 6, maxW: 6, minH: 1, maxH: 2,
  },
  {
    i:   'MAIN', x:  0, y:  2, w:  6, h: 16, minW: 6, maxW: 6, minH: 12,
  },
  {
    i: 'FOOTER', x:  0, y:  11, w:  6, h:  1, minW: 6, maxW: 6, minH: 1, maxH: 2,
  },
];
const littleLayout = [
  {
    i:   'LOGO', x: 1, y:  0, w:  2, h:  2, minW: 1, maxW:  4, minH: 1, maxH:  3,
  },
  {
    i:   'MENU', x: 0, y:  1, w: 4, h:  2, minW: 4, maxW: 4, minH: 1, maxH: 2,
  },
  {
    i:   'MAIN', x: 0, y:  2, w: 4, h: 16, minW: 4, maxW: 4, minH: 12,
  },
  {
    i: 'FOOTER', x:  0, y:  11, w: 4, h:  1, minW: 4, maxW: 4, minH: 1, maxH: 2,
  },
];
const tinyLayout = [
  {
    i:   'LOGO', x: 0, y:  0, w:  2, h:  2, minW: 1, maxW:  2, minH: 1, maxH:  3,
  },
  {
    i:   'MENU', x: 0, y:  1, w: 2, h:  2, minW: 2, maxW: 2, minH: 1, maxH: 2,
  },
  {
    i:   'MAIN', x: 0, y:  2, w: 2, h: 16, minW: 2, maxW: 2, minH: 12,
  },
  {
    i: 'FOOTER', x:  0, y:  11, w: 2, h:  1, minW: 2, maxW: 2, minH: 1, maxH: 2,
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
