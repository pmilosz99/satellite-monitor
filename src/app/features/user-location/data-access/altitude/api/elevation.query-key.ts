import { ElevationQueryParam } from "./elevation.api";

enum QUERY_KEY {
    ELEVATION = 'elevation',
}

export const queryKey = {
    ELEVATION: (queryParams?: ElevationQueryParam[]) => queryParams ? [QUERY_KEY.ELEVATION, queryParams] : [QUERY_KEY.ELEVATION],
}