import { noop } from '@showroomjs/core';
import { createNameContext, useStableCallback } from '@showroomjs/ui';
import type { AxeResults } from 'axe-core';
import * as React from 'react';

export type A11yResult = Pick<
  AxeResults,
  'incomplete' | 'passes' | 'violations'
>;

export type A11yCheckStatus = 'idle' | 'loading' | 'success';

export interface A11yResultContextType {
  result: A11yResult | undefined;
  setResult: (result: A11yResult) => void;
  status: A11yCheckStatus;
  setStatus: (s: A11yCheckStatus) => void;
}

const A11yResultContext = createNameContext<A11yResultContextType>(
  'A11yResultContext',
  {
    result: undefined,
    setResult: noop,
    status: 'idle',
    setStatus: noop,
  }
);

export const useA11yResult = () => React.useContext(A11yResultContext);

const isEqualLength = <T extends unknown>(arr1: T[], arr2: T[]) =>
  arr1.length === arr2.length;

const keys = ['violations', 'passes', 'incomplete'] as const;

const isDifferentResult = (result1: A11yResult, result2: A11yResult) => {
  if (keys.some((key) => !isEqualLength(result1[key], result2[key]))) {
    return true;
  }

  if (
    keys.some((key) =>
      result1[key].some(
        (v, i) => !isEqualLength(v.nodes, result2[key][i].nodes)
      )
    )
  ) {
    return true;
  }

  return false;
};

export const A11yResultContextProvider = (props: {
  children: React.ReactNode;
  result?: A11yResult;
  onResultChange?: (result: A11yResult) => void;
}) => {
  const [result, setResult] = React.useState<A11yResult | undefined>(
    props.result
  );
  const [status, setStatus] = React.useState<A11yCheckStatus>('idle');
  const onChange = useStableCallback(props.onResultChange);

  const usedResult = props.result || result;

  return (
    <A11yResultContext.Provider
      value={React.useMemo(
        () => ({
          result: usedResult,
          setResult: function (newResult) {
            if (
              newResult &&
              (!result || isDifferentResult(result, newResult))
            ) {
              setResult(newResult);
              onChange(newResult);
              setStatus('success');
            }
          },
          status,
          setStatus,
        }),
        [usedResult, status]
      )}
    >
      {props.children}
    </A11yResultContext.Provider>
  );
};

export interface A11yResultByFrameContextType {
  resultByFrameName: Record<string, A11yResult | undefined>;
  setResult: (frameName: string, result: A11yResult) => void;
}

const A11yResultByFrameContext =
  createNameContext<A11yResultByFrameContextType>('A11yResultByFrameContext', {
    resultByFrameName: {},
    setResult: noop,
  });

export const A11yResultByFrameContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [resultByFrameName, setResultByFrameName] = React.useState<
    Record<string, A11yResult | undefined>
  >({});

  return (
    <A11yResultByFrameContext.Provider
      value={React.useMemo(
        () => ({
          resultByFrameName,
          setResult(frameName, result) {
            setResultByFrameName((prev) => ({
              ...prev,
              [frameName]: result,
            }));
          },
        }),
        [resultByFrameName]
      )}
    >
      {props.children}
    </A11yResultByFrameContext.Provider>
  );
};

export const useA11yResultByFrame = () =>
  React.useContext(A11yResultByFrameContext);
