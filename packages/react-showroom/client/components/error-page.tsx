import { Alert } from '@showroomjs/ui';
import * as React from 'react';

export const ErrorPage = () => {
  return (
    <div>
      <Alert variant="error">
        Something goes wrong. This is probably a bug in{' '}
        <code>react-showroom</code>.
      </Alert>
    </div>
  );
};
