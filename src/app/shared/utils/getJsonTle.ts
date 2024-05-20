export const getJsonTle = (tle: string) => {
    if (!tle) return;

    const lines = tle.split('\n');
    const arrJson = [];

    for(let i = 0; i < lines.length; i += 3) {
        const line0 = lines[i];
        const line1 = lines[i + 1];
        
        const noradId = line1?.substring(2, 7);
        arrJson.push({ name: line0.replace('\r', '').trim(), noradId: noradId });
    }

    return arrJson;
}