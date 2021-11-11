import { CheckIcon, MinusIcon } from '@heroicons/react/solid';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { styled } from '../stitches.config';

const StyledRoot = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'white',
  width: 16,
  height: 16,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid $gray-300',
  '&:focus': {
    outline: '1px solid $primary-300',
    outlineOffset: 2,
  },
});

const Indicator = styled(CheckboxPrimitive.Indicator, {
  color: 'white',
  lineHeight: 0,
});

export type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof StyledRoot>,
  'children' | 'asChild' | 'checked'
> & {
  checked: CheckboxPrimitive.CheckedState;
};

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => (
    <StyledRoot
      {...props}
      css={
        props.checked === true
          ? {
              backgroundColor: '$primary-600',
              borderColor: '$primary-600',
            }
          : undefined
      }
      ref={ref}
    >
      <Indicator>
        {props.checked === 'indeterminate' && (
          <DashIcon width={16} height={16} />
        )}
        {props.checked === true && <CheckIcon width={16} height={16} />}
      </Indicator>
    </StyledRoot>
  )
);

const DashIcon = styled(MinusIcon, {
  color: '$primary-500',
});
