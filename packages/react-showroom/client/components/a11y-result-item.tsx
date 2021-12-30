import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { isDefined, dedupeArray } from '@showroomjs/core';
import { Collapsible, styled, Checkbox } from '@showroomjs/ui';
import type { CheckResult, NodeResult, Result } from 'axe-core';
import * as React from 'react';

export const A11yResultItem = (props: {
  result: Result;
  type: 'pass' | 'violation' | 'incomplete';
  highlightedItems: Array<string>;
  setHighlightedItems: React.Dispatch<React.SetStateAction<string[]>>;
  toggleItem: (selector: string) => void;
}) => {
  const Icon = iconByType[props.type];

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
    <Item>
      <Collapsible.Root open={showDetails} onOpenChange={setShowDetails}>
        <ResultTitle>
          <Collapsible.Button
            css={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              gap: '$1',
              fontSize: '$sm',
              lineHeight: '$sm',
              color: '$gray-800',
              flex: 1,
            }}
          >
            <Collapsible.ToggleIcon
              direction={showDetails ? 'down' : 'right'}
              width={16}
              height={16}
            />
            {result.help}
            <Icon width={16} height={16} />
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
        </ResultTitle>
        <Collapsible.Content animate>
          <ItemDetails>
            <Text>{result.description}</Text>
            <Text>
              <ItemLink
                href={result.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </ItemLink>
            </Text>
            <ElementList>
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
            </ElementList>
          </ItemDetails>
        </Collapsible.Content>
      </Collapsible.Root>
    </Item>
  );
};

const Text = styled('p', {
  margin: 0,
  padding: 0,
});

const ResultTitle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingRight: '$4',
});

const Item = styled('li', {
  py: '$1',
  borderBottom: '1px solid $gray-200',
  '&:last-child': {
    borderBottom: 0,
  },
});

const ItemDetails = styled('div', {
  px: '$2',
  py: '$2',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-800',
});

const ItemLink = styled('a', {
  color: '$blue-800',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const ElementList = styled('ol', {
  listStyleType: 'decimal',
  paddingLeft: '$6',
  marginTop: '$3',
  '& li': {
    marginBottom: '$2',
  },
  '& li:last-child': {
    marginBottom: 0,
  },
});

const SuccessIcon = styled(CheckCircleIcon, {
  color: '$green-500',
  width: 16,
  height: 16,
  flexShrink: 0,
});

const DangerIcon = styled(XCircleIcon, {
  color: '$red-500',
  width: 16,
  height: 16,
  flexShrink: 0,
});

const UnknownIcon = styled(QuestionMarkCircleIcon, {
  color: '$yellow-500',
  width: 16,
  height: 16,
  flexShrink: 0,
});

const iconByType = {
  pass: SuccessIcon,
  violation: DangerIcon,
  incomplete: UnknownIcon,
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
      <ElementText>
        {props.element.target[0]}{' '}
        <Checkbox
          checked={props.highlighted}
          onCheckedChange={props.toggleHighlight}
        />
      </ElementText>
      <Rules rules={rules} />
    </div>
  );
};

const ElementText = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: '500',
  borderBottom: '1px solid $gray-300',
  paddingRight: '$2',
});

const Rules = (props: { rules: Array<CheckResult> }) => {
  return (
    <RulesRoot>
      {props.rules.map((r) => (
        <li key={r.id}>
          [{r.impact}] {r.message}
        </li>
      ))}
    </RulesRoot>
  );
};

const RulesRoot = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
});
