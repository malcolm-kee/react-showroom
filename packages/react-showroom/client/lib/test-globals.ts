const noop = () => {};

export const describe = noop;
export const test = noop;
export const it = noop;

const expectMethods = [
  'toBe',
  'toEqual',
  'toStrictEqual',
  'toBeVisible',
  'toMatchInlineSnapshot',
  'toBeCalled',
  'toBeDefined',
];

const expectObj = expectMethods.reduce(
  (result, m) => ({
    ...result,
    [m]: noop,
  }),
  {}
);

export const expect = () => expectObj;

export const jest = {
  mock: noop,
  spyOn: noop,
};
