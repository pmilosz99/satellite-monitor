import { API_URL_OPEN_ELEVATION } from "../../../../../shared/consts";

const elevation = `${API_URL_OPEN_ELEVATION}/lookup`;

export type ElevationQueryParam = {
    latitude: number;
    longtitude: number;
};

const getPath = (url: string, queryParams: ElevationQueryParam[]): string => {
    const positions = queryParams.map((position) => [position.latitude, position.longtitude].join(',')).join('|');
    console.log(positions);

    return `${url}?locations=${positions}`;
};

export const paths = {
  ELEVATION: (queryParams: ElevationQueryParam[]) => getPath(elevation, queryParams),
};