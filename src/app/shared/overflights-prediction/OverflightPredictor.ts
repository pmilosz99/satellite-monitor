import { Degrees, Satellite, Sensor } from "ootk-core";
import { IOverflight } from "./model";
import { OverflightSession } from "./OverflightSession";
import { IUserLocation } from "../../features/user-location/types/user-location";
import { SensorFactory } from "./SensorFactory ";

export class OverflightPredictor {
    private satellite: Satellite;
    private durationSeconds: number;
    private sensorAllSky: Sensor;
    private sensorAbove10: Sensor;

    constructor(satellite: Satellite, durationSeconds: number, userLocation: IUserLocation) {
        this.satellite = satellite;
        this.durationSeconds = durationSeconds;
        this.sensorAllSky = SensorFactory.createSensor(userLocation, 0 as Degrees);
        this.sensorAbove10 = SensorFactory.createSensor(userLocation, 10 as Degrees);
    }

    public getOverflights(): IOverflight[] {
        const overflights: IOverflight[] = [];

        let currentOverflightSession = new OverflightSession();
        let currentTime = new Date();

        for (let i = 0; i < this.durationSeconds; i++) {
            const isVisible = this.sensorAllSky.isSatInFov(this.satellite, currentTime);
            const isAbove10 = this.sensorAbove10.isSatInFov(this.satellite, currentTime);

            currentOverflightSession.update(currentTime, isVisible, isAbove10);

            if (currentOverflightSession.isFinish()) {
                overflights.push(currentOverflightSession.complete());
                currentOverflightSession = new OverflightSession();
            }

            currentTime = new Date(currentTime.getTime() + 1000);
        }

        return overflights;
    }
}