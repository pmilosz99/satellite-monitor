import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { Alert, AlertIcon, Box, Button, Center, Divider, Flex, Spacer, Stack, Text, useToast } from "@chakra-ui/react";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import {
    Circle,
    Fill,
    Stroke,
    Style,
  } from 'ol/style.js';
import VectorSource from "ol/source/Vector";
import { Vector } from 'ol/layer.js';
import OLMap from 'ol/Map';
import { Coordinate } from "ol/coordinate";
import {transform} from 'ol/proj';

import { MapComponent, T } from "../../../shared/components";
import { OLMAP_ID, OL_DEFAULT_MAP_PROJECTION } from "../../../shared/consts";
import { removeLayerById } from "../../../shared/utils";
import { coordinates } from "../../../shared/atoms";

const pointStyle = new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({color: '#3185ff'}),
      stroke: new Stroke({
        color: '#fafafd',
        width: 2,
      }),
    }),
});

const POINT_LAYER_NAME = 'location-point';

export const SelectLocation = () => {
    const [coordinate, setCoordinate] = useState<Coordinate | null>(null);
    const [atomCoordinates, setAtomCoordinates] = useAtom(coordinates);
    const [isInitialState, setIsInitialState] = useState(true);
    const mapRef = useRef<OLMap>();
    const toast = useToast();

    const isMobile = window.innerWidth <= 768;

    const addPoint = (coordinate: Coordinate): void => {
        if (!mapRef.current) return;

        const point = new Feature({
            geometry: new Point(coordinate),
        });
        point.setStyle(pointStyle);

        const vectorSource = new VectorSource({
            features: [point],
        });

        const vectorLayer = new Vector({
            [OLMAP_ID]: POINT_LAYER_NAME,
            source: vectorSource
        });

        mapRef.current.addLayer(vectorLayer);
    };

    const removePoint = (): void => {
        if (!mapRef.current) return;

        removeLayerById(mapRef.current, POINT_LAYER_NAME);
    };

    const handleClickOnMap = (): void => {
        if (!mapRef.current) return;

        mapRef.current.on('click', ({ coordinate }) => {
            setIsInitialState(false);
            removePoint();
            addPoint(coordinate);

            const transformCoords = transform(coordinate, OL_DEFAULT_MAP_PROJECTION, 'EPSG:4326');
            const toFixedCoords = transformCoords.map((coord) => coord.toFixed(4));
            const toNumberCoords = toFixedCoords.map((coord) => Number(coord));

            setCoordinate(toNumberCoords);
        });
    };

    const handleInitMap = (): void => {
        if (!atomCoordinates || !isInitialState) return;

        const transformCoords = transform(atomCoordinates, 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);
        addPoint(transformCoords);
    };

    const handleSetLocation = (): void => {
        setAtomCoordinates(coordinate);
        toast({
            title: <T dictKey="locationSetSucc" />,
            status: 'success',
            position: 'top-right',
            duration: 1500,
        });
    };

    const handleRemoveLocation = (): void => {
        setCoordinate(null);
        setAtomCoordinates(null);
        removePoint();
        toast({
            title: <T dictKey="locationRemoved" />,
            status: 'warning',
            position: 'top-right',
            duration: 1500,
        })
    }

    useEffect(handleInitMap, [atomCoordinates, isInitialState]);
    useEffect(handleClickOnMap, [mapRef])

    const displayLongtitude = coordinate?.[0].toFixed(4) || atomCoordinates?.[0].toFixed(4) || '';
    const displayLatitude = coordinate?.[1].toFixed(4) || atomCoordinates?.[1].toFixed(4) || '';

    return (
        <Box p={5} h={'100%'} w={'100%'}>
            <Stack spacing={5} h={'100%'} w={'100%'} direction={isMobile ? 'column' : 'row'}>
                <MapComponent id="map-select-location" mapRef={mapRef} />
                <Stack h={'100%'} w={isMobile ? '100%' : '20%'} direction={'column'} spacing={4}>
                    <Box h={'60%'} borderWidth={1} borderRadius={5}>
                        <Center>
                            <Text p={1}>
                                <T dictKey="location" />
                            </Text>
                        </Center>
                        <Divider />
                        <Box p={2}>
                            <Flex>
                                <Text fontSize='xs' pl={2}>
                                    <T dictKey="latitude" />
                                </Text>
                                <Spacer />
                                <Text fontSize='xs'>{displayLatitude}</Text>
                            </Flex>
                            <Flex>
                                <Text fontSize='xs' paddingLeft={2} pr={3}>
                                    <T dictKey="longtitude" />
                                </Text>
                                <Spacer />
                                <Text fontSize='xs'>{displayLongtitude}</Text>
                            </Flex>
                        </Box>
                    </Box>
                    <Button w={'100%'} variant='solid' onClick={handleSetLocation}>
                        <T dictKey="setLocation" />
                    </Button>
                    <Button w={'100%'} variant='outline' onClick={handleRemoveLocation}>
                        <T dictKey="resetLocation" />
                    </Button>
                    <Alert status="info">
                        <AlertIcon />
                        <Text >
                            <T dictKey="locationInfo" />
                        </Text>
                    </Alert>
                </Stack>
            </Stack>
        </Box>
    )
}