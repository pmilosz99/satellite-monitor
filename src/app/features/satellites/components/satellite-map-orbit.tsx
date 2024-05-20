import { FC, useEffect, useRef } from "react";
import Map from 'ol/Map';
import Feature from "ol/Feature";
import RenderEvent from "ol/render/Event";
import VectorSource from "ol/source/Vector";
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

interface IPosition {
    longtitude: number;
    latitude: number;
    height: number;
}

interface ISatelliteMapOrbit {
    tle: string[];
    onSatPositionChange: (data: IPosition) => void;
    numberOfOrbits?: number;
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

export const SatelliteMapOrbit: FC<ISatelliteMapOrbit> = ({ tle, onSatPositionChange, numberOfOrbits = 1 }) => {
    const mapRef = useRef<Map>();
    const positionRef = useRef<IPosition>();

    const firstLineTle = tle[1];
    const secondLineTle = tle[2];
    const sat = new Satellite({ tle1: firstLineTle as TleLine1, tle2: secondLineTle as TleLine2 });
    
    const SAT_PERIOD_SECONDS = sat.period * 60;

    const getSatellitePosition = (time: Date): IPosition => {
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

    const createLines = (): Coordinate[][] => { //TODO: add calculation to Web Workers
        const arrCoords = [];
        const lines = [];
        let currentTime = new Date();
        let startNewLineIndex = 0;

        for(let i=0; i < numberOfOrbits * SAT_PERIOD_SECONDS; i++) {
            const { longtitude, latitude } = getSatellitePosition(currentTime);//create points (sat position)
            const transformCoords = transform([longtitude, latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);
            currentTime = new Date(new Date().setSeconds(new Date().getSeconds() + i)); //adding 1 sec to the time needed to calculate the sat position

            arrCoords.push(transformCoords);

            if ((arrCoords[i-1]?.[0] > arrCoords[i]?.[0]) && (arrCoords[i]?.[0] > 20000000 || arrCoords[i]?.[0] < -20000000)) {//satellite going from WEST TO EAST
                const line = arrCoords.slice(startNewLineIndex, i);//split line on the map border -180/180 degree

                startNewLineIndex = i;

                lines.push(line);
            }

            if ((arrCoords[i-1]?.[0] < arrCoords[i]?.[0]) && (arrCoords[i]?.[0] > 20000000 || arrCoords[i]?.[0] < -20000000)) {//satellite going from EAST TO WEST
                const line = arrCoords.slice(startNewLineIndex, i);//split line on the map border -180/180 degree

                startNewLineIndex = i;

                lines.push(line);
            }
        }
        lines.push(arrCoords.slice(startNewLineIndex, arrCoords.length)); 

        return lines;
    } 

    const drawOrbitLayer = (): void => {
        if (!mapRef.current || !tle) return;

        const lines = createLines();

        removeLayerById(mapRef.current, ORBIT_LAYER_NAME);

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

        mapRef.current.getLayers().insertAt(1, vectorLayer);
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

    const updateSatellitePosition = (event: RenderEvent): void => {
        if (!mapRef.current || !tle) return;

        const position = getSatellitePosition(new Date());
        const transformCoords = transform([position.longtitude, position.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        positionRef.current = position;

        const point = new Point(transformCoords);
        
        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(satelliteStyle);
        vectorContext.drawGeometry(point);
        /**
         * We render geometry by vector context and hide geoMarker and trigger map render through 
         * change event (we get smooth animations when moving the map)
         * solution: https://openlayers.org/en/latest/examples/feature-move-animation.html 
         */
        mapRef.current.render(); //We force the map rendering to be looped through the render function and postrender listener
    };

    const updatePositionState = (): (() => void) => {
        const interval = setInterval(() => {
            onSatPositionChange(positionRef.current as IPosition);
        }, 1000);

        return () => clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(drawOrbitLayer, [tle, numberOfOrbits]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(drawSatelliteLayer, [tle]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updatePositionState, [tle]);

    // useEffect(reRenderMap, [numberOfOrbits]);

    return (
        <MapComponent id="map-satellite-details-orbit" mapRef={mapRef} />
    );
};
