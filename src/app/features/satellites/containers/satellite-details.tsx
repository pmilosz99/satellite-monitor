import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Satellite, TleLine1, TleLine2 } from 'ootk-core';
import { 
    Box, 
    Flex, 
    Heading, 
    Spinner, 
    Stack, 
} from "@chakra-ui/react";
import debounce from 'lodash.debounce';

import { SatelliteMapOrbit } from "../components/satellite-map-orbit";

import { tle } from "../../../shared/atoms";
import { useAtomValue } from "jotai";

import { DetailsBox } from "../components/details-box";

import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";

import { T } from "../../../shared/components";

export const SatelliteDetails = () => {
    const [numberOfOrbits, setNumberOfOrbits] = useState<number>(1);
    const [isTrackSat, setIsTrackSat] = useState(false);
    const { satelliteId } = useParams();
    const tleQuery = useAtomValue(tle);

    const isMobileLayout = window.innerWidth <= 768;

    const singleTle = useMemo(() => getSatelliteTle(tleQuery?.data || '', satelliteId || ''), [tleQuery, satelliteId]);   

    const toggleTrackIn = () => setIsTrackSat((prev) => !prev);

    const onNumberInputChange = useMemo(() => debounce((event) => {
        setNumberOfOrbits(event);
    }, 300), []);

    const onTrackIn = (): void => toggleTrackIn();

    if (tleQuery?.isLoading) return (
        <Flex alignItems='center' direction='column' h="100%" justifyContent="center">
            <Spinner size='xl' />
        </Flex>
    )

    if (!singleTle.length) return (
        <Flex alignItems='center' direction='column' h="100%" justifyContent="center">
            <Heading>
                <T dictKey="notFoundSat" />
            </Heading>
        </Flex>
    )

    const sat = new Satellite({ tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2 })

    return (
        <Box p={5} h="100%">
            <Stack direction={isMobileLayout ? 'column' : 'row'} h="100%">
                <SatelliteMapOrbit 
                    tle={singleTle} 
                    numberOfOrbits={numberOfOrbits} 
                    isTrackSat={isTrackSat}
                    setTrackSatOff={() => setIsTrackSat(false)}
                />
                <DetailsBox 
                    title={singleTle[0]}
                    tle={singleTle}
                    onTrack={onTrackIn}
                    isTrackSat={isTrackSat}
                    isMobile={isMobileLayout}
                    period={sat.period}
                    onNumberInputChange={onNumberInputChange}
                    numberOfOrbits={numberOfOrbits}
                />
            </Stack>
        </Box>
    )
};