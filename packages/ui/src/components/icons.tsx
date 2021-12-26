import * as React from 'react';

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
