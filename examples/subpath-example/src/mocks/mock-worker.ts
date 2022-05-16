import { rest, setupWorker, SetupWorkerApi } from 'msw';

let _worker: SetupWorkerApi;

export const getMockWorker = () => {
  if (!_worker) {
    _worker = setupWorker(
      rest.get(/\/hello/, (_, res, ctx) => res(ctx.json({ message: 'world' })))
    );
  }

  return _worker;
};
