import { render, screen } from '@testing-library/react';
import { Button } from './button';

test('Button defined', () => {
  expect(Button).toBeDefined();
});

describe('<Button />', () => {
  it('works', () => {
    render(<Button>Hello</Button>);
    expect(screen.getByText('Hello')).toBeVisible();
  });
});
