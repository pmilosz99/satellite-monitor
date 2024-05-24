import { useAtomValue } from "jotai"
import { language, map } from "./atoms";
import { dict } from "./dict-translation";

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
