import { styled, pulse } from '@showroomjs/ui';
import * as React from 'react';
import { usePropsEditorContext } from '../lib/use-props-editor';
import { PropsEditor } from './props-editor';

export const PropsEditorPanel = ({
  background = 'gray',
}: {
  background?: 'gray' | 'white';
}) => {
  const editor = usePropsEditorContext();

  return (
    <Panel
      css={{
        backgroundColor: background === 'gray' ? '$gray-200' : 'White',
      }}
      loading={!editor}
    >
      {editor ? (
        <PropsEditor editor={editor} />
      ) : (
        <LoadingRoot aria-hidden>
          <LoadingLabel
            css={{
              width: 90,
            }}
          />
          <Control />
          <LoadingLabel />
          <Control css={{ maxWidth: '10rem' }} />
          <LoadingLabel
            css={{
              width: 60,
            }}
          />
          <Control
            css={{
              height: 90,
              maxWidth: 'none',
            }}
          />
          <LoadingLabel />
          <Control />
        </LoadingRoot>
      )}
    </Panel>
  );
};

const Panel = styled('div', {
  shadow: 'inner',
  borderRadius: '$base',
  px: '$2',
  py: '$4',
  variants: {
    loading: {
      true: {
        animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
      },
    },
  },
});

const LoadingRoot = styled('div', {
  display: 'grid',
  alignItems: 'center',
  py: '$1',
  gridTemplateColumns: 'max-content 1fr',
  columnGap: '$2',
  '@sm': {
    gap: '$2',
  },
});

const LoadingLabel = styled('div', {
  backgroundColor: '$gray-300',
  height: '1.5rem',
  width: '105px',
});

const LoadingControl = styled('div', {
  backgroundColor: '$gray-100',
  height: '2rem',
  width: '100%',
  maxWidth: '36rem',
  border: '1px solid $gray-300',
  borderRadius: '$base',
});

const ControlWrapper = styled('div', {
  '@sm': {
    px: '$2',
    py: '$1',
  },
});

const Control = styled(function Control(props: { className?: string }) {
  return (
    <ControlWrapper>
      <LoadingControl {...props} />
    </ControlWrapper>
  );
});
