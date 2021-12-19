import { FrameDimension } from '@showroomjs/core';
import { Breadcrumbs } from '@showroomjs/ui';
import * as React from 'react';
import { CodeFrameContextProvider } from '../lib/code-frame-context';
import { useComponentMeta } from '../lib/component-props-context';
import { useExampleRoot } from '../lib/example-root-context';
import { lazy } from '../lib/lazy';
import { Div } from './base';

const StandaloneEditor = lazy(() => import('./standalone-editor-lazy'));

export const ComponentDocStandaloneEditor = (props: {
  showDeviceFrame: boolean;
  codeFrameDimensions: Array<FrameDimension>;
}) => {
  const exampleRoot = useExampleRoot();
  const componentMetadata = useComponentMeta();

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: componentMetadata ? componentMetadata.displayName : '??',
            url: exampleRoot,
          },
          {
            label: 'Example',
          },
        ]}
      />
      <Div css={{ flex: 1 }}>
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
      </Div>
    </>
  );
};
