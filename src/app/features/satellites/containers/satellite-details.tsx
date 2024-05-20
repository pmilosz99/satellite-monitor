import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Satellite, TleLine1, TleLine2 } from 'ootk-core';
import { 
    Box, 
    Center, 
    Flex, 
    Heading, 
    Spacer, 
    Spinner, 
    Stack, 
    Text 
} from "@chakra-ui/react";

import { T } from "../../../shared/components";
import { SatelliteMapOrbit } from "../components/satellite-map-orbit";

import { tle } from "../../../shared/atoms";
import { useAtomValue } from "jotai";

import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import NumberOrbitInput from "../components/number-orbit-input";

interface ISatellitePosition {
    longtitude: number;
    latitude: number;
    height: number;
}

export const SatelliteDetails = () => {
    const { satelliteId } = useParams();
    const [positionSatellite, setPositionSatellite] = useState<ISatellitePosition>();
    const [numberOfOrbits, setNumberOfOrbits] = useState<number>(1);
    const tleData = useAtomValue(tle);

    const singleTle = useMemo(() => getSatelliteTle(tleData || '', satelliteId || ''), [tleData, satelliteId]);   

    const onPositionChange = (data: ISatellitePosition) => {
        setPositionSatellite(data);
    };

    const onNumberInputChange = (_: string, valueAsNumber: number): void => {        
        setNumberOfOrbits(valueAsNumber);
    };

    if (!singleTle) return (
        <Flex alignItems='center' direction='column' h="100%" justifyContent="center">
            <Spinner size='xl' />
        </Flex>
    )

    const sat = new Satellite({ tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2 })

    return (
        <Box p={5} h="100%">
            <Stack direction="row" h="100%">
                <Box h="100%" w="100%" borderWidth="1px">
                    <SatelliteMapOrbit tle={singleTle} onSatPositionChange={onPositionChange} numberOfOrbits={numberOfOrbits}/>
                </Box>
                <Box w="50%" borderWidth="1px" borderRadius="6px" p={5  }>
                    <Center>
                        <Heading>
                            <Text>{singleTle[0]}</Text>
                        </Heading>
                    </Center>
                    <Center>
                        <Box p={5} w="80%">
                            <Flex>
                                <Text>
                                    <T dictKey="longtitude" />:
                                </Text>
                                <Spacer />
                                <Text>{positionSatellite?.longtitude.toFixed(4)}</Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <T dictKey="latitude" />:
                                </Text>
                                <Spacer />
                                <Text>{positionSatellite?.latitude.toFixed(4)}</Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <T dictKey="height" />:
                                </Text>
                                <Spacer />
                                <Text>{positionSatellite?.height.toFixed(4)}</Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <T dictKey="orbitTime" />:
                                </Text>
                                <Spacer />
                                <Text>{sat.period.toFixed(2)} min.</Text>
                            </Flex>
                            <br />
                            <NumberOrbitInput numberOfOrbits={numberOfOrbits} satPeriod={sat.period} onChange={onNumberInputChange}/>
                        </Box>
                    </Center>
                </Box>
            </Stack>
        </Box>
    )
};