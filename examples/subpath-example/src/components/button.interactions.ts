import { within } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { PlayScenario } from 'react-showroom';

export const buttonScenarios: Array<PlayScenario> = [
  {
    name: 'Click',
    run: ({ canvasElement }) => {
      const canvas = within(canvasElement);

      user.click(canvas.getByRole('button'));
    },
  },
];
