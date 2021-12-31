import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { pulse, styled, TextTooltip } from '@showroomjs/ui';
import * as React from 'react';
import { useA11yResult } from '../lib/use-a11y-result';
import { Span } from './base';

export const A11ySummary = styled(function A11ySummary(
  props: React.ComponentPropsWithoutRef<'button'>
) {
  const { result, status } = useA11yResult();

  return (
    <TextTooltip
      label={
        result
          ? `${result.violations.length} violations, ${result.passes.length} passes, ${result.incomplete.length} incompletes`
          : 'Loading...'
      }
    >
      <Root
        {...props}
        {...(result
          ? {
              'data-a11y-result':
                result.violations.length === 0 ? 'success' : 'failure',
            }
          : {})}
      >
        <Span
          css={{
            paddingRight: '$1',
          }}
        >
          <Span
            css={{
              srOnly: true,
              '@sm': {
                srOnly: false,
              },
            }}
          >
            Accessibility
          </Span>
          <Span
            css={{
              '@sm': {
                display: 'none',
              },
            }}
          >
            ♿️
          </Span>
        </Span>
        <SummaryText loading={status === 'loading'}>
          <SummaryTextItem>
            {result ? result.violations.length : '?'}{' '}
            <DangerIcon aria-label="violations" width={16} height={16} />
          </SummaryTextItem>
          <SummaryTextItem>
            {result ? result.passes.length : '?'}{' '}
            <SuccessIcon aria-label="passes" width={16} height={16} />
          </SummaryTextItem>
          <SummaryTextItem>
            {result ? result.incomplete.length : '?'}{' '}
            <UnknownIcon aria-label="incompletes" width={16} height={16} />
          </SummaryTextItem>
        </SummaryText>
      </Root>
    </TextTooltip>
  );
});

const Root = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  color: '$gray-500',
  fontSize: '$sm',
  lineHeight: '$sm',
  border: 0,
});

const SummaryText = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$1',
  variants: {
    loading: {
      true: {
        animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
      },
    },
  },
});

const SummaryTextItem = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
});

const SuccessIcon = styled(CheckCircleIcon, {
  color: '$green-500',
  width: 16,
  height: 16,
});

const DangerIcon = styled(XCircleIcon, {
  color: '$red-500',
  width: 16,
  height: 16,
});

const UnknownIcon = styled(QuestionMarkCircleIcon, {
  color: '$yellow-500',
  width: 16,
  height: 16,
});
