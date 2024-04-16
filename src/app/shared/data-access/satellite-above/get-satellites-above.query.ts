import { useQuery } from "@tanstack/react-query";

import { getHttpClient } from "../../http-client";

import { queryKey } from "./api/get-satellites-above.query-key";
import { SatellitesQueryParams, paths } from "./api/satellite.api";

interface Satellite {
    satId: number;
    satname: string;
    intDesignator: string;
    launchDate: string;
    satlat: number;
    satlng: number;
    satalt: number;
}

interface ResponseInfo {
    category: string;
    transactionscount: number;
    satcount: number;
}

interface ISatellitesResponse {
    info: ResponseInfo;
    above: Satellite[];
}

const getSatellitesAbove = async (queryParams: SatellitesQueryParams): Promise<ISatellitesResponse> => {
    const res = await getHttpClient().get<ISatellitesResponse>(paths.SATELLITES_ABOVE(queryParams));

    return res.data;
}

export const useSatellitesAbove = (queryParams: SatellitesQueryParams) => {
    return useQuery({
        queryKey: queryKey.SATELLITES_ABOVE(queryParams),
        queryFn: () => getSatellitesAbove(queryParams),
    });
}