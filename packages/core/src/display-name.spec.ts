import { decodeDisplayName, encodeDisplayName } from './display-name';

test('encodeDisplayName', () => {
  expect(encodeDisplayName('TextInput')).toBe('_text_input');
  expect(encodeDisplayName('HTMLInput')).toBe('_h_t_m_l_input');
});

['a', 'A', 'TextInput', 'HTMLInput'].forEach((name) => {
  test(`decodeDisplayName - ${name}`, () => {
    expect(decodeDisplayName(encodeDisplayName(name))).toBe(name);
  });
});
