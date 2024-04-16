import { TQueryParams } from "../../../types";

enum QUERY_KEY {
    SATELLITES = 'satellites',
}

export const queryKey = {
    SATELLITES_ABOVE: (queryParams?: TQueryParams) => queryParams ? [QUERY_KEY.SATELLITES, queryParams] : [QUERY_KEY.SATELLITES],
}