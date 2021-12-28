export const parseSafely = <Value = boolean | string | number>(
  raw: string
): Value | undefined => {
  try {
    const result = JSON.parse(raw);
    return result;
  } catch (err) {
    return undefined;
  }
};

export const stringifySafely = (value: any) => {
  try {
    const result = JSON.stringify(value);
    return result;
  } catch (err) {
    return undefined;
  }
};
