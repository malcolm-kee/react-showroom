import { noop } from '@showroomjs/core';
import { DropdownMenu } from '@showroomjs/ui';
import * as React from 'react';
import { usePlayContext } from '../play';

export const PlayMenu = (props: {
  rootRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) => {
  const { scenarios, startPlay, donePlay } = usePlayContext();

  if (scenarios.length === 0) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenu.Trigger>{props.children}</DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {scenarios.map((scenario) => (
          <DropdownMenu.Item
            onSelect={() => {
              if (props.rootRef.current) {
                startPlay(scenario.name);
                Promise.resolve(
                  scenario.run({ canvasElement: props.rootRef.current })
                )
                  .catch(noop)
                  .then(() => donePlay(scenario.name));
              }
            }}
            key={scenario.name}
          >
            {scenario.name}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
