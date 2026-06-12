import type { Group } from './game';

export const ROUTES = {
  HOME: '/',
  PLAY: '/play',
  MODERN_LOVE: '/modern-love',
} as const;

export const APP_DATE = 'December 13, 2025';
export const APP_ISSUE_NUMBER = 'No. 917';
export const APP_BYLINE = 'By Emily Chen';

export const HOME_SUBSCRIBE_LABEL = 'Subscribe';
export const HOME_SUBSCRIPTION_URL = 'https://www.nytimes.com/subscription';

export const MODAL_TITLE = 'Good job! Customize this as you please.';
export const MODAL_BODY = "Add a heartfelt message... C'mon now";
export const MODAL_ACTION_LABEL = "Read today's article";

export const MODERN_LOVE_TITLE = "Tiny Love Stories: 'Your Title Here'";
export const MODERN_LOVE_ARTICLE_TITLE = 'Your Article Here';
export const MODERN_LOVE_ARTICLE_BODY = 'Your article goes here!';
export const MODERN_LOVE_AUTHOR = '— Your Name';
export const MODERN_LOVE_IMAGE_SRC = 'header.png';
export const MODERN_LOVE_IMAGE_ALT = 'header';
export const MODERN_LOVE_IMAGE_CAPTION = 'Caption the picture here hehe';

export const DAY_1: Group[] = [
  {
    category: 'Inside Joke #1',
    items: ['Dogs', 'Cats', 'Birds', 'Fish'],
    difficulty: 1,
  },
  {
    category: 'Another Inside Joke',
    items: ['Pots', 'Pans', 'Kettles', 'Saucepans'],
    difficulty: 2,
  },
  {
    category: 'Yet Another Joke',
    items: ['LOL', 'TTYL', 'BRB', 'AFK'],
    difficulty: 3,
  },
  {
    category: 'Make This Good',
    items: ['Water', 'Coffee', 'Tea', 'Juice'],
    difficulty: 4,
  },
];
