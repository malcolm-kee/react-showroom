export type NestedArray<T> = Array<T | NestedArray<T>>;

/**
 * Flatten an array recursively
 *
 * @see https://github.com/jonschlinkert/arr-flatten
 * @license MIT
 */
export function flattenArray<T>(nestedArray: NestedArray<T>): T[] {
  const result: T[] = [];

  flatten(nestedArray, result);

  return result;
}

function flatten<T>(input: NestedArray<T>, result: T[]) {
  let arrLen = input.length;
  let index = 0;

  while (arrLen--) {
    const current = input[index++];
    if (Array.isArray(current)) {
      flatten(current, result);
    } else {
      result.push(current);
    }
  }
}
