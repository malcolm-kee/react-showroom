import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import { TextTooltip, tw } from '@showroomjs/ui';
import * as React from 'react';
import { useA11yResult } from '../lib/use-a11y-result';

export function A11ySummary(props: React.ComponentPropsWithoutRef<'button'>) {
  const { result, status } = useA11yResult();

  return (
    <TextTooltip
      label={
        result
          ? `${result.violations.length} violations, ${result.passes.length} passes, ${result.incomplete.length} incompletes`
          : 'Loading...'
      }
    >
      <button
        type="button"
        {...props}
        {...(result
          ? {
              'data-a11y-result':
                result.violations.length === 0 ? 'success' : 'failure',
            }
          : {})}
        className={tw(
          [
            'inline-flex items-center text-sm text-zinc-500 bg-inherit cursor-pointer border-0',
          ],
          [props.className]
        )}
      >
        <span className={tw(['pr-1'])}>
          <span className={tw(['sr-only sm:not-sr-only'])}>Accessibility</span>
          <span className={tw(['sm:hidden'])}>♿️</span>
        </span>
        <span
          className={tw([
            'inline-flex items-center gap-1',
            status === 'loading' && 'animate-pulse',
          ])}
        >
          <SummaryTextItem>
            {result ? result.violations.length : '?'}{' '}
            <XCircleIcon
              aria-label="violations"
              width={16}
              height={16}
              className={tw(['text-red-500 w-4 h-4'])}
            />
          </SummaryTextItem>
          <SummaryTextItem>
            {result ? result.passes.length : '?'}{' '}
            <CheckCircleIcon
              aria-label="passes"
              width={16}
              height={16}
              className={tw(['text-green-500 w-4 h-4'])}
            />
          </SummaryTextItem>
          <SummaryTextItem>
            {result ? result.incomplete.length : '?'}{' '}
            <QuestionMarkCircleIcon
              aria-label="incompletes"
              width={16}
              height={16}
              className={tw(['text-yellow-500 w-4 h-4'])}
            />
          </SummaryTextItem>
        </span>
      </button>
    </TextTooltip>
  );
}

const SummaryTextItem = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={tw(['inline-flex items-center'], [props.className])}
  />
);
