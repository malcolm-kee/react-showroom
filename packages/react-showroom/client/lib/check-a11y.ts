import { pick } from '@showroomjs/core';
import { a11yConfig } from './config';

export async function checkA11y(element: HTMLElement) {
  const axe = await import('axe-core');

  if (a11yConfig) {
    axe.configure(a11yConfig);
  }

  const result = await axe.run(element);

  return pick(result, ['passes', 'violations', 'incomplete']);
}
