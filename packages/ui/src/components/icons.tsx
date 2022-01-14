import * as React from 'react';
import { styled } from '../stitches.config';

export const ResizeIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M8 5h2v14H8zM14 5h2v14h-2z"></path>
  </svg>
);

export const EditorRightIcon = (
  props: React.ComponentPropsWithoutRef<'svg'>
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    {...props}
  >
    <path d="M19 4H5a3.003 3.003 0 00-3 3v10a3.003 3.003 0 003 3h14a3.003 3.003 0 003-3V7a3.003 3.003 0 00-3-3zM5 18a1 1 0 01-1-1V7a1 1 0 011-1h11v12z" />
  </svg>
);

export const EditorBottomIcon = (
  props: React.ComponentPropsWithoutRef<'svg'>
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    {...props}
  >
    <path d="M19 4H5a3.003 3.003 0 00-3 3v10a3.003 3.003 0 003 3h14a3.003 3.003 0 003-3V7a3.003 3.003 0 00-3-3zm1 10H4V7a1 1 0 011-1h14a1 1 0 011 1z" />
  </svg>
);

export const SpinIcon = styled(function SpinIcon(
  props: React.ComponentPropsWithoutRef<'svg'>
) {
  return (
    <svg fill="none" viewBox="0 0 24 24" width={24} height={24} {...props}>
      <SpinCircle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></SpinCircle>
      <SpinPath
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></SpinPath>
    </svg>
  );
});

const SpinCircle = styled('circle', {
  opacity: '25%',
});

const SpinPath = styled('path', {
  opacity: '75%',
});
