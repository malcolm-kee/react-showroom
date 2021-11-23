import { createSymbol } from './symbol';

test('createSymbol', () => {
  expect(createSymbol('foo')).not.toBe(createSymbol('foo'));
});
