import {
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import * as Announce from '@radix-ui/react-announce';
import { css, styled } from '../stitches.config';
import { Div, text } from './base';

export interface AlertProps {
  variant: 'error' | 'success' | 'info' | 'warning';
  children: React.ReactNode;
}

export function Alert(props: AlertProps) {
  const Icon = iconMap[props.variant];
  return (
    <Root role="alert" variant={props.variant}>
      <Div
        css={{
          flexShrink: '0',
        }}
      >
        <Icon className={iconClass({ variant: props.variant })} />
      </Div>
      <Div css={{ whiteSpace: 'pre-wrap' }} className={text({ variant: 'sm' })}>
        {props.children}
      </Div>
    </Root>
  );
}

const iconMap = {
  error: XCircleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationIcon,
};

const iconClass = css({
  width: '1.25rem',
  height: '1.25rem',
  variants: {
    variant: {
      error: {
        color: '$red-400',
      },
      success: {
        color: '$green-400',
      },
      info: {
        color: '$blue-400',
      },
      warning: {
        color: '$yellow-400',
      },
    },
  },
});

const Root = styled(Announce.Root, {
  borderRadius: '$md',
  padding: '$4',
  display: 'flex',
  gap: '$3',
  variants: {
    variant: {
      success: {
        backgroundColor: '$green-50',
        color: '$green-800',
      },
      error: {
        backgroundColor: '$red-50',
        color: '$red-800',
      },
      info: {
        backgroundColor: '$blue-50',
        color: '$blue-800',
      },
      warning: {
        backgroundColor: '$yellow-60',
        color: '$yellow-800',
      },
    },
  },
});
