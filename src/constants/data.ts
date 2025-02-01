import { NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Game Performance',
    url: '/dashboard/game-performance',
    icon: 'performance',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Referral Program',
    url: '/dashboard/referral-program',
    icon: 'referral',
    shortcut: ['r', 'r'],
    isActive: false,
    items: []
  },
  // {
  //   title: 'Social Stats',
  //   url: '/dashboard/social',
  //   icon: 'social',
  //   shortcut: ['s', 's'],
  //   isActive: false,
  //   items: []
  // },
  {
    title: 'Player Segmentation',
    url: '/dashboard/player-segmentation',
    icon: 'product',
    shortcut: ['ps', 'ps'],
    isActive: false,
    items: []
  },
  {
    title: 'Volume',
    url: '/dashboard/volume',
    icon: 'volume',
    shortcut: ['v', 'v'],
    isActive: false,
    items: []
  },
  {
    title: 'Player Dashboard',
    url: '/dashboard/player-dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  }
  // {
  //   title: 'Revenue',
  //   url: '/dashboard/revenue',
  //   icon: 'revenue',
  //   shortcut: ['r', 'r'],
  //   isActive: false,
  //   items: []
  // }
];
