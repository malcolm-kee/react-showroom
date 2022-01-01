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
  donePlay: () => void;
}

export const PlayContext = createNameContext<PlayContextType>('PlayContext', {
  scenarios: [],
  currentScenario: undefined,
  startPlay: () => {},
  donePlay: () => {},
});

export const usePlayContext = () => React.useContext(PlayContext);

export const PlayContextProvider = PlayContext.Provider;
