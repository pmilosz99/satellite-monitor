import { Satellite } from "ootk-core";
import { OverflightPredictor } from "./OverflightPredictor";
import { IUserLocation } from "../../features/user-location/types/user-location";
import { IOverflight } from "./model";

export const getOverflightPrediction = (
    sat: Satellite,    
    userLocation: IUserLocation,
    startPassDate: Date = new Date(),
): IOverflight => {
    const dateBeforeFirstFlight = new Date(startPassDate.getTime() - 10 * 1000);
    const minSecPerFlight = 4500;

    const predictor = new OverflightPredictor(sat, minSecPerFlight, userLocation, dateBeforeFirstFlight);
    return predictor.getOverflights()[0];
};