import { getSafeName } from './get-safe-name';

test('getSafeName', () => {
  expect(getSafeName('')).toBe('');
  expect(getSafeName('react')).toBe('react');
  expect(getSafeName('react-query')).toBe('reactQuery');
  expect(getSafeName('@org/ui-lib')).toBe('org__uiLib');
});
