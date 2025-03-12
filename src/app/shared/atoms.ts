import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
import { Coordinate } from "ol/coordinate";
import Map from 'ol/Map';

import { LANGUAGE_VALUES } from "./dict-translation";
import { getLanguage } from "./utils";
import { getThemeFromStrore } from "./utils/getThemeFromStore";
import { THEME_TYPE } from "./themes";
import { UseQueryResult } from "@tanstack/react-query";
import { ISettingsValuesAtom, SETTINGS_VALUES } from "./types";

export const coordinates = atom<Coordinate | null>(null);
export const userHeight = atom<number | null>(null);

export const language = atom<LANGUAGE_VALUES>(getLanguage());

export const currentTheme = atom<THEME_TYPE>(getThemeFromStrore());

export const tle = atom<UseQueryResult<string> | null>(null);

export const map = atom<Map | null>(null);

export const settingsValues = atomWithStorage<ISettingsValuesAtom>('settingsValues', {
    [SETTINGS_VALUES.REFRESH_SAT_MS]: 1500,
}, undefined, { getOnInit: true } );

export const isDrawOrbitLayerLoading = atom<boolean>(false);