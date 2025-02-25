import { FC, useEffect, useState } from "react";
import { transform } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { easeOut } from "ol/easing";

import { getSatellitePosition, ISatPosition } from "../../../../shared/utils/getSatellitePosition";
import { useMap } from "../../../../shared/hooks";
import { OL_DEFAULT_MAP_PROJECTION } from "../../../../shared/consts";
import { DetailsBoxData } from "./details-box-data";
import { NumberOrbitInput } from "./number-orbit-input";
import { DetailsBoxButtons } from "./details-box-buttons";

interface IDetailsBoxData {
    tle: string[];
    period: number;
    numberOfOrbits: number;
    isTrackSat: boolean;
    onNumberInputChange: (_: string, valueAsNumber: number) => void;
    onTrack: () => void;
}

const initialPosition: ISatPosition = { longitude: 0, latitude: 0, height: 0 };

export const DetailsBoxPosition: FC<IDetailsBoxData> = ({ 
    tle ,
    period,
    numberOfOrbits,
    isTrackSat,
    onNumberInputChange,
    onTrack,
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
        <>
            <DetailsBoxData positionSat={positionSat} period={period} />
            <br />
            <NumberOrbitInput numberOfOrbits={numberOfOrbits} satPeriod={period} onChange={onNumberInputChange}/>
            <br />
            <DetailsBoxButtons isTrackSat={isTrackSat} onZoom={onZoomIn} onTrack={onTrack}/>
        </>

    )
}

export default DetailsBoxPosition;