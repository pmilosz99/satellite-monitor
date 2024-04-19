import { CHAKRA_THEME_STORE_KEY, THEME_TYPE } from "../themes";

export const getThemeFromStrore = () => {
    const value = localStorage.getItem(CHAKRA_THEME_STORE_KEY);

    if (!value) return THEME_TYPE.DARK;

    return value as THEME_TYPE;
}