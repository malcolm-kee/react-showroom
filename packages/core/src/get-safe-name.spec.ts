import { getSafeName, stringToIdentifier } from './get-safe-name';

test('getSafeName', () => {
  expect(getSafeName('')).toBe('');
  expect(getSafeName('react')).toBe('react');
  expect(getSafeName('react-query')).toBe('reactQuery');
  expect(getSafeName('@org/ui-lib')).toBe('org__uiLib');
});

test('stringToIdentifier', () => {
  expect(stringToIdentifier('I have a dream')).toBe('_IHaveADream');
  expect(stringToIdentifier('1st test')).toBe('_1stTest');
  expect(stringToIdentifier('$ I love')).toBe('_$ILove');
  expect(stringToIdentifier('_(nice)')).toBe('__nice');
  expect(
    stringToIdentifier(`I 
  love 1 and
  3 $
  `)
  ).toBe('_ILove1And3$');
});
