import { decodeDisplayName, encodeDisplayName } from './display-name';

test('encodeDisplayName', () => {
  expect(encodeDisplayName('TextInput')).toBe('-text-input');
  expect(encodeDisplayName('HTMLInput')).toBe('-h-t-m-l-input');
});

['a', 'A', 'TextInput', 'HTMLInput'].forEach((name) => {
  test(`decodeDisplayName - ${name}`, () => {
    expect(decodeDisplayName(encodeDisplayName(name))).toBe(name);
  });
});
