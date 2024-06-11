import { transform } from "ol/proj";
import { getSatellitePosition } from "../utils";
import { OL_DEFAULT_MAP_PROJECTION } from "../consts";

self.onmessage = (event) => {
    const tleJSON = event.data;

    if (!tleJSON) return;

    const result = [];

    for (let i=0; i<tleJSON.length; i++) {
        const position = getSatellitePosition(new Date(), tleJSON[i].line1, tleJSON[i].line2 );

        if (!position) continue;

        const transformCoords = transform([position.longtitude, position.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        result.push({noradId: tleJSON[i].noradId, coords: transformCoords});
    }

    postMessage(result);
};
