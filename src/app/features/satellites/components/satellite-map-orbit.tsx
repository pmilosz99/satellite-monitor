import { FC, useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { Box } from "@chakra-ui/react";
import Map from 'ol/Map';
import Feature from "ol/Feature";
import RenderEvent from "ol/render/Event";
import VectorSource from "ol/source/Vector";
import { Types } from "ol/MapBrowserEventType";
import { Vector } from "ol/layer";
import { transform } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { LineString, Point } from "ol/geom";
import { getVectorContext } from "ol/render";
import { 
    Circle, 
    Fill, 
    Stroke, 
    Style 
} from "ol/style";

import { 
    twoline2satrec, 
    eciToGeodetic, 
    propagate, 
    gstime, 
    degreesLong, 
    degreesLat, 
    EciVec3
} from 'satellite.js';

import { MapComponent } from "../../../shared/components";
import { OLMAP_ID, OL_DEFAULT_MAP_PROJECTION } from "../../../shared/consts";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";
import { removeLayerById } from "../../../shared/utils";
import { ISatellitePosition } from "../types";
import { isDrawOrbitLayerLoading } from "../../../shared/atoms";

interface ISatelliteMapOrbit {
    tle: string[];
    onSatPositionChange: (data: ISatellitePosition) => void;
    numberOfOrbits?: number;
    isTrackSat?: boolean;
    setTrackSatOff?: () => void;
}

const satelliteStyle = new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({color: '#ff0000'}),
      stroke: new Stroke({
        color: '#ffffff',
        width: 2,
      }),
    }),
});

const SATELLITE_LAYER_NAME = 'satellite-point-layer';
const ORBIT_LAYER_NAME = 'orbit-line-layer';

export const SatelliteMapOrbit: FC<ISatelliteMapOrbit> = ({ 
    tle, 
    onSatPositionChange, 
    setTrackSatOff, 
    numberOfOrbits = 1, 
    isTrackSat = false, 
}) => {
    const mapRef = useRef<Map>();
    const positionRef = useRef<ISatellitePosition>();
    const workerCreateOrbitLanes = useRef<Worker>();

    const firstLineTle = tle[1];
    const secondLineTle = tle[2];
    const sat = new Satellite({ tle1: firstLineTle as TleLine1, tle2: secondLineTle as TleLine2 });

    const setIsLoading = useSetAtom(isDrawOrbitLayerLoading);

    const getSatellitePosition = (time: Date): ISatellitePosition => {
        const satrec = twoline2satrec(firstLineTle, secondLineTle);

        const positionAndVelocity = propagate(satrec, time);
        const positionEci = positionAndVelocity.position as EciVec3<number>;
        
        const gmst = gstime(time);
        const positionGd = eciToGeodetic(positionEci, gmst);

        const longtitude = degreesLong(positionGd.longitude);
        const latitude = degreesLat(positionGd.latitude);
        const height = positionGd.height;

        return { longtitude, latitude, height };
    };

    const drawOrbitLayer = (): void => {
        if (!mapRef.current || !tle || !workerCreateOrbitLanes.current) return;

        const map = mapRef.current;

        setIsLoading(true);
        workerCreateOrbitLanes.current.postMessage({period: sat.period, firstLine: firstLineTle, secondLine: secondLineTle, numberOfOrbits })

        workerCreateOrbitLanes.current.onmessage = (event: MessageEvent<Coordinate[]>) => {
            const lines = event.data;

            removeLayerById(map, ORBIT_LAYER_NAME);

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
                [OLMAP_ID]: ORBIT_LAYER_NAME,
                source: vectorSource,
            });

            map.getLayers().insertAt(1, vectorLayer);
            setIsLoading(false);
        }
    };

    const drawSatelliteLayer = (): (() => void) | undefined => {
        if (!mapRef.current || !tle) return;

        removeLayerById(mapRef.current, SATELLITE_LAYER_NAME);

        const vectorLayer = new Vector({
            [OLMAP_ID]: SATELLITE_LAYER_NAME,
            source: new VectorSource({
                features: undefined,
            })
        });

        mapRef.current.addLayer(vectorLayer);

        vectorLayer.on('postrender', updateSatellitePosition);

        return () => vectorLayer.un('postrender', updateSatellitePosition);
    };

    const unRegisterListener = (listener: Types, fn: () => void) => {
        if (!mapRef.current) return;

        return mapRef.current.un(listener, fn)
    };

    const disabledTracker = () => {
        if (!mapRef.current || !setTrackSatOff) return;

        const trackerOff = () => {
            setTrackSatOff();
        };

        mapRef.current.on('pointerdrag', trackerOff);

        return () => unRegisterListener('pointerdrag', trackerOff);
    };

    const trackIn = (coord: Coordinate) => {
        if (!mapRef.current) return;

        mapRef.current.getView().animate({center: coord, duration: 0})
    };

    const zoomIn = () => {
        if (!mapRef.current || !positionRef.current) return;

        const transformCoords = transform([positionRef.current.longtitude, positionRef.current.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        isTrackSat ? mapRef.current.getView().animate({center: transformCoords, zoom: 9}) : null;
    };

    const updateSatellitePosition = (event: RenderEvent): void => {
        if (!mapRef.current || !tle) return;

        const position = getSatellitePosition(new Date());
        const transformCoords = transform([position.longtitude, position.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        positionRef.current = position;

        const point = new Point(transformCoords);
        
        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(satelliteStyle);
        vectorContext.drawGeometry(point);

        isTrackSat ? trackIn(transformCoords) : null;

        /**
         * We render geometry by vector context and hide geoMarker and trigger map render through 
         * change event (we get smooth animations when moving the map)
         * solution: https://openlayers.org/en/latest/examples/feature-move-animation.html 
         */
        mapRef.current.render(); //We force the map rendering to be looped through the render function and postrender listener
    };

    const updatePositionState = (): (() => void) => {
        const interval = setInterval(() => {
            onSatPositionChange(positionRef.current as ISatellitePosition);
        }, 1000);

        return () => clearInterval(interval);
    };

    const handleWebWorker = () => {
        workerCreateOrbitLanes.current = new Worker(new URL('../../../shared/worker/create-orbit-lanes.ts', import.meta.url), { type: "module" });

        return () => workerCreateOrbitLanes.current?.terminate();
    };

    useEffect(handleWebWorker, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(drawOrbitLayer, [tle, numberOfOrbits]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(drawSatelliteLayer, [tle, isTrackSat]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updatePositionState, [tle]);
    useEffect(zoomIn, [isTrackSat]);
    useEffect(disabledTracker, [setTrackSatOff]);

    return (
        <Box h="100%" w="100%" borderWidth="1px">
            <MapComponent id="map-satellite-details-orbit" mapRef={mapRef} />
        </Box>
    );
};
