import { Route, RouteProps } from '@showroomjs/bundles/routing';
import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const SubRootContext = createNameContext<string>('ShowroomSubRoot', '');

export interface SubRootRouteProps extends RouteProps {
  path: string;
}

export const SubRootRoute = (props: SubRootRouteProps) => (
  <SubRootContext.Provider value={props.path}>
    <Route {...props} />
  </SubRootContext.Provider>
);

export const useSubRoot = () => React.useContext(SubRootContext);
