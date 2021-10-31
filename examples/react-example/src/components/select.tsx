import * as React from 'react';

export interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    return <select {...props} ref={ref} />;
  }
);
