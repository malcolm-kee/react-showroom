import { dedupeArray } from './dedupe-array';

test('dedupeArray', () => {
  expect(dedupeArray([1, 2, 3, 4, 5, 1, 3, 4, 1, 2])).toStrictEqual([
    1, 2, 3, 4, 5,
  ]);
  expect(
    dedupeArray(['a', 'b', 'c', 'd', 'e', 'a', 'd', 'c', 'a'])
  ).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
  expect(dedupeArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
  expect(dedupeArray(['1'])).toStrictEqual(['1']);
  expect(
    dedupeArray(
      [
        {
          value: 1,
          label: 'One',
        },
        {
          value: 2,
          label: 'Two',
        },
        {
          value: 2,
          label: 'two',
        },
        {
          value: 1,
          label: 'one',
        },
      ],
      'value'
    )
  ).toStrictEqual([
    {
      value: 1,
      label: 'One',
    },
    {
      value: 2,
      label: 'Two',
    },
  ]);
});
