import { FC } from "react";
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

import { ISatellitePosition } from "../../types";
import { OL_DEFAULT_MAP_PROJECTION } from "../../../../shared/consts";

interface IDetailsBox {
    title: string;
    positionSat: ISatellitePosition;
    period: number;
    numberOfOrbits: number;
    isTrackSat: boolean;
    isMobile: boolean;
    onNumberInputChange: (_: string, valueAsNumber: number) => void;
    onTrack: () => void;
}

export const DetailsBox: FC<IDetailsBox> = ({ 
    title, 
    positionSat, 
    period, 
    isTrackSat, 
    isMobile, 
    numberOfOrbits, 
    onNumberInputChange, 
    onTrack 
}) => {
    const map = useMap();

    const onZoomIn = (): void => {
        if (!map || !positionSat) return;

        const transformCoords = transform([positionSat.longtitude, positionSat.latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        map.getView().animate({
            center: transformCoords as Coordinate,
            zoom: 10,
            easing: easeOut,
        });
    };

    return (
        <Box w={isMobile ? '100%' : '50%'} borderWidth="1px" borderRadius="6px" p={5}>
            <Center>
                <Heading>
                    <Text>{title}</Text>
                </Heading>
            </Center>
            <Center>
                <Box p={isMobile ? 1 : 5} w={isMobile ? '100%' : '80%'}>
                    <DetailsBoxData positionSat={positionSat} period={period} />
                    <br />
                    <NumberOrbitInput numberOfOrbits={numberOfOrbits} satPeriod={period} onChange={onNumberInputChange}/>
                    <br />
                    <DetailsBoxButtons isTrackSat={isTrackSat} onZoom={onZoomIn} onTrack={onTrack}/>
                </Box>
            </Center>
        </Box>
    )
};

export default DetailsBox;