import { atom } from 'jotai'
import { Coordinate } from 'ol/coordinate';

import { getLanguage } from './utils';
import { LANGUAGE_VALUES } from './dict-translation';

export const coordinates = atom<Coordinate | null>(null);

export const language = atom<LANGUAGE_VALUES>(getLanguage());