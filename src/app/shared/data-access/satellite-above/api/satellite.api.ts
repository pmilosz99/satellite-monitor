import { API_KEY_N2YO, API_URL_N2YO } from "../../../consts";
import { replacePlaceholders } from "../../../utils/replacePlaceholders";

const satellite = 'satellite';

const satellitesAbove = `${API_URL_N2YO}/${satellite}/above/:observerLat:/:observerLng:/:observerAlt:/:searchRadius:/:categoryId:`;

export type SatellitesQueryParams = {
    observerLat: string;
    observerLng: string;
    observerAlt: string;
    searchRadius: string;
    categoryId: string;
};

export const paths = {
  SATELLITES_ABOVE: (queryParams: SatellitesQueryParams) => `${replacePlaceholders(satellitesAbove, queryParams)}/?apiKey=${API_KEY_N2YO}`,
};