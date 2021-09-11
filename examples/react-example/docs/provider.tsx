import { rest, setupWorker } from 'msw';
import * as React from 'react';

export default function ShowroomProvider(props: { children: React.ReactNode }) {
  React.useEffect(() => {
    const worker = setupWorker(
      rest.get('/hello', (_, res, ctx) =>
        res(
          ctx.json({
            ok: true,
            message: 'Result intercepted by msw!',
          })
        )
      )
    );

    worker.start({
      onUnhandledRequest: 'bypass',
    });

    return () => {
      worker.stop();
    };
  }, []);

  return <React.Fragment>{props.children}</React.Fragment>;
}
