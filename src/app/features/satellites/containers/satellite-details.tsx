import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Satellite, TleLine1, TleLine2 } from 'ootk-core';
import { 
    Box, 
    Flex, 
    Spinner, 
    Stack, 
} from "@chakra-ui/react";

import { SatelliteMapOrbit } from "../components/satellite-map-orbit";

import { tle } from "../../../shared/atoms";
import { useAtomValue } from "jotai";

import { DetailsBox } from "../components/details-box";

import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import { ISatellitePosition } from "../types";

const emptyPosition = { longtitude: 0, latitude: 0, height: 0 } as ISatellitePosition;

export const SatelliteDetails = () => {
    const [positionSatellite, setPositionSatellite] = useState<ISatellitePosition>();
    const [numberOfOrbits, setNumberOfOrbits] = useState<number>(1);
    const [isTrackSat, setIsTrackSat] = useState(false);
    const { satelliteId } = useParams();
    const tleData = useAtomValue(tle);

    const singleTle = useMemo(() => getSatelliteTle(tleData || '', satelliteId || ''), [tleData, satelliteId]);   

    const toggleTrackIn = () => setIsTrackSat((prev) => !prev);

    const onPositionChange = (data: ISatellitePosition) => {
        setPositionSatellite(data);
    };

    const onNumberInputChange = (_: string, valueAsNumber: number): void => {        
        setNumberOfOrbits(valueAsNumber);
    };

    const onTrackIn = (): void => toggleTrackIn();

    if (!singleTle) return (
        <Flex alignItems='center' direction='column' h="100%" justifyContent="center">
            <Spinner size='xl' />
        </Flex>
    )

    const sat = new Satellite({ tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2 })

    return (
        <Box p={5} h="100%">
            <Stack direction="row" h="100%">
                <SatelliteMapOrbit 
                    tle={singleTle} 
                    onSatPositionChange={onPositionChange} 
                    numberOfOrbits={numberOfOrbits} 
                    isTrackSat={isTrackSat}
                    setTrackSatOff={() => setIsTrackSat(false)}
                />
                <DetailsBox 
                    title={singleTle[0]}
                    positionSat={positionSatellite || emptyPosition}
                    onNumberInputChange={onNumberInputChange}
                    onTrack={onTrackIn}
                    isTrackSat={isTrackSat}
                    period={sat.period}
                    numberOfOrbits={numberOfOrbits}
                />
            </Stack>
        </Box>
    )
};