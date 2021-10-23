import { SupportedLanguage } from '@showroomjs/core';
import { css, styled } from '@showroomjs/ui';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { EXAMPLE_WIDTHS } from '../lib/config';
import { CodePreviewIframe } from './code-preview-iframe';

export interface StandaloneCodeLiveEditorPreviewListProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  isCommenting: boolean;
  onClickCommentPoint: (coordinate: { x: number; y: number }) => void;
  hiddenSizes: Array<number>;
  fitHeight: boolean;
  zoom: string;
  children?: React.ReactNode;
}

export const StandaloneCodeLiveEditorPreviewList = React.forwardRef<
  HTMLUListElement,
  StandaloneCodeLiveEditorPreviewListProps
>(function StandaloneCodeLiveEditorPreviewList(props, forwardedRef) {
  const zoomValue = React.useMemo(() => Number(props.zoom), [props.zoom]);
  const shouldAdjustZoom = !isNaN(zoomValue) && zoomValue !== 100;

  const content = EXAMPLE_WIDTHS.map((width) =>
    props.hiddenSizes.includes(width) ? null : (
      <ScreenWrapper isCommenting={props.isCommenting} key={width}>
        <Screen
          css={{
            width: `${
              shouldAdjustZoom ? Math.round((width * zoomValue) / 100) : width
            }px`,
          }}
        >
          <CodePreviewIframe
            code={props.code}
            lang={props.lang}
            codeHash={props.codeHash}
            css={{
              width: `${width}px`,
              ...(shouldAdjustZoom
                ? {
                    transform: `scale(${zoomValue / 100})`,
                    transformOrigin: 'top left',
                  }
                : {}),
            }}
          />
        </Screen>
        <ScreenSize>{width}px</ScreenSize>
      </ScreenWrapper>
    )
  );

  const rootProps = {
    className: resizeStyle({
      isCommenting: props.isCommenting,
    }),
    onMouseDown: props.isCommenting
      ? (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
          props.onClickCommentPoint({
            x: ev.pageX,
            y: ev.pageY,
          });
        }
      : undefined,
  };

  return props.fitHeight ? (
    <ScreenList {...rootProps} ref={forwardedRef}>
      {content}
      {props.children}
    </ScreenList>
  ) : (
    <Resizable enable={resizeEnable} as="ul" {...rootProps}>
      {content}
      {props.children}
    </Resizable>
  );
});

const resizeEnable: ResizeEnable = {
  top: false,
  right: false,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

const ScreenList = styled('ul', {
  flex: 1,
});

const resizeStyle = css({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  gap: '$3',
  paddingTop: '$3',
  paddingBottom: '$6',
  px: '$3',
  backgroundColor: '$gray-200',
  position: 'relative',
  variants: {
    isCommenting: {
      true: {
        color: '$gray-300',
        cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E"), auto`,
      },
    },
  },
});

const ScreenSize = styled('div', {
  px: '$2',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-500',
});

const Screen = styled('div', {
  shadow: 'sm',
  backgroundColor: 'White',
  transition: 'box-shadow 100ms ease-in-out',
  height: '100%',
  overflow: 'hidden',
});

const ScreenWrapper = styled('li', {
  [`&:hover ${ScreenSize}`]: {
    color: 'Black',
    fontWeight: '500',
  },
  [`&:hover ${Screen}`]: {
    shadow: 'lg',
  },
  variants: {
    isCommenting: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});
