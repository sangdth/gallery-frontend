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

// Disable ESLint spacing for easier calculations
/* eslint-disable key-spacing */
const tempLayout = [
  {
    i:   'logo', x:  0, y:  0, w:  2, h:  1, minW:  1, maxW:  3, minH:  1, maxH:  2,
  },
  {
    i:   'menu', x:  3, y:  0, w: 10, h:  2,
  },
  {
    i:   'side', x:  0, y:  1, w:  2, h: 10,
  },
  {
    i:   'main', x:  3, y:  1, w:  6, h: 10,
  },
  {
    i: 'footer', x:  0, y:  0, w:  2, h:  1,
  },
];
export const DEFAULT_LAYOUT = {
  layouts: {
    lg: tempLayout,
    md: tempLayout,
    sm: tempLayout,
    xs: tempLayout,
    xxs: tempLayout,
  },
  breakpoints: {
    lg: 900,
    md: 800,
    sm: 768,
    xs: 480,
    xxs: 480,
  },
  cols: {
    lg: 12,
    md: 8,
    sm: 4,
    xs: 2,
    xxs: 1,
  },
};
