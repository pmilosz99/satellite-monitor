import { FC, useEffect, useMemo } from 'react';
import { useColorMode } from '@chakra-ui/react';

import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile.js';

import { OL_DEFAULT_MAP_PROJECTION } from '../consts';
import { THEME_TYPE } from '../themes';

import 'ol/ol.css';

interface IMapComponent {
  id: string;
  mapRef: React.MutableRefObject<Map | undefined>;
}

export const MapComponent: FC<IMapComponent> = ({ id, mapRef }) => {
  const { colorMode } = useColorMode();

  const osmLayer = useMemo(() => new TileLayer({ source: new OSM() }), []);

  const isDarkTheme = colorMode === THEME_TYPE.DARK;
  console.log('mode', colorMode);
  const handleChangeTheme = () => {
    if (!mapRef.current) return;

    const filter = isDarkTheme ? 'grayscale(100%) invert(85%)' : 'grayscale(0%) invert(0%)'
    console.log('filter', filter);

    osmLayer.on('prerender', (evt) => {
      if (evt.context) {
        const context = evt.context as CanvasRenderingContext2D;
        context.filter = filter;
        context.globalCompositeOperation = 'source-over';
      }
    });

    osmLayer.on('postrender', (evt) => {
      if (evt.context) {
        const context = evt.context as CanvasRenderingContext2D;
        context.filter = 'none';
      }
    })

    mapRef.current.render();
  };

  useEffect(handleChangeTheme, [isDarkTheme, mapRef, osmLayer]);

  useEffect(() => {
    const map = new Map({
      target: id,
      layers: [osmLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: OL_DEFAULT_MAP_PROJECTION
      }),
    });
    mapRef ? mapRef.current = map : null;

    return () => map.setTarget('')
  
  }, [id, mapRef, osmLayer]);

  return (
    <div id={id} style={{ width: '100%' , height: '100%' }} />
  )
};

export default MapComponent;