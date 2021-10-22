import { Div } from './base';
import * as React from 'react';

export const StandalonePageContainer = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Div
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      className={props.className}
    >
      {props.children}
    </Div>
  );
};
