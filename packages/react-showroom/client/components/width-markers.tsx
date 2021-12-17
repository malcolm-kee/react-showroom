import * as React from 'react';
import { styled, Tooltip } from '@showroomjs/ui';
import { EXAMPLE_DIMENSIONS } from '../lib/config';

export const WidthMarkers = (props: {
  children: React.ReactNode;
  currentWidth?: number;
}) =>
  EXAMPLE_DIMENSIONS.length > 1 ? (
    <Root>
      {props.children}
      <MarkerContainer>
        {EXAMPLE_DIMENSIONS.map((d) => {
          const active = props.currentWidth === d.width;

          return (
            <Tooltip.Root open={active || undefined} key={d.name}>
              <Tooltip.Trigger asChild>
                <Marker
                  css={{
                    left: d.width - 4,
                  }}
                  active={active}
                />
              </Tooltip.Trigger>
              <Tooltip.Content side="top">
                {d.name} ({d.width}px)
              </Tooltip.Content>
            </Tooltip.Root>
          );
        })}
      </MarkerContainer>
    </Root>
  ) : (
    <>{props.children}</>
  );

const Root = styled('div', {
  position: 'relative',
});

const MarkerContainer = styled('div', {
  position: 'absolute',
  left: 0,
  right: 0,
  top: -5,
  height: 5,
  overflow: 'hidden',
});

const Marker = styled('div', {
  position: 'absolute',
  width: 0,
  height: 0,
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $gray-400',
  variants: {
    active: {
      true: {
        borderTop: '5px solid $primary-500',
      },
    },
  },
});

export const useActiveWidth = () => {
  const [activeWidth, setActiveWidth] = React.useState<number | undefined>(
    undefined
  );

  return [
    activeWidth,
    function setValue(value: number | undefined) {
      if (!value) {
        setActiveWidth(undefined);
      }

      const matched = EXAMPLE_DIMENSIONS.some((d) => d.width === value);

      if (matched) {
        setActiveWidth(value);
      } else {
        if (activeWidth) {
          setActiveWidth(undefined);
        }
      }
    },
  ] as const;
};
