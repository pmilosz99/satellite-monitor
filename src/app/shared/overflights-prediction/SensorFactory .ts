import { Degrees, Kilometers, Sensor } from "ootk-core";
import { IUserLocation } from "../../features/user-location/types/user-location";

export class SensorFactory {
    static createSensor(userLocation: IUserLocation, minEl: Degrees): Sensor {
        return new Sensor({
            lat: userLocation.coordinates[1] as Degrees,
            lon: userLocation.coordinates[0] as Degrees,
            alt: userLocation.height as Kilometers,
            minEl: minEl,
            maxEl: 90 as Degrees,
            minRng: 0 as Kilometers,
            maxRng: 100000 as Kilometers,
            minAz: 0 as Degrees,
            maxAz: 360 as Degrees,
        });
    }
}