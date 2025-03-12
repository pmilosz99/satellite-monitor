import { EARTH_RADIUS, SURFACE_CORRECTION_FACTOR } from "../consts";

export const getRadiusToVisibleSat = (
    satelliteHeight: number, 
    elevationAngleDegrees: number, 
    earthRadius: number = EARTH_RADIUS, 
    curvatureCorrectionFactor: number = SURFACE_CORRECTION_FACTOR
) => {
    const elevationAngleRadians: number = (elevationAngleDegrees * Math.PI) / 180;
        
    const alpha: number = Math.acos(
    (earthRadius / (earthRadius + satelliteHeight)) * Math.cos(elevationAngleRadians)
    ) - elevationAngleRadians;

    const arcLength: number = earthRadius * alpha * curvatureCorrectionFactor;

    return arcLength;
};
