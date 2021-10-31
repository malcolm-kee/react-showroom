import { isDefined } from '@showroomjs/core';
import * as React from 'react';
import { createNameContext } from './create-named-context';

const IsClientContext = createNameContext<boolean | undefined>(
  'IsClient',
  undefined
);

export const IsClientContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <IsClientContext.Provider value={isClient}>
      {props.children}
    </IsClientContext.Provider>
  );
};

export const useIsClient = (): boolean => {
  const isClient = React.useContext(IsClientContext);

  if (!isDefined(isClient)) {
    throw new Error('useIsClient must be used within IsClientContextProvider!');
  }

  return isClient;
};
