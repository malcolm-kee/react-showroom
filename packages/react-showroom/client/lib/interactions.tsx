import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';
import { basename } from './config';

export interface InteractionsContextType {
  testMap?: Record<string, string>;
  componentId: string;
}

export const InteractionsContext = createNameContext<InteractionsContextType>(
  'InteractionsContext',
  { componentId: '' }
);

export const useInteractions = (interactionName: string) => {
  const context = React.useContext(InteractionsContext);

  const testId = context.testMap && context.testMap[interactionName];

  return testId
    ? {
        ...context,
        testId,
      }
    : undefined;
};

export const getInteractionBlockUrl = (data: {
  componentId: string;
  testId: string;
}) => `${basename}/_interaction/${data.componentId}/${data.testId}`;
