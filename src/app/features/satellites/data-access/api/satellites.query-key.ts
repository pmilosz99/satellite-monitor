import { SatellitesQueryParams } from "./satellites.api";

enum QUERY_KEY {
    SATELLITES = 'satellites',
}

export const queryKey = {
    SATELLITES: (queryParams?: SatellitesQueryParams) => queryParams ? [QUERY_KEY.SATELLITES, queryParams] : [QUERY_KEY.SATELLITES],
}