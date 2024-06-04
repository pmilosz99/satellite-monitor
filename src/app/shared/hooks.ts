import { useAtomValue } from "jotai"
import { language, map, tle } from "./atoms";
import { dict } from "./dict-translation";
import { getJsonTle } from "./utils/getJsonTle";

export const useMap = () => {
    const mapInstance = useAtomValue(map);

    return mapInstance;
};

export const useTranslation = (key: string | string[]): string | string[] => {
    const lng = useAtomValue(language);

    if (typeof key === 'string') {
        return dict[lng][key];
    }

    return key.map((key) => dict[lng][key]);
};

export const useTle = () => {
    const tleData = useAtomValue(tle);

    if (!tleData) return;

    return {
        data: tleData.data,
        isLoading: tleData.isLoading,
    };
}

export const useJsonTle = () => {
    const tleData = useAtomValue(tle);

    if (!tleData) return;

    const result = getJsonTle(tleData.data || '')

    return {
        data: result,
        isLoading: tleData.isLoading
    }
}