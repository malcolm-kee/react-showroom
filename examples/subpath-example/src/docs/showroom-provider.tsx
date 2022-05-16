import * as React from 'react';
import { config } from 'react-showroom/client';
import { getMockWorker } from '../mocks/mock-worker';

export default function ShowroomProvider(props: { children: React.ReactNode }) {
  React.useEffect(() => {
    const worker = getMockWorker();

    const swUrl = `${config.basename}/mockServiceWorker.js`;

    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: swUrl,
      },
    });

    return () => {
      worker.stop();
    };
  }, []);

  return <>{props.children}</>;
}
