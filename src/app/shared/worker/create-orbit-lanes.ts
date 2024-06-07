import { transform } from "ol/proj";
import { getSatellitePosition } from "../utils";
import { OL_DEFAULT_MAP_PROJECTION } from "../consts";

const computePeriod = (period: number) => {
    if (period > 500) return period;

    return period * 60;
}

self.onmessage = (event) => {
    const { period, firstLine, secondLine } = event.data;

    const arrCoords = [];
    const lines = [];

    let currentTime = new Date();
    let startNewLineIndex = 0;

    const PERIOD_VALUE = computePeriod(period);

    for(let i=0; i < PERIOD_VALUE; i++) {
        const { longtitude, latitude } = getSatellitePosition(currentTime, firstLine, secondLine);//create points (sat position)
        const transformCoords = transform([longtitude, latitude], 'EPSG:4326', OL_DEFAULT_MAP_PROJECTION);

        currentTime = new Date(new Date().setSeconds(new Date().getSeconds() + i)); //adding 1 sec to the time needed to calculate the sat position

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