import OLMap from 'ol/Map';
import { OLMAP_ID } from '../consts';

export const removeLayerById = (map: OLMap, id: string) => {
    map.getLayers().forEach((layer) => {
        if (layer?.get(OLMAP_ID) === id) {
            map.removeLayer(layer);
        }
    });
};
