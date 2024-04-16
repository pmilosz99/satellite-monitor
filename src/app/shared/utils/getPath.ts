import { TQueryParams } from "../types";

const getPathWithQueryParams = (path: string, queryParams: TQueryParams) => {
    const queryString = Object.entries(queryParams).map(([searchParam, value]) => `${searchParam}=${value}`).join('&');

    return `${path}?${queryString}`;
};

export const getPath = (path: string, queryParams?: TQueryParams): string => {
    if (queryParams) {
        return getPathWithQueryParams(path, queryParams);
    }

    return path;
};
