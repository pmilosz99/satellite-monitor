import { Satellite } from "ootk-core";
import { OverflightPredictor } from "./OverflightPredictor";
import { IUserLocation } from "../../features/user-location/types/user-location";
import { IOverflight } from "./model";

export const getOverflightsPrediction = (
    sat: Satellite,
    durationSeconds: number,
    userLocation: IUserLocation,
    date: Date = new Date(),
): IOverflight[] => {
    const predictor = new OverflightPredictor(sat, durationSeconds, userLocation, date);
    return predictor.getOverflights();
};