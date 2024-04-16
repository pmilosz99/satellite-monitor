import { API_URL_CELESTRACK } from "../../../../shared/consts";
import { getPath } from "../../../../shared/utils/getPath";

const currentGP = 'elements/gp.php';
const satellites = `${API_URL_CELESTRACK}/${currentGP}`;

export type SatellitesQueryParams = {
    CATNR?: number;
    INTDES?: string;
    GROUP?: string;
    NAME?: string;
    SPECIAL?: string;
}

export const paths = {
    SATELLITES: (queryParam: SatellitesQueryParams) => `${getPath(satellites, queryParam)}&FORMAT=json`,
}