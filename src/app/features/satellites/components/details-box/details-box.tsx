import { FC, useEffect, useState } from "react";
import { easeOut } from "ol/easing";
import { transform } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { 
    Box, 
    Center, 
    Heading, 
    Text 
} from "@chakra-ui/react";

import { DetailsBoxData } from "./details-box-data";
import { DetailsBoxButtons } from "./details-box-buttons";
import { NumberOrbitInput } from "./number-orbit-input";

import { useMap } from "../../../../shared/hooks";

import { OL_DEFAULT_MAP_PROJECTION } from "../../../../shared/consts";
import { getSatellitePosition } from "../../../../shared/utils";
import { ISatPosition } from "../../../../shared/utils/getSatellitePosition";

const initialPosition: ISatPosition = { longitude: 0, latitude: 0, height: 0 };

interface IDetailsBox {
    title: string;
    tle: string[];
    period: number;
    numberOfOrbits: number;
    isTrackSat: boolean;
    isMobile: boolean;
    onNumberInputChange: (_: string, valueAsNumber: number) => void;
    onTrack: () => void;
}

export const DetailsBox: FC<IDetailsBox> = ({ 
    title, 
    tle, 
    period, 
    isTrackSat, 
    isMobile, 
    numberOfOrbits, 
    onNumberInputChange, 
    onTrack 
}) => {
    const [positionSat, setPositionSat] = useState<ISatPosition>(initialPosition);

    const map = useMap();

    const handlePositionSatellite = (currentTime: Date) => {
        const position = getSatellitePosition(currentTime, tle[1], tle[2]);

        setPositionSat(position);
    };

    const onZoomIn = (): void => {
        if (!map || !positionSat) return;

        const transformCoords = transform([positionSat.longitude, positionSat.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        map.getView().animate({
            center: transformCoords as Coordinate,
            zoom: 10,
            easing: easeOut,
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handlePositionSatellite(new Date());
        }, 1000);

        return () => clearInterval(interval);
    })

    return (
        <Box w={isMobile ? '100%' : '50%'} borderWidth="1px" borderRadius="6px" p={5}>
            <Center>
                <Heading>
                    <Text>{title}</Text>
                </Heading>
            </Center>
            <Center>
                <Box p={isMobile ? 1 : 0} w={isMobile ? '100%' : '80%'}>
                    <DetailsBoxData positionSat={positionSat} period={period} />
                    <br />
                    <NumberOrbitInput numberOfOrbits={numberOfOrbits} satPeriod={period} onChange={onNumberInputChange}/>
                    <br />
                    <DetailsBoxButtons isTrackSat={isTrackSat} onZoom={onZoomIn} onTrack={onTrack}/>
                    <br />
                </Box>
            </Center>
        </Box>
    )
};

export default DetailsBox;