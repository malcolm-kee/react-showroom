export const createSymbol =
  typeof Symbol === 'undefined'
    ? function (description: string) {
        return '@' + (description || '@') + Math.random();
      }
    : Symbol;
