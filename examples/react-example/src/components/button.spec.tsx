import { render } from '@testing-library/react';
import { Button } from './button';

describe('<Button />', () => {
  it('works', () => {
    render(<Button>Hello</Button>);
  });
});
