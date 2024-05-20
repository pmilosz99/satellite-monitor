export const getSatelliteTle = (tle: string, noradId: string) => {
    const lines = tle.split('\n');

    for(let i = 0; i < lines.length; i += 3) {
        const line0 = lines[i];
        const line1 = lines[i + 1];
        const line2 = lines[i + 2];

        const searchSatelliteNoradId = line1?.substring(2, 7);

        if (searchSatelliteNoradId === noradId) {
            return [line0.replace('\r', ''), line1.replace('\r', ''), line2.replace('\r', '')];
        }
    }
};
