import { FC, useEffect, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom";
import { Feature, Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { Box } from "@chakra-ui/react";
import { MapComponent } from "../../../shared/components";
import { LineString } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Vector } from "ol/layer";
import { Fill, Stroke, Style } from "ol/style";
import { circular } from 'ol/geom/Polygon.js';
import { FeatureLike } from "ol/Feature";

import { useSatObject } from "../../../shared/hooks";
import { removeLayerById } from "../../../shared/utils";
import { OLMAP_ID } from "../../../shared/consts";
import { getRadiusToVisibleSat } from "../../../shared/overflights-prediction";

const PASS_ORBIT_LAYER = 'pass-orbit-layer';
const VISIBLE_SAT_AREA = 'visible-sat-area';

const styleFunction = (feature: FeatureLike) => {
    const type = feature.get('circleType');
    
    return new Style({
        fill: new Fill({
            color: type === 'fullCoverage' 
                ? 'rgba(169, 169, 169, 0.2)'
                : 'rgba(169, 169, 169, 0)'
        }),
        stroke: new Stroke({
            color: type === 'fullCoverage' 
                ? 'rgba(141, 141, 141, 0.7)' 
                : 'rgba(11, 136, 0, 0.733)',
            width: type === 'fullCoverage' ? 2 : 1.5
        })
    });
};

export const PassOrbitMap: FC = () => {
    const mapRef = useRef<Map>();
    const { satelliteId } = useParams();
    const [ searchParams ] = useSearchParams();
    
    const sat = useSatObject(satelliteId || '');

    const startVisibleDate = searchParams.get('startVisibleDate');
    const currentCoords = searchParams.get('coords')?.split(',') as unknown as Coordinate;

    const workerCreateOrbitLanes = useRef<Worker>()

    const drawOrbitLayer = () => {
        if (!workerCreateOrbitLanes.current || !sat || !mapRef.current || !startVisibleDate) return;

        const map = mapRef.current;

        workerCreateOrbitLanes.current.postMessage({ period: sat.period, firstLine: sat.tle1, secondLine: sat.tle2, date: new Date(startVisibleDate) });

        workerCreateOrbitLanes.current.onmessage = (event) => {
            const lines = event.data;

            removeLayerById(map, PASS_ORBIT_LAYER);

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
                [OLMAP_ID]: PASS_ORBIT_LAYER,
                source: vectorSource,
            });

            map.getLayers().insertAt(1, vectorLayer);
        }
    };

    const addVisibleAreaLayer = () => {
        if (!sat || !mapRef.current) return;

        const map = mapRef.current

        const radius0El = getRadiusToVisibleSat(sat.toGeodetic().alt, 0);
        const radiusAbove10El = getRadiusToVisibleSat(sat.toGeodetic().alt, 10);

        const wgs84Circle0El = circular(currentCoords, radius0El * 1000, 128);
        const mercatorCircle0El = wgs84Circle0El.transform('EPSG:4326', 'EPSG:3857');

        const wgs84Circle10El = circular(currentCoords, radiusAbove10El * 1000, 128);
        const mercatorCircle10El = wgs84Circle10El.transform('EPSG:4326', 'EPSG:3857');
        
        removeLayerById(map, VISIBLE_SAT_AREA);

        const feature0El = new Feature({
            geometry: mercatorCircle0El,
            circleType: 'fullCoverage',
        });

        const feature10El = new Feature({
            geometry: mercatorCircle10El,
            circleType: 'optimalCoverage',
        });

        const vectorSource = new VectorSource({
            features: [feature0El, feature10El],
        });

        const vectorLayer = new Vector({
            [OLMAP_ID]: VISIBLE_SAT_AREA,
            source: vectorSource,
            style: styleFunction ,
        });

        map.getLayers().insertAt(1, vectorLayer);
    }

    useEffect(() => {
        workerCreateOrbitLanes.current = new Worker(new URL('../../../shared/worker/create-orbit-lanes.ts', import.meta.url), { type: "module" });

        return () => workerCreateOrbitLanes.current?.terminate();
    }, []);

    useEffect(addVisibleAreaLayer, [sat, currentCoords]);
    useEffect(drawOrbitLayer, [sat, startVisibleDate]);
    
    return (
        <Box h="100%">
            <MapComponent id="pass-orbit-map" mapRef={mapRef} />
        </Box>
    )
}