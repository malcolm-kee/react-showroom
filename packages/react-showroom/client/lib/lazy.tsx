import * as React from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';

export const Suspense = React.Suspense;

export const factoryMap = new Map<
  Parameters<typeof React['lazy']>[0],
  React.ComponentType<any> | undefined
>();

export const lazy: typeof React.lazy | typeof lazyWithPreload = process.env.SSR
  ? function ssrLazy(factory) {
      factoryMap.set(factory, undefined);

      return React.forwardRef(function LazyComponent(props, ref) {
        const LoadedComponent = factoryMap.get(factory);

        return LoadedComponent ? (
          <LoadedComponent {...props} ref={ref} />
        ) : null;
      }) as any;
    }
  : lazyWithPreload; // we don't use React.lazy because merely call dynamic import will still cause React to suspend.
