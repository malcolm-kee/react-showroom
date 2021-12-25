export const createSymbol = function (description: string) {
  return '@' + (description || '@') + Math.random();
};
