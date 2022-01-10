import { XIcon } from '@heroicons/react/outline';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { icons, styled, keyframes } from '../stitches.config';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, 20%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, 0%) scale(1)' },
});

const Overlay = styled(DialogPrimitive.Overlay, {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const Content = styled(DialogPrimitive.Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  overflow: 'hidden',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '10vh',
  left: '50%',
  transform: 'translate(-50%, 0%)',
  width: '90vw',
  maxWidth: '600px',
  maxHeight: '85vh',
  overflowY: 'auto',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'transform',
  },
  '&:focus': { outline: 'none' },
  variants: {
    fullWidth: {
      true: {
        maxWidth: 'none',
      },
    },
  },
});

const Close = styled(DialogPrimitive.Close, {
  position: 'absolute',
  top: 10,
  right: 10,
});

export interface DialogProps extends DialogPrimitive.DialogProps {
  children: React.ReactNode;
}

export const DialogImpl = ({ children, ...props }: DialogProps) => (
  <DialogPrimitive.Root {...props}>
    <Overlay />
    {children}
  </DialogPrimitive.Root>
);

export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  children: React.ReactNode;
  showCloseBtn?: boolean;
  fullWidth?: boolean;
}

const DialogContent = styled(
  React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
    { children, showCloseBtn = true, ...props },
    ref
  ) {
    return (
      <Content {...props} ref={ref}>
        {children}
        {showCloseBtn && (
          <Close>
            <XIcon width={24} height={24} className={icons()} />
          </Close>
        )}
      </Content>
    );
  })
);

export const Dialog = Object.assign(DialogImpl, {
  Content: DialogContent,
  Trigger: DialogPrimitive.Trigger,
  Title: styled(DialogPrimitive.Title, {
    fontSize: '$2xl',
    lineHeight: '$2xl',
    paddingLeft: '$3',
    py: '$2',
  }),
  Description: DialogPrimitive.Description,
  Close: DialogPrimitive.Close,
});
