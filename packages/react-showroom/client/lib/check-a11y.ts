import { pick, Queue } from '@showroomjs/core';
import { a11yConfig } from './config';

export async function checkA11y(element: HTMLElement) {
  return checkA11yQueue.queue(element);
}

let _axe: typeof import('axe-core');

async function getAxe() {
  if (_axe) {
    return _axe;
  }
  const axe = await import('axe-core');

  if (a11yConfig) {
    axe.configure(a11yConfig);
  }

  _axe = axe;
  return axe;
}

const checkA11yQueue = new Queue(async function checkA11yImpl(
  element: HTMLElement
) {
  const axe = await getAxe();

  const result = await axe.run(element);

  return pick(result, ['passes', 'violations', 'incomplete']);
});
