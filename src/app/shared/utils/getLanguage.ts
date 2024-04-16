import { LANGUAGE_VALUES } from "../dict-translation";

export const getLanguage = (): LANGUAGE_VALUES => {
    if (!Object.values(LANGUAGE_VALUES).includes(navigator.language as LANGUAGE_VALUES)) {
        return LANGUAGE_VALUES.EN;
    }
    return navigator.language as LANGUAGE_VALUES;
};
