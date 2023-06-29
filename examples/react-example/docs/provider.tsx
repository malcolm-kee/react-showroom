import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest, setupWorker } from 'msw';
import * as React from 'react';

declare const tailwind: any;

if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    corePlugins: {
      preflight: false,
    },
  };
}

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
