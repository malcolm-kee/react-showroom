import { Alert } from '@showroomjs/ui';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

export const ErrorFallback = (props: FallbackProps) => {
  return (
    <Alert variant="error">
      {props.error instanceof Error
        ? props.error.message
        : JSON.stringify(props.error)}
    </Alert>
  );
};

export const ErrorBound = (props: { children: React.ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {props.children}
  </ErrorBoundary>
);
