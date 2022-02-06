import { useQuery } from '@showroomjs/bundles/query';
import { listenForConsole } from '@showroomjs/ui';
import * as React from 'react';
import testMap from 'react-showroom-tests';
import Wrapper from 'react-showroom-wrapper';
import { ErrorPage } from '../components/error-page';
import { useInteractionWindow } from '../lib/frame-message';
import { Route, Routes, useParams } from '../lib/routing';
import { useHeightChange } from '../lib/use-height-change';

export const InteractionApp = () => {
  return (
    <Wrapper>
      <Routes>
        <Route path="/:componentId/:testId" element={<InteractionPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Wrapper>
  );
};

const InteractionPage = () => {
  const params = useParams<{
    componentId: string;
    testId: string;
  }>();

  useQuery(
    ['interactions', params.componentId],
    () => {
      const getFn = params.componentId && testMap[params.componentId];

      return getFn ? getFn() : undefined;
    },
    {
      onSuccess: (data) => {
        if (data && params.testId && data[params.testId]) {
          data[params.testId]();
        }
      },
      enabled: !!params.componentId,
    }
  );

  const { sendParent } = useInteractionWindow(() => {});

  useHeightChange(
    typeof window === 'undefined' ? null : window.document.documentElement,
    (height) =>
      sendParent({
        type: 'heightChange',
        height,
      })
  );

  React.useEffect(() => {
    const { cleanup, events } = listenForConsole();

    events.on('invoke', (ev) => {
      sendParent({
        type: 'log',
        level: ev.method,
        data: ev.data,
      });
    });

    return cleanup;
  }, []);

  return null;
};
