import * as React from 'react';
import { isDefined } from '@showroomjs/core';
import { styled, Tooltip } from '@showroomjs/ui';
import { EXAMPLE_DIMENSIONS } from '../lib/config';

export const WidthMarkers = (props: {
  children: React.ReactNode;
  onMarkerClick?: (width: number) => void;
  currentWidth?: number;
}) =>
  EXAMPLE_DIMENSIONS.length > 1 ? (
    <Root>
      {props.children}
      <MarkerContainer>
        {EXAMPLE_DIMENSIONS.map((d) => {
          const active = props.currentWidth === d.width;

          const widthLabel = `${d.width}px`;

          return (
            <Tooltip.Root open={active || undefined} key={d.name}>
              <Tooltip.Trigger asChild>
                <Marker
                  css={{
                    left: d.width - 4,
                    cursor:
                      isDefined(props.currentWidth) || !props.onMarkerClick
                        ? 'default'
                        : 'pointer',
                  }}
                  onClick={() => {
                    if (props.onMarkerClick) {
                      props.onMarkerClick(d.width);
                    }
                  }}
                >
                  <MarkerTriangle active={active} />
                </Marker>
              </Tooltip.Trigger>
              <Tooltip.Content side="top">
                {d.name} {d.name !== widthLabel ? `(${widthLabel})` : null}
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
  top: -10,
  height: 10,
  overflow: 'hidden',
});

const MarkerTriangle = styled('span', {
  display: 'block',
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

const Marker = styled('div', {
  display: 'block',
  appearance: 'none',
  position: 'absolute',
  width: 10,
  height: 10,
  paddingTop: 5,
  '&:active': {
    top: 1,
  },
  [`&:active ${MarkerTriangle}`]: {
    borderTop: '5px solid $primary-500',
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
