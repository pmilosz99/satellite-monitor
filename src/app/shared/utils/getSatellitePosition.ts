import { EciVec3, degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec } from "satellite.js";

export interface ISatPosition {
    longitude: number,
    latitude: number,
    height: number,
}

export const getSatellitePosition = (time: Date, firstLineTle: string, secondLineTle: string): ISatPosition => {
    const satrec = twoline2satrec(firstLineTle, secondLineTle);

    const positionAndVelocity = propagate(satrec, time);

    const positionEci = positionAndVelocity.position as EciVec3<number>;

    if (!positionEci) return { longitude: 0, latitude: 0, height: 0 };

    const gmst = gstime(time);
    const positionGd = eciToGeodetic(positionEci, gmst);

    const longitude = degreesLong(positionGd.longitude);
    const latitude = degreesLat(positionGd.latitude);
    const height = positionGd.height;

    return { longitude, latitude, height };
};