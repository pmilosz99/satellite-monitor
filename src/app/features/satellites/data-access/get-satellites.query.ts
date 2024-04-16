import { useQuery } from "@tanstack/react-query";

import { getHttpClient } from "../../../shared/http-client";

import { SatellitesQueryParams, paths } from "./api/satellites.api";
import { queryKey } from "./api/satellites.query-key";

interface ISatellitesResponse {
    OBJECT_NAME: string;
    OBJECT_ID: string;
    EPOCH: string;
    MEAN_MOTION: number;
    ECCENTRICITY: number;
    INCLINATION: number;
    RA_OF_ASC_NODE: number;
    ARG_OF_PERICENTER: number;
    MEAN_ANOMALY: number;
    EPHEMERIS_TYPE: number;
    CLASSIFICATION_TYPE: string;
    NORAD_CAT_ID: number;
    ELEMENT_SET_NO: number;
    REV_AT_EPOCH: number;
    BSTAR: number;
    MEAN_MOTION_DOT: number;
    MEAN_MOTION_DDOT: number;
}

const getSatellites = async (queryParams: SatellitesQueryParams): Promise<ISatellitesResponse[]> => {
    const res = await getHttpClient().get<ISatellitesResponse[]>(paths.SATELLITES(queryParams));

    return res.data;
};

export const useSatellites = (queryParams: SatellitesQueryParams) => {
    return useQuery({
        queryKey: queryKey.SATELLITES_ABOVE(queryParams),
        queryFn: () => getSatellites(queryParams),
    });
};
