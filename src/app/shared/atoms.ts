import { atom } from 'jotai'
import { Coordinate } from 'ol/coordinate';

import { LANGUAGE_VALUES } from './dict-translation';
import { THEME_TYPE } from './themes';
import { getLanguage } from './utils';
import { getThemeFromStrore } from './utils/getThemeFromStore';

export const coordinates = atom<Coordinate | null>(null);

export const language = atom<LANGUAGE_VALUES>(getLanguage());

export const currentTheme = atom<THEME_TYPE>(getThemeFromStrore());