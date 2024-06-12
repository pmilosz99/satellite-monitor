export type TQueryParams = Record<string, string | number>;

export enum SETTINGS_VALUES {
    REFRESH_SAT_MS = 'refreshSatPosMs'
}

export interface ISettingsValuesAtom {
    [SETTINGS_VALUES.REFRESH_SAT_MS]: number;
}