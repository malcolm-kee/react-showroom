import { isDefined } from './type-guard';

export function omit<T extends {}, KeysToOmit extends keyof T>(
  oriObject: T,
  keysToOmit: KeysToOmit[]
): Omit<T, KeysToOmit>;
export function omit<T extends {}>(
  oriObject: T,
  keysToOmit: Array<string>
): Partial<T>;
export function omit<T extends {}>(
  oriObject: T,
  keysToOmit: Array<string>
): Partial<T> {
  const result = Object.assign({}, oriObject);

  keysToOmit.forEach(
    (key) =>
      // @ts-expect-error
      delete result[key]
  );

  return result;
}

export function pick<T extends {}, KeysToPick extends keyof T>(
  oriObject: T,
  keysToPick: KeysToPick[]
): Pick<T, KeysToPick> {
  const result = {} as Pick<T, KeysToPick>;

  keysToPick.forEach((key) => {
    const value = oriObject[key];
    if (isDefined(value)) {
      result[key] = value;
    }
  });

  return result;
}
