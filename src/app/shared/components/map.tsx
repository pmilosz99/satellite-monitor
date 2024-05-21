import { FC, useEffect, useMemo } from 'react';
import { useColorMode } from '@chakra-ui/react';

import { useSetAtom } from 'jotai';
import { map } from '../atoms';

import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile.js';
import { get } from 'ol/proj';

import { OL_DEFAULT_MAP_PROJECTION } from '../consts';
import { THEME_TYPE } from '../themes';

import 'ol/ol.css';

interface IMapComponent {
  id: string;
  mapRef: React.MutableRefObject<Map | undefined>;
}

export const MapComponent: FC<IMapComponent> = ({ id, mapRef }) => {
  const { colorMode } = useColorMode();
  const setGlobalMapState = useSetAtom(map);

  const osmLayer = useMemo(() => new TileLayer({ source: new OSM({ wrapX: false }) }), []);

  const isDarkTheme = colorMode === THEME_TYPE.DARK;

  const handleChangeTheme = () => {
    if (!mapRef.current) return;

    const filter = isDarkTheme ? 'grayscale(100%) invert(85%)' : 'grayscale(0%) invert(0%)'

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

  useEffect(() => {
    if (!mapRef) return;

    const map = new Map({
      target: id,
      layers: [osmLayer],
      view: new View({
        extent: get(OL_DEFAULT_MAP_PROJECTION)?.getExtent(),
        center: [0, 0],
        zoom: 0,
        projection: OL_DEFAULT_MAP_PROJECTION,
        
      }),
    });

    mapRef.current = map;
    setGlobalMapState(map);

    return () => map.setTarget('')
  
  }, [id, mapRef, osmLayer, setGlobalMapState]);

  useEffect(handleChangeTheme, [mapRef, isDarkTheme, osmLayer]);

  return (
    <div id={id} style={{ width: '100%' , height: '100%' }} />
  )
};

export default MapComponent;