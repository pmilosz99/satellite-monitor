import { useQuery } from "@tanstack/react-query";

import { getHttpClient } from "../../../shared/http-client";

import { SatellitesQueryParams, paths } from "./api/satellites.api";
import { queryKey } from "./api/satellites.query-key";

const getSatellitesTle = async (queryParams: SatellitesQueryParams): Promise<string> => {
    const res = await getHttpClient().get<string>(`${paths.SATELLITES(queryParams)}&FORMAT=TLE`);

    return res.data;
};

export const useSatellitesTle = (queryParams: SatellitesQueryParams) => {
    return useQuery({
        queryKey: queryKey.SATELLITES(queryParams),
        queryFn: () => getSatellitesTle(queryParams),
    });
};