import { transform } from "ol/proj";
import { getSatellitePosition } from "../utils";
import { OL_DEFAULT_MAP_PROJECTION } from "../consts";

interface IWorkerCreateOrbitOnMessage {
    period: number;
    firstLine: string;
    secondLine: string;
    numberOfOrbits: number;
    date?: Date;
}

const PERIOD_LIMIT = 500; 

const calculatePeriod = (period: number) => {
    if (period > PERIOD_LIMIT) return period;

    return period * 60;
};

const calculateTime = (period: number, date: Date) => {
    if (period > PERIOD_LIMIT) {
        return new Date(new Date(date).setMinutes(date.getMinutes() + 1));
    }

    return new Date(new Date(date).setSeconds(date.getSeconds() + 1));
}

self.onmessage = (event: MessageEvent<IWorkerCreateOrbitOnMessage>) => {
    const { period, firstLine, secondLine, numberOfOrbits = 1, date = new Date() } = event.data;

    const arrCoords = [];
    const lines = [];

    let currentTime = date;
    let startNewLineIndex = 0;

    const PERIOD_VALUE = calculatePeriod(period);

    for(let i=0; i < numberOfOrbits * PERIOD_VALUE; i++) {
        const { longitude, latitude } = getSatellitePosition(currentTime, firstLine, secondLine);//create points (sat position)
        const transformCoords = transform([longitude, latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        currentTime = calculateTime(period, currentTime) //adding 1 sec or 1 minutes to the time needed to calculate the sat position

        arrCoords.push(transformCoords);

        if ((arrCoords[i-1]?.[0] > arrCoords[i]?.[0]) && (arrCoords[i]?.[0] > 20000000 || arrCoords[i]?.[0] < -20000000)) {//satellite going from WEST TO EAST
            const line = arrCoords.slice(startNewLineIndex, i);//split line on the map border -180/180 degree

            startNewLineIndex = i;

            lines.push(line);
        }

        if ((arrCoords[i-1]?.[0] < arrCoords[i]?.[0]) && (arrCoords[i]?.[0] > 20000000 || arrCoords[i]?.[0] < -20000000)) {//satellite going from EAST TO WEST
            const line = arrCoords.slice(startNewLineIndex, i);//split line on the map border -180/180 degree

            startNewLineIndex = i;

            lines.push(line);
        }
    }
    lines.push(arrCoords.slice(startNewLineIndex, arrCoords.length)); 

    postMessage(lines);
}