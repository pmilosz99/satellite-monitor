import { Degrees, Satellite, Sensor } from "ootk-core";
import { IOverflight } from "./model";
import { OverflightSession } from "./OverflightSession";
import { IUserLocation } from "../../features/user-location/types/user-location";
import { SensorFactory } from "./SensorFactory ";

export class OverflightPredictor {
    private satellite: Satellite;
    private durationSeconds: number;
    private date: Date;
    private sensorAllSky: Sensor;
    private sensorAbove10: Sensor;

    constructor(
        satellite: Satellite, 
        durationSeconds: number, 
        userLocation: IUserLocation, 
        date: Date = new Date()
    ) {
        this.satellite = satellite;
        this.durationSeconds = durationSeconds;
        this.date = date
        this.sensorAllSky = SensorFactory.createSensor(userLocation, 0 as Degrees);
        this.sensorAbove10 = SensorFactory.createSensor(userLocation, 10 as Degrees);
    }

    public getOverflights(): IOverflight[] {
        const overflights: IOverflight[] = [];

        let currentOverflightSession = new OverflightSession();
        let currentTime = this.date;

        for (let i = 0; i < this.durationSeconds; i++) {
            const isVisible = this.sensorAllSky.isSatInFov(this.satellite, currentTime);
            const isAbove10 = this.sensorAbove10.isSatInFov(this.satellite, currentTime);
            const isPassStarted = i === 0 && isVisible;

            if (isPassStarted) {
                currentTime = new Date(currentTime.getTime() + 1800000); // add 30 min
                continue;
            } // The pass is started, we move time to next pass

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