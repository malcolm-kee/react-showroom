import { pick } from '@showroomjs/core';
import { a11yConfig } from './config';

export async function checkA11y(element: HTMLElement) {
  return checkA11yQueue.queue(element);
}

type QueueOperation<Params extends any[], Result> = (
  ...params: Params
) => Promise<Result>;

class Queue<Params extends any[], Result> {
  private executor: QueueOperation<Params, Result>;
  private items: Array<() => Promise<Result>> = [];
  private executing = false;

  constructor(executor: QueueOperation<Params, Result>) {
    this.executor = executor;
  }

  queue(...params: Params): Promise<Result> {
    const result = new Promise<Result>((fulfill) => {
      const action = () =>
        this.executor(...params).then((result) => {
          fulfill(result);
          return result;
        });

      this.items.unshift(action);
    });

    this.execute();

    return result;
  }

  private execute() {
    if (this.executing) {
      return;
    }
    const action = this.items.pop();
    if (action) {
      this.executing = true;
      const onDone = () => {
        this.executing = false;
        this.execute();
      };
      action().then(onDone).catch(onDone);
    }
  }
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

async function checkA11yImpl(element: HTMLElement) {
  const axe = await getAxe();

  const result = await axe.run(element);

  return pick(result, ['passes', 'violations', 'incomplete']);
}

const checkA11yQueue = new Queue(checkA11yImpl);
