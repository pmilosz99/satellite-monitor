import { useAtomValue } from "jotai"
import { coordinates, language, map, tle, userHeight } from "./atoms";
import { dict } from "./dict-translation";
import { getJsonTle } from "./utils/getJsonTle";
import { IUserLocation } from "../features/user-location/types/user-location";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";
import { getSatelliteTle } from "./utils/getSatelliteTle";

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

export const useUserLocation = (): IUserLocation | undefined => {
    const coords = useAtomValue(coordinates);
    const height = useAtomValue(userHeight);

    if (!coords) return;

    return {
        coordinates: coords,
        height: height || 0,
    };
}

export const useSatObject = (noradId: string) => {
    const tleData = useAtomValue(tle);

    if (!tleData?.data) return;

    const singleTle = getSatelliteTle(tleData.data, noradId);

    return new Satellite({ name: singleTle[0], tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2 });
}