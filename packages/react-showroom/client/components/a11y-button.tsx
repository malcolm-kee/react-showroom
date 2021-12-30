import { BareButton } from '@showroomjs/ui';
import * as React from 'react';
import { Span } from './base';

export interface A11yButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {}

export const A11yButton = (props: A11yButtonProps) => {
  return (
    <BareButton
      type="button"
      css={{
        fontSize: '$sm',
        lineHeight: '$sm',
        color: '$gray-500',
        fontWeight: '600',
        px: '$1',
        outlineRing: '',
      }}
      {...props}
    >
      <Span
        css={{
          srOnly: true,
          '@sm': {
            srOnly: false,
          },
        }}
      >
        Accessibility
      </Span>
      <Span
        css={{
          '@sm': {
            display: 'none',
          },
        }}
      >
        ♿️
      </Span>
    </BareButton>
  );
};
