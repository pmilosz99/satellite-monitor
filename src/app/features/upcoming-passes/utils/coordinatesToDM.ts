export function coordinatesToDM(latitude: number, longitude: number): string {
    function convertToDM(decimal: number, isLatitude: boolean): string {
      const direction = isLatitude
        ? decimal >= 0 ? "N" : "S"
        : decimal >= 0 ? "E" : "W";
      decimal = Math.abs(decimal);
      const degrees = Math.floor(decimal);
      const minutes = Math.floor((decimal - degrees) * 60);
      return `${degrees}° ${minutes}' ${direction}`;
    }
  
    const latDM = convertToDM(latitude, true);
    const lonDM = convertToDM(longitude, false);
  
    return `${latDM}, ${lonDM}`;
}