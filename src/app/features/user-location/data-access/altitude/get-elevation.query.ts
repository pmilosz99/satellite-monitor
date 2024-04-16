import { useQuery } from "@tanstack/react-query";

import { ElevationQueryParam, paths } from "./api/elevation.api";
import { queryKey } from "./api/elevation.query-key";

type Elevation = {
    longtitude: number;
    elevation: number;
    latitude: number;
}

interface IElevationResponse {
    results: Elevation[]
}

const getElevation = async (queryParams: ElevationQueryParam[]): Promise<IElevationResponse> => {
    const res = await fetch(paths.ELEVATION(queryParams))
    const data = await res.json();
    return data;
}

export const useElevation = (queryParams: ElevationQueryParam[], isEnabled: boolean) => {
    return useQuery({
        queryKey: queryKey.ELEVATION(queryParams),
        queryFn: () => getElevation(queryParams),
        enabled: isEnabled
    });
}