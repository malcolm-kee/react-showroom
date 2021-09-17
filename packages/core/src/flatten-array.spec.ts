import { flattenArray } from './flatten-array';

test('flattenArray', () => {
  expect(flattenArray([1, [2, 3, [4], 5], 6, [7]])).toEqual([
    1, 2, 3, 4, 5, 6, 7,
  ]);
  expect(flattenArray([1, [2], 3])).toEqual([1, 2, 3]);
  expect(
    flattenArray<number | { a: string } | { b: string }>([
      [[1]],
      { a: 'a' },
      [[{ b: 'b' }]],
    ])
  ).toEqual([1, { a: 'a' }, { b: 'b' }]);
});
