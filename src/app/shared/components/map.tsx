import { FC, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile.js';
import { OL_DEFAULT_MAP_PROJECTION } from '../consts';

interface IMapComponent {
  id: string;
  mapRef: React.MutableRefObject<Map | undefined>;
}

export const MapComponent: FC<IMapComponent> = ({ id, mapRef }) => {
  useEffect(() => {
    const map = new Map({
      target: id,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: OL_DEFAULT_MAP_PROJECTION
      }),
    });
    mapRef ? mapRef.current = map : null;

    return () => map.setTarget('')
  
  }, [id, mapRef]);

  return (
    <div id={id} style={{ width: '100%' , height: '100%' }} />
  )
};

export default MapComponent;