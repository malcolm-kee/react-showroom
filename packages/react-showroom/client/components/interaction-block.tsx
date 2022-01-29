import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { useInteractions } from '../lib/interactions';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { ConsolePanel } from './console-panel';
import { InteractionIframe } from './interaction-iframe';

export interface InteractionBlockProps
  extends React.ComponentPropsWithoutRef<'div'> {
  testName: string;
}

export const InteractionBlock = ({
  testName,
  ...props
}: InteractionBlockProps) => {
  const interaction = useInteractions(testName);

  if (!interaction || !interaction.testId) {
    return null;
  }

  return (
    <div {...props}>
      <Title>{testName}</Title>
      <PreviewConsoleProvider>
        <FrameWrapper>
          <InteractionIframe data={interaction} />
        </FrameWrapper>
        <ConsolePanel />
      </PreviewConsoleProvider>
    </div>
  );
};

const FrameWrapper = styled('div', {
  width: '100%',
  borderLeft: '1px solid $gray-200',
  borderRight: '1px solid $gray-200',
  borderBottom: '1px solid $gray-200',
  roundedB: '$md',
});

const Title = styled('div', {
  px: '$4',
  py: '$3',
  backgroundColor: '$gray-200',
  roundedT: '$md',
  fontSize: '$sm',
  lineHeight: '$sm',
});
