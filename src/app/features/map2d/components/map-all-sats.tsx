import { FC, useCallback, useEffect, useRef } from "react";
import { useDeepCompareEffect } from 'react-use';
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import Map from 'ol/Map';
import VectorSource from "ol/source/Vector";
import { LineString, Point } from "ol/geom";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import Feature, { FeatureLike } from "ol/Feature";
import MapBrowserEvent from "ol/MapBrowserEvent";
import { Vector } from "ol/layer";
import { Coordinate } from "ol/coordinate";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";

import { MapComponent } from "../../../shared/components";
import { OLMAP_ID } from "../../../shared/consts";
import { removeLayerById } from "../../../shared/utils";
import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import { useTle } from "../../../shared/hooks";

import { settingsValues } from "../../../shared/atoms";
import { SETTINGS_VALUES } from "../../../shared/types";

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
      "#00bfff",
      "#ff3f3f"
    ],
}

const SATELLITES_LAYER_NAME = 'all-satellites-points-layer';
const ORBIT_SAT_LAYER = 'all-satellites-orbit-layer';

export interface ISatelliteData {
    name: string;
    noradId: number;
    line1: string;
    line2: string;
}

interface IMapAllSats {
    satellites: ISatelliteData[] | undefined;
    setNoradId: (id: string) => void;
    setOpenDrawer: () => void;
    setCloseDrawer: () => void;
    isDrawerOpen: boolean;
}

type tleFromWebWorker = {
    noradId: string;
    coords: Coordinate;
}

