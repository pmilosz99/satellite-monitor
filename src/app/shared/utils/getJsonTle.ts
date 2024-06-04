export const getJsonTle = (tle: string) => {
    const lines = tle.split('\n');
    const arrJson = [];

    for(let i = 0; i < lines.length; i += 3) {
        const line0 = lines[i];
        const line1 = lines[i + 1];
        const line2 = lines[i + 2];

        if (!line1 || !line2) continue;
        
        const noradId = parseInt(line1?.substring(2, 7));

        arrJson.push({ name: line0.replace('\r', '').trim(), noradId: noradId, line1: line1?.replace('\r', '').trim(), line2: line2?.replace('\r', '').trim() });
    }

    return arrJson
};