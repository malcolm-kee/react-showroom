export const isEqualArray = <T extends unknown>(
  arrayOne: Array<T>,
  arrayTwo: Array<T>,
  options?: {
    ignoreOrder?: boolean;
  }
) => {
  const { ignoreOrder = false } = options || {};

  if (arrayOne === arrayTwo) {
    return true;
  }
  if (arrayOne.length !== arrayTwo.length) {
    return false;
  }

  if (ignoreOrder) {
    const arr1Sorted = arrayOne.sort();
    const arr2Sorted = arrayTwo.sort();
    return arr1Sorted.every((item, index) => item === arr2Sorted[index]);
  }

  return arrayOne.every((item, index) => item === arrayTwo[index]);
};
