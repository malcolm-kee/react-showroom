import { noop } from '@showroomjs/core';
import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

export type PlayFunction = (data: {
  canvasElement: HTMLDivElement;
}) => void | Promise<void>;

export interface PlayScenario {
  name: string;
  run: PlayFunction;
}

export interface PlayContextType {
  scenarios: Array<PlayScenario>;
  currentScenario: string | undefined;
  startPlay: (scenarioName: string) => void;
  donePlay: (scenarioName: string) => void;
}

export const PlayContext = createNameContext<PlayContextType>('PlayContext', {
  scenarios: [],
  currentScenario: undefined,
  startPlay: noop,
  donePlay: noop,
});

export const usePlayContext = () => React.useContext(PlayContext);

export interface PlayContextState {
  scenarios: Array<PlayScenario>;
  currentScenario: string | undefined;
}

export type PlayContextEvent =
  | {
      type: 'setScenarios';
      scenarios: Array<PlayScenario>;
    }
  | {
      type: 'startScenario';
      scenarioName: string;
    }
  | {
      type: 'doneScenario';
      scenarioName: string;
    };

const playStateReducer = (
  state: PlayContextState,
  event: PlayContextEvent
): PlayContextState => {
  switch (event.type) {
    case 'setScenarios':
      return {
        scenarios: event.scenarios,
        currentScenario: undefined,
      };

    case 'startScenario':
      return {
        ...state,
        currentScenario: event.scenarioName,
      };

    case 'doneScenario': {
      if (state.currentScenario !== event.scenarioName) {
        return state;
      }
      return {
        ...state,
        currentScenario: undefined,
      };
    }

    default:
      return state;
  }
};

export const InteractionProvider = (props: {
  children: React.ReactNode;
  scenarios: Array<PlayScenario>;
}) => {
  const [state, dispatch] = React.useReducer(playStateReducer, {
    scenarios: props.scenarios,
    currentScenario: undefined,
  });

  return (
    <PlayContext.Provider
      value={React.useMemo(
        () => ({
          ...state,
          startPlay: (scenarioName) =>
            dispatch({
              type: 'startScenario',
              scenarioName,
            }),
          donePlay: (scenarioName) =>
            dispatch({
              type: 'doneScenario',
              scenarioName,
            }),
        }),
        [state]
      )}
    >
      {props.children}
    </PlayContext.Provider>
  );
};
