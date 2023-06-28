import { FrameDimension } from '@showroomjs/core';
import { Breadcrumbs, tw } from '@showroomjs/ui';
import * as React from 'react';
import { CodeFrameContextProvider } from '../lib/code-frame-context';
import { useComponentMeta } from '../lib/component-props-context';
import { lazy } from '../lib/lazy';
import { useSize } from '../lib/use-size';

const StandaloneEditor = lazy(() => import('./standalone-editor-lazy'));

export const ComponentDocStandaloneEditor = (props: {
  showDeviceFrame: boolean;
  codeFrameDimensions: Array<FrameDimension>;
}) => {
  const componentMetadata = useComponentMeta();

  const breadcrumbRef = React.useRef<HTMLElement>(null);

  const breadcrumbSize = useSize(breadcrumbRef);

  const variables = breadcrumbSize
    ? ({
        '--breadcrumb-height': `${breadcrumbSize.height}px`,
      } as React.CSSProperties)
    : undefined;

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: componentMetadata ? componentMetadata.displayName : '??',
            url: '../',
          },
          {
            label: 'Example',
          },
        ]}
        ref={breadcrumbRef}
      />
      <div className={tw(['flex-1'])} style={variables}>
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
      </div>
    </>
  );
};
