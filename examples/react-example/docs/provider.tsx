import { rest, setupWorker } from 'msw';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

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

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