export const MapAllSats: FC<IMapAllSats> = ({ satellites, setNoradId, isDrawerOpen, setOpenDrawer, setCloseDrawer }) => {
    const mapRef = useRef<Map>();
    const sourceRef = useRef<VectorSource>();

    const tle = useTle();

    const workerGetSatPosition = useRef<Worker>();
    const workerCreateOrbitLanes = useRef<Worker>();
    const workerGetInitSatPosition = useRef<Worker>();

    const noradIdRef = useRef<string>();
    const selectedFeature = useRef<Feature<Point> | null>(null);

    const interval = useRef<NodeJS.Timeout>();

    const isMobile = window.innerWidth <= 768;

    const { [SETTINGS_VALUES.REFRESH_SAT_MS]: REFRESH_SAT_POSITION_MS } = useAtomValue(settingsValues);

    useDeepCompareEffect(() => {
        setTimeout(() => {
            if (!workerGetInitSatPosition.current || !satellites || !mapRef.current || noradIdRef.current ) return; // arg: noradIdRef.current => we bloking refresh layer after click on sat
            const map = mapRef.current;
    
            workerGetInitSatPosition.current.postMessage(satellites);
    
            workerGetInitSatPosition.current.onmessage = (event) => {
                const newTleJSON = event.data;
    
                const featuresPoints = newTleJSON.map((tle: tleFromWebWorker) => {
                    const feature = new Feature({
                        id: tle.noradId,
                        geometry: new Point(tle.coords)
                    });
                    feature.setId(tle.noradId);
    
                    return feature;
                });
    
                sourceRef.current = new VectorSource({ features: featuresPoints, wrapX: false });
    
                const pointsLayer = new WebGLPointsLayer({
                    [OLMAP_ID]: SATELLITES_LAYER_NAME,
                    source: sourceRef.current,
                    style: style
                  });
        
                  removeLayerById(map, SATELLITES_LAYER_NAME);
                  map.addLayer(pointsLayer);
            }
        })
    }, [satellites, workerGetInitSatPosition])

    const drawOrbitLayer = (noradId: string): void => {
        if (!workerCreateOrbitLanes.current || !tle?.data || !mapRef.current) return;

        const map = mapRef.current;

        const singleTle = getSatelliteTle(tle.data, noradId);

        if (!singleTle) return;

        const sat = new Satellite({ tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2 });

        workerCreateOrbitLanes.current.postMessage({period: sat.period, firstLine: singleTle[1], secondLine: singleTle[2]});

        workerCreateOrbitLanes.current.onmessage = (event) => {
            const lines = event.data;

            removeLayerById(map, ORBIT_SAT_LAYER);

            if (!lines) return;

            const linesFeatures = lines.map((line: Coordinate) => (
                new Feature({
                    geometry: new LineString(line)
                })
            ));

            const vectorSource = new VectorSource({
                features: linesFeatures,
                wrapX: false,
            });

            const vectorLayer = new Vector({
                [OLMAP_ID]: ORBIT_SAT_LAYER,
                source: vectorSource,
            });

            map.getLayers().insertAt(1, vectorLayer);
        }
    };

    const handleDrawerOpen = (): void => {
    if (!mapRef.current || !noradIdRef.current) return;

        if (isDrawerOpen) drawOrbitLayer(noradIdRef.current || '');
        if (!isDrawerOpen) {
            noradIdRef.current = undefined;
            removeLayerById(mapRef.current, ORBIT_SAT_LAYER);
        }
    }

    const updateSourceLayer = useCallback((): void => {
        if (!satellites || !workerGetSatPosition.current) return;

        workerGetSatPosition.current.postMessage(satellites);

        workerGetSatPosition.current.onmessage = (event) => {
            const newTleJSON = event.data;
            const totalLength = newTleJSON.length; // Approximately 10k
            const step = Math.ceil(totalLength / 10);

            // Instead of multiple setTimeouts we use requestAnimationFrame for better performance
            const updateFeatures = (start: number) => {
                const end = Math.min(start + step, totalLength);

                for (let i = start; i < end; i++) {
                    if (!sourceRef.current) return;

                    const feature = sourceRef.current.getFeatureById(newTleJSON[i].noradId);

                    if (feature) {
                        const geomPoint = feature.getGeometry() as Point;
                        if (geomPoint) {
                            geomPoint.setCoordinates(newTleJSON[i].coords);
                        }
                    }
                }
                if (end < totalLength) {
                    requestAnimationFrame(() => updateFeatures(end));
                }
            };
            requestAnimationFrame(() => updateFeatures(0));
        };
        
    }, [satellites, workerGetSatPosition]);

    const hoverChangeStyle = (event: MapBrowserEvent<UIEvent>) => {
        if (!mapRef.current) return;

        let found = null as FeatureLike | null;

        const map = mapRef.current;

        map.forEachFeatureAtPixel(event.pixel, (feature) => {
            found = feature;
            return true;
        });

        if (selectedFeature.current && found !== selectedFeature.current) {
            selectedFeature.current.set('hover', 0);
            selectedFeature.current = null;
        }

        if (!found) {
            return;
        }

        noradIdRef.current = found.get('id');
        selectedFeature.current = found as Feature<Point>;
        selectedFeature.current.set('hover', 1);
    };

    const onClickFeature = useCallback((event: MapBrowserEvent<UIEvent>) => {
        if (!mapRef.current) return;

        let found = null as FeatureLike | null;

        const map = mapRef.current;

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
    }, [setCloseDrawer, setNoradId, setOpenDrawer]);

    const addListenerToMap = useCallback((): (() => void) | undefined => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        map.on('pointermove', hoverChangeStyle);
        map.on('singleclick', onClickFeature);
    }, [onClickFeature]);

    const removeListenersFromMap = useCallback(() => {
        if (!mapRef.current) return;

        mapRef.current.un('pointermove', hoverChangeStyle)
        mapRef.current.un('singleclick', onClickFeature);
    }, [onClickFeature]);

    const initWebWorkers = (): void => {
        workerGetInitSatPosition.current = new Worker(new URL('../../../shared/worker/get-sat-position.ts', import.meta.url), { type: "module" });
        workerGetSatPosition.current = new Worker(new URL('../../../shared/worker/get-sat-position.ts', import.meta.url), { type: "module" });
        workerCreateOrbitLanes.current = new Worker(new URL('../../../shared/worker/create-orbit-lanes.ts', import.meta.url), { type: "module" });
    };

    const terminateWebWorkers = (): void => {
        workerGetInitSatPosition.current?.terminate();
        workerGetSatPosition.current?.terminate();
        workerCreateOrbitLanes.current?.terminate();
    };

    const initIntervalUpdateSourceLayer = useCallback((): void => {
        interval.current = setInterval(() => {
            updateSourceLayer();
        }, REFRESH_SAT_POSITION_MS);
    }, [updateSourceLayer, REFRESH_SAT_POSITION_MS]);

    const removeIntervalUpdateSourceLayer = () => clearInterval(interval.current);

//============================================= useEffects below ========================================================

    useEffect(() => {
        initWebWorkers();

        return terminateWebWorkers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceRef.current]);

    useEffect(() => {
        setTimeout(addListenerToMap);

        return removeListenersFromMap;

    }, [addListenerToMap, removeListenersFromMap, satellites]);

    useEffect(() => {
        initIntervalUpdateSourceLayer();

        return () => removeIntervalUpdateSourceLayer();
    }, [initIntervalUpdateSourceLayer]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(handleDrawerOpen, [isDrawerOpen, noradIdRef.current, drawOrbitLayer]);

    useEffect(() => {
        const onVisibilityChange = (): void => {
            document.hidden ? removeIntervalUpdateSourceLayer() : initIntervalUpdateSourceLayer();
        }

        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
        }
    }, [initIntervalUpdateSourceLayer])

//============================================= useEffects above ========================================================

    if (tle?.isLoading) return (
        <Flex alignItems='center' direction='column' h="100%" justifyContent="center">
            <Spinner size='xl' data-testid="map2d-loading-spinner"/>
        </Flex>
    )

    return (
        <Box h={isMobile ? '80%' : '94%'} borderWidth="1px">
            <MapComponent id="map-2d-all-sat" mapRef={mapRef} data-testid="map-2d-all-sats"/>
        </Box>
    );
}

export default MapAllSats;