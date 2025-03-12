import React from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Coordinate } from 'ol/coordinate';
import { useSatObject, useUserLocation } from '../../../shared/hooks';
import { getOverflightPrediction } from '../../../shared/overflights-prediction/getOverflightPrediction';
import { IUserLocation } from '../../user-location/types/user-location';
import { PassDetailsData, PassOrbitMap } from '../components';

export const PassesDetails: React.FC = () => {
    const { satelliteId } = useParams();
    const [searchParams ] = useSearchParams();
    
    const sat = useSatObject(satelliteId || '');
    const userLocation = useUserLocation();

    const currentCoords = searchParams.get('coords')?.split(',') as unknown as Coordinate;
    const startVisibleDate = searchParams.get('startVisibleDate');
    
    const currentLocation: IUserLocation = {
        coordinates: currentCoords || userLocation?.coordinates,
        height: 0,
    }

    if (!sat || !userLocation) return;    

    const overflight = getOverflightPrediction(sat, currentLocation, new Date(startVisibleDate || new Date()));

    return (
        <SimpleGrid
            h='100%'
            columns={{ base: 1, md: 2 }}
            p={5}
            spacing={4}
        >
            <Box borderWidth="1px" borderRadius="6px" gridColumn={{ md: "1 / -1" }}>
                <PassDetailsData 
                    sat={sat}
                    coords={currentLocation.coordinates}
                    startVisibleDate={new Date(startVisibleDate || new Date())}
                    pass={overflight}
                />
            </Box>
            <Box borderWidth="1px" borderRadius="6px">
                <PassOrbitMap />
            </Box>
            <Box borderWidth="1px" borderRadius="6px">
                <Flex alignItems="center" justifyContent="center" h="100%" w="100%">
                    <Text>Sky map, coming soon...</Text>
                </Flex>
            </Box>
        </SimpleGrid>
    );
};

export default PassesDetails;