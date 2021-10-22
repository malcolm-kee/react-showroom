import { Div } from './base';
import * as React from 'react';

export const StandalonePageContainer = (props: {
  children: React.ReactNode;
}) => {
  return (
    <Div
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 62px)',
      }}
    >
      {props.children}
    </Div>
  );
};
