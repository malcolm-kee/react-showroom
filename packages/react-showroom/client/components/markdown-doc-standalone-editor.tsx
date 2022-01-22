import type { FrameDimension } from '@showroomjs/core';
import { Breadcrumbs } from '@showroomjs/ui';
import * as React from 'react';
import { CodeFrameContextProvider } from '../lib/code-frame-context';
import { lazy } from '../lib/lazy';

const StandaloneEditor = lazy(() => import('./standalone-editor-lazy'));

export const MarkdownDocStandaloneEditor = (props: {
  showDeviceFrame: boolean;
  codeFrameDimensions: Array<FrameDimension>;
  rootTitle: string;
}) => {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: props.rootTitle,
            url: '..',
          },
          {
            label: 'Example',
          },
        ]}
      />
      <CodeFrameContextProvider
        value={React.useMemo(
          () => ({
            showDeviceFrame: props.showDeviceFrame,
            frameDimensions: props.codeFrameDimensions,
          }),
          [props.showDeviceFrame, props.codeFrameDimensions]
        )}
      >
        <StandaloneEditor />
      </CodeFrameContextProvider>
    </>
  );
};
