import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { useParentWindow } from '../lib/frame-message';
import {
  getInteractionBlockUrl,
  InteractionsContextType,
} from '../lib/interactions';
import { useConsole } from '../lib/use-preview-console';

export const InteractionIframe = (props: {
  data: InteractionsContextType & { testId: string };
}) => {
  const previewConsole = useConsole();
  const [frameHeight, setFrameHeight] = React.useState(100);

  const { targetRef } = useParentWindow((ev) => {
    switch (ev.type) {
      case 'log':
        previewConsole[ev.level](...(ev.data || []));
        return;

      case 'heightChange':
        setFrameHeight(ev.height);
        return;

      default:
        break;
    }
  });

  return (
    <Frame
      src={getInteractionBlockUrl(props.data)}
      title="Interaction block"
      css={{
        height: frameHeight,
      }}
      ref={targetRef}
    />
  );
};

const Frame = styled('iframe', {
  width: '100%',
  border: 0,
  transition: 'height 300ms ease-in-out',
});
