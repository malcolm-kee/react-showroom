type QueueOperation<Params extends any[], Result> = (
  ...params: Params
) => Promise<Result>;

export class Queue<Params extends any[], Result> {
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
