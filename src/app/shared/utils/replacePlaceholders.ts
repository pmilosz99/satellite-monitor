export const replacePlaceholders = <T extends Record<string, string>>(
    inputString: string, 
    inputObject: T
): string => {
  const regex = /:(\w+):/g;

  return inputString.replace(regex, (_, placeholder) => {
    const value = inputObject[placeholder];
    return value === undefined ? '' : value;
  });
};

// Function without checking any undefined values
// export const replacePlaceholders = <T extends Record<string, string>>(
//     inputString: string, 
//     inputObject: T
// ): string => {
//     const regex = /:(\w+):/g;

//     return inputString.replace(regex, (match, placeholder) => inputObject[placeholder]);
// };
