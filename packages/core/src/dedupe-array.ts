/**
 * Dedupe array item
 *
 * Based on implementation from https://github.com/jonschlinkert/array-unique.
 *
 * @param array array that you wish to dedupe.
 * @param uniqueKey properties to compare. If not provided, we will shallow compare the equality of the item.
 */
export function dedupeArray<T>(array: readonly T[], uniqueKey?: keyof T): T[] {
  const arr = array.slice();

  const len = arr.length;
  let i = -1;

  while (i++ < len) {
    var j = i + 1;

    for (; j < arr.length; ++j) {
      if (
        uniqueKey ? arr[i][uniqueKey] === arr[j][uniqueKey] : arr[i] === arr[j]
      ) {
        arr.splice(j--, 1);
      }
    }
  }

  return arr;
}
