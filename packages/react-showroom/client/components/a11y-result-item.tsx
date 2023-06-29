import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import { dedupeArray, isDefined } from '@showroomjs/core';
import { Checkbox, Collapsible, tw } from '@showroomjs/ui';
import type { CheckResult, NodeResult, Result } from 'axe-core';
import * as React from 'react';

export const A11yResultItem = (props: {
  result: Result;
  type: 'pass' | 'violation' | 'incomplete';
  highlightedItems: Array<string>;
  setHighlightedItems: React.Dispatch<React.SetStateAction<string[]>>;
  toggleItem: (selector: string) => void;
}) => {
  const icon = iconByType[props.type];

  const [showDetails, setShowDetails] = React.useState(false);

  const result = props.result;

  const allSelectors = React.useMemo(
    () =>
      dedupeArray(result.nodes.map((node) => node.target[0]).filter(isDefined)),
    [result]
  );

  const checkStatus = React.useMemo(
    () =>
      allSelectors.every((s) => props.highlightedItems.includes(s))
        ? true
        : allSelectors.some((s) => props.highlightedItems.includes(s))
        ? 'indeterminate'
        : false,
    [allSelectors, props.highlightedItems]
  );

  return (
    <Root>
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <div className={tw(['flex items-center py-1 pl-1 pr-4'])}>
          <Collapsible.Button
            className={tw([
              'flex-1 flex items-center gap-1 text-left text-zinc-900',
            ])}
          >
            <Collapsible.ToggleIcon
              direction={showDetails ? 'down' : 'right'}
            />
            <span className={tw(['font-normal'])}>{result.help}</span>
            {icon}
          </Collapsible.Button>
          <Checkbox
            checked={checkStatus}
            onCheckedChange={(allChecked) => {
              if (allChecked) {
                props.setHighlightedItems((prev) =>
                  dedupeArray(prev.concat(allSelectors))
                );
              } else {
                props.setHighlightedItems((prev) =>
                  prev.filter((item) => allSelectors.indexOf(item) === -1)
                );
              }
            }}
          />
        </div>
        <Collapsible.Content animate>
          <div className={tw(['pl-7 pr-2 pb-4 text-sm text-zinc-500'])}>
            <Text>
              {result.description}{' '}
              <a
                href={result.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={tw(['text-primary-800 underline'])}
              >
                Learn more
              </a>
            </Text>
            <ol className={tw(['flex flex-col gap-2 list-decimal mt-3'])}>
              {result.nodes.map((n, i) => (
                <li key={i}>
                  <Element
                    element={n}
                    highlighted={
                      n.target[0]
                        ? props.highlightedItems.includes(n.target[0])
                        : false
                    }
                    toggleHighlight={() => {
                      n.target[0] && props.toggleItem(n.target[0]);
                    }}
                  />
                </li>
              ))}
            </ol>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </Root>
  );
};

const Text = (props: React.ComponentPropsWithoutRef<'p'>) => (
  <p {...props} className={tw(['p-0 m-0'], [props.className])} />
);

export const Root = (props: React.ComponentPropsWithoutRef<'li'>) => (
  <li
    {...props}
    className={tw(['py-1 border-b border-zinc-200 last:border-b-0'])}
  />
);

const iconByType = {
  pass: (
    <CheckCircleIcon
      className={tw(['text-green-500 w-4 h-4 flex-shrink-0'])}
      width={16}
      height={16}
    />
  ),
  violation: (
    <XCircleIcon
      className={tw(['text-red-500 w-4 h-4 flex-shrink-0'])}
      width={16}
      height={16}
    />
  ),
  incomplete: (
    <QuestionMarkCircleIcon
      className={tw(['text-yellow-500 w-4 h-4 flex-shrink-0'])}
      width={16}
      height={16}
    />
  ),
};

const Element = (props: {
  element: NodeResult;
  highlighted: boolean;
  toggleHighlight: () => void;
}) => {
  const { any, all, none } = props.element;
  const rules = [...any, ...all, ...none];

  return (
    <div>
      <div className={tw(['flex justify-between items-center pr-2'])}>
        <p className={tw(['flex-1 m-0 p-0 font-mono truncate'])}>
          {props.element.target[0]}
        </p>
        <div className={tw(['flex-shrink-0'])}>
          <Checkbox
            checked={props.highlighted}
            onCheckedChange={props.toggleHighlight}
          />
        </div>
      </div>
      <Rules rules={rules} />
    </div>
  );
};

const Rules = (props: { rules: Array<CheckResult> }) => {
  return (
    <ul className={tw(['list-none m-0 p-0'])}>
      {props.rules.map((r) => (
        <li key={r.id}>
          [{r.impact}] {r.message}
        </li>
      ))}
    </ul>
  );
};
