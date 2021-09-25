import * as React from 'react';

const SuspenseComponent = import.meta.env.SSR
  ? function FakeSuspense(props: { children: React.ReactNode }) {
      return <React.Fragment>{props.children}</React.Fragment>;
    }
  : React.Suspense;

export const Suspense = SuspenseComponent;

export const factoryMap = new Map<
  Parameters<typeof React['lazy']>[0],
  React.ComponentType<any> | undefined
>();

export const lazy: typeof React.lazy = import.meta.env.SSR
  ? function ssrLazy(factory) {
      factoryMap.set(factory, undefined);

      return React.forwardRef(function LazyComponent(props, ref) {
        const LoadedComponent = factoryMap.get(factory);

        return LoadedComponent ? (
          <LoadedComponent {...props} ref={ref} />
        ) : null;
      }) as any;
    }
  : React.lazy;
