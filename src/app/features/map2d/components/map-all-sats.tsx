import { FC, useCallback, useEffect, useRef } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Map from 'ol/Map';
import VectorSource from "ol/source/Vector";
import { LineString, Point } from "ol/geom";
import { transform } from "ol/proj";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import Feature, { FeatureLike } from "ol/Feature";
import MapBrowserEvent from "ol/MapBrowserEvent";
import { Vector } from "ol/layer";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";

import { MapComponent } from "../../../shared/components";
import { OLMAP_ID, OL_DEFAULT_MAP_PROJECTION } from "../../../shared/consts";
import { createOrbitLanes, getSatellitePosition, removeLayerById } from "../../../shared/utils";
import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import { useJsonTle, useTle } from "../../../shared/hooks";

const style = {
    "circle-radius": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      5,
      1.5,
      15,
      1536
    ],
    "circle-fill-color": [
      "match",
      ["get","hover"],
      1,
      "#ff3f3f",
      "#006688"
    ],
}
const SATELLITES_LAYER_NAME = 'all-satellites-points-layer';
const ORBIT_SAT_LAYER = 'all-satellites-orbit-layer';

interface IMapAllSats {
    setNoradId: (id: string) => void;
    setOpenDrawer: () => void;
    setCloseDrawer: () => void;
    isDrawerOpen: boolean;
}

export const MapAllSats: FC<IMapAllSats> = ({ setNoradId, isDrawerOpen, setOpenDrawer, setCloseDrawer }) => {
    const mapRef = useRef<Map>();
    const noradIdRef = useRef<string>();
    const sourceRef = useRef<VectorSource>();

    const tle = useTle();
    const tleJSON = useJsonTle();

    const drawSatellitesLayer = useCallback((): void => {
        if (!mapRef.current || !tleJSON) return;

        const map = mapRef.current;

        removeLayerById(map, SATELLITES_LAYER_NAME);

        const featuresPoints = tleJSON.data.map((satellite) => {
            const position = getSatellitePosition(new Date(), satellite.line1, satellite.line2 );

            const transformCoords = transform([position.longtitude, position.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

            const feature = new Feature({
                id: satellite.noradId,
                geometry: new Point(transformCoords)
            });
            feature.setId(satellite.noradId);

            return feature;
        });

        sourceRef.current = new VectorSource({ features: featuresPoints });

        const pointsLayer = new WebGLPointsLayer({
            [OLMAP_ID]: SATELLITES_LAYER_NAME,
            source: sourceRef.current,
            style: style
          });

          map.addLayer(pointsLayer);
    }, [tleJSON]);

    const drawOrbitLayer = (noradId: string): void => {
        if (!mapRef.current || !tle?.data) return;

        const singleTle = getSatelliteTle(tle.data, noradId);

        if (!singleTle) return;

        const sat = new Satellite({ tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2 });

        const lines = createOrbitLanes(sat.period, singleTle[1], singleTle[2]);

        removeLayerById(mapRef.current, ORBIT_SAT_LAYER);

        if (!lines) return;

        const linesFeatures = lines.map((line) => (
            new Feature({
                geometry: new LineString(line)
            })
        ))

        const vectorSource = new VectorSource({
            features: linesFeatures,
            wrapX: false,
        });

        const vectorLayer = new Vector({
            [OLMAP_ID]: ORBIT_SAT_LAYER,
            source: vectorSource,
        });

        mapRef.current.getLayers().insertAt(1, vectorLayer);
    };

    const handleDrawerOpen = (): void => {
    if (!mapRef.current) return;

        if (isDrawerOpen) drawOrbitLayer(noradIdRef.current || '');

        if (!isDrawerOpen) removeLayerById(mapRef.current, ORBIT_SAT_LAYER);
    }

    const updateSourceLayer = useCallback((): void => {
        if (!tleJSON || !sourceRef.current) return;

        for (let i=0; i<tleJSON.data.length; i++) {
            const position = getSatellitePosition(new Date(), tleJSON.data[i].line1, tleJSON.data[i].line2 );

            if (!position) continue;

            const transformCoords = transform([position.longtitude, position.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

            const feature = sourceRef.current?.getFeatureById(tleJSON.data[i].noradId);
            const geomPoint = feature?.getGeometry() as Point;
            geomPoint.setCoordinates(transformCoords);
        }
    }, [tleJSON])

    const addListenerToMap = useCallback((): (() => void) | undefined => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        let selected: Feature<Point> | null = null;

        const hoverChangeStyle = (event: MapBrowserEvent<UIEvent>) => {
            let found = null as FeatureLike | null;

            map.forEachFeatureAtPixel(event.pixel, (feature) => {
                found = feature;
                return true;
            });

            if (selected && found !== selected) {
                selected.set('hover', 0);
                selected = null;
            }

            if (!found) {
                return;
            }

            noradIdRef.current = found.get('id');
            selected = found as Feature<Point>;
            selected.set('hover', 1);
        };

        const onClickFeature = (event: MapBrowserEvent<UIEvent>) => {
            let found = null as FeatureLike | null;

            map.forEachFeatureAtPixel(event.pixel,(feature) => {
                found = feature;
                return true;
            });
            
            if (!found) {
                setCloseDrawer();
                removeLayerById(map, ORBIT_SAT_LAYER);
                return;
            } 

            setNoradId(found.get('id'));
            setOpenDrawer();
        }

        map.on('pointermove', hoverChangeStyle);
        map.on('singleclick', onClickFeature);

        return () => {
            map.un('pointermove', hoverChangeStyle)
            map.un('singleclick', onClickFeature);
        }
    }, [setCloseDrawer, setNoradId, setOpenDrawer])

    const intervalUpdateSourceLayer = (): (() => void) => {
        const interval = setInterval(() => {
            if (!mapRef.current) return;
            updateSourceLayer();
        }, 2000);

        return () => clearInterval(interval);
    }

    useEffect(() => {
        setTimeout(drawSatellitesLayer);
    }, [drawSatellitesLayer]);

    useEffect(() => {
        setTimeout(addListenerToMap);
    }, [addListenerToMap, tleJSON]);

    useEffect(intervalUpdateSourceLayer, [updateSourceLayer]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(handleDrawerOpen, [isDrawerOpen, noradIdRef.current, drawOrbitLayer]);

    if (tle?.isLoading) return (
        <Flex alignItems='center' direction='column' h="100%" justifyContent="center">
            <Spinner size='xl' />
        </Flex>
    )

    return (
        <Box h="100%" borderWidth="1px">
            <MapComponent id="map-2d-all-sat" mapRef={mapRef} />
        </Box>
    );
}

export default MapAllSats;