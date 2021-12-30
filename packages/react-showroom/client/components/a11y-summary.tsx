import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { pulse, styled, Tooltip } from '@showroomjs/ui';
import * as React from 'react';
import { useA11yResult } from '../lib/use-a11y-result';
import { Span } from './base';

export const A11ySummary = () => {
  const { result, status } = useA11yResult();

  return (
    <Root
      {...(result
        ? {
            'data-a11y-result':
              result.violations.length === 0 ? 'success' : 'failure',
          }
        : {})}
    >
      <Span
        css={{
          px: '$1',
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
      {result ? (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <SummaryText loading={status === 'loading'}>
              <SummaryTextItem>
                {result.passes.length}{' '}
                <SuccessIcon aria-label="passes" width={16} height={16} />
              </SummaryTextItem>
              <SummaryTextItem>
                {result.violations.length}{' '}
                <DangerIcon aria-label="violations" width={16} height={16} />
              </SummaryTextItem>
              <SummaryTextItem>
                {result.incomplete.length}{' '}
                <UnknownIcon aria-label="incompletes" width={16} height={16} />
              </SummaryTextItem>
            </SummaryText>
          </Tooltip.Trigger>
          <Tooltip.Content>
            {result.passes.length} passes, {result.violations.length}{' '}
            violations, {result.incomplete.length} incompletes
          </Tooltip.Content>
        </Tooltip.Root>
      ) : (
        <SummaryText loading={status === 'loading'}>
          <SummaryTextItem>
            ? <SuccessIcon aria-label="passes" width={16} height={16} />
          </SummaryTextItem>
          <SummaryTextItem>
            ? <DangerIcon aria-label="violations" width={16} height={16} />
          </SummaryTextItem>
          <SummaryTextItem>
            ? <UnknownIcon aria-label="incompletes" width={16} height={16} />
          </SummaryTextItem>
        </SummaryText>
      )}
    </Root>
  );
};

const Root = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  color: '$gray-500',
  fontSize: '$sm',
  lineHeight: '$sm',
  px: '$2',
  borderRight: '1px solid $gray-300',
});

const SummaryText = styled('div', {
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
