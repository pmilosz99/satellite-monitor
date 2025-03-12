export const getSatelliteTle = (tle: string, noradId: string): string[] => {
    const lines = tle.split('\n');

    for(let i = 0; i < lines.length; i += 3) {
        const line0 = lines[i];
        const line1 = lines[i + 1];
        const line2 = lines[i + 2];

        const satelliteNoradId = parseInt(line1?.substring(2, 7));
        const searchedNoradId = parseInt(noradId);

        if (satelliteNoradId === searchedNoradId) {
            return [line0.replace('\r', ''), line1.replace('\r', ''), line2.replace('\r', '')];
        }
    }
    return [];
};
