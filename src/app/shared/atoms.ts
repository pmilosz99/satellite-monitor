import { atom } from "jotai";
import { Coordinate } from "ol/coordinate";
import Map from 'ol/Map';

import { LANGUAGE_VALUES } from "./dict-translation";
import { getLanguage } from "./utils";
import { getThemeFromStrore } from "./utils/getThemeFromStore";
import { THEME_TYPE } from "./themes";
import { UseQueryResult } from "@tanstack/react-query";

export const coordinates = atom<Coordinate | null>(null);

export const language = atom<LANGUAGE_VALUES>(getLanguage());

export const currentTheme = atom<THEME_TYPE>(getThemeFromStrore());

export const tle = atom<UseQueryResult<string> | null>(null);

export const map = atom<Map | null>(null);
