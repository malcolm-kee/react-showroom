import { dedupeArray, flattenArray, isDefined } from '@showroomjs/core';
import { Checkbox, styled, Tabs } from '@showroomjs/ui';
import * as React from 'react';
import { A11yResult, useA11yResult } from '../lib/use-a11y-result';
import { A11yResultItem } from './a11y-result-item';

export const A11yResultPanel = (props: {
  highlightItems: (selectors: Array<string>, color: string) => void;
}) => {
  const { result } = useA11yResult();

  const [activeTab, setActiveTab] = React.useState(() => {
    if (result) {
      return getDefaultTab(result);
    }
  });
  const allSelectors = React.useMemo(() => {
    if (!result || !activeTab) {
      return [];
    }

    const items =
      activeTab === 'violations'
        ? result.violations
        : activeTab === 'passes'
        ? result.passes
        : result.incomplete;

    return dedupeArray(
      flattenArray(
        items.map((item) => item.nodes.map((node) => node.target[0]))
      ).filter(isDefined)
    );
  }, [result, activeTab]);

  const [highlightedItems, setHighlightedItems] = React.useState<Array<string>>(
    []
  );
  const toggleHighlight = React.useCallback((selector: string) => {
    setHighlightedItems((prev) =>
      prev.includes(selector)
        ? prev.filter((s) => s !== selector)
        : prev.concat(selector)
    );
  }, []);
  React.useEffect(() => {
    if (activeTab) {
      props.highlightItems(highlightedItems, colorByType[activeTab] || '');
    }
  }, [highlightedItems]);

  const checkStatus = React.useMemo(() => {
    if (allSelectors.length === 0) {
      return 'indeterminate';
    }

    return allSelectors.every((s) => highlightedItems.includes(s))
      ? true
      : allSelectors.some((s) => highlightedItems.includes(s))
      ? 'indeterminate'
      : false;
  }, [allSelectors, highlightedItems]);

  React.useEffect(() => {
    if (result) {
      const tab = getDefaultTab(result);

      if (tab) {
        setActiveTab((prevTab) => prevTab || tab);
      }
    }
  }, [result]);

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={(newTab) => {
        setActiveTab(newTab);
        setHighlightedItems([]);
      }}
    >
      <TabNav>
        <Tabs.RawList>
          <TabTrigger value="violations">
            Violations <Count>{result ? result.violations.length : '?'}</Count>
          </TabTrigger>
          <TabTrigger value="passes">
            Passes <Count>{result ? result.passes.length : '?'}</Count>
          </TabTrigger>
          <TabTrigger value="incompletes">
            Incomplete <Count>{result ? result.incomplete.length : '?'}</Count>
          </TabTrigger>
        </Tabs.RawList>
        <CheckboxLabel>
          <span>Highlight</span>
          <Checkbox
            checked={checkStatus}
            onCheckedChange={(allChecked) => {
              setHighlightedItems(allChecked ? allSelectors : []);
            }}
          />
        </CheckboxLabel>
      </TabNav>
      {result && (
        <>
          <TabContent value="violations">
            {result.violations.length > 0 ? (
              <ResultItemList>
                {result.violations.map((p) => (
                  <A11yResultItem
                    result={p}
                    type="violation"
                    highlightedItems={highlightedItems}
                    setHighlightedItems={setHighlightedItems}
                    toggleItem={toggleHighlight}
                    key={p.id}
                  />
                ))}
              </ResultItemList>
            ) : (
              <NoItemMsg>No applicable item</NoItemMsg>
            )}
          </TabContent>
          <TabContent value="passes">
            {result.passes.length > 0 ? (
              <ResultItemList>
                {result.passes.map((p) => (
                  <A11yResultItem
                    result={p}
                    type="pass"
                    highlightedItems={highlightedItems}
                    setHighlightedItems={setHighlightedItems}
                    toggleItem={toggleHighlight}
                    key={p.id}
                  />
                ))}
              </ResultItemList>
            ) : (
              <NoItemMsg>No applicable item</NoItemMsg>
            )}
          </TabContent>
          <TabContent value="incompletes">
            {result.incomplete.length > 0 ? (
              <ResultItemList>
                {result.incomplete.map((p) => (
                  <A11yResultItem
                    result={p}
                    type="incomplete"
                    highlightedItems={highlightedItems}
                    setHighlightedItems={setHighlightedItems}
                    toggleItem={toggleHighlight}
                    key={p.id}
                  />
                ))}
              </ResultItemList>
            ) : (
              <NoItemMsg>No applicable item</NoItemMsg>
            )}
          </TabContent>
        </>
      )}
    </Tabs.Root>
  );
};

const ResultItemList = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const Count = styled('span', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$full',
  fontSize: '$xs',
  lineHeight: 1,
  width: 14,
  height: 14,
  backgroundColor: '$gray-500',
  color: 'White',
});

const getDefaultTab = (result: A11yResult) => {
  if (result.violations.length > 0) {
    return 'violations';
  }
  if (result.passes.length > 0) {
    return 'passes';
  }
  if (result.incomplete.length > 0) {
    return 'incompletes';
  }
};

const colorByType: Record<string, string> = {
  violations: '#EF4444',
  passes: '#10B981',
  incompletes: '#F59E0B',
};

const TabTrigger = styled(Tabs.RawTrigger, {
  display: 'inline-flex',
  alignItems: 'center',
  px: '$2',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  gap: '$1',
  border: 0,
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  backgroundColor: 'inherit',
  outlineRing: '',
  '&[data-state="active"]': {
    borderColor: '$primary-800',
  },
});

const CheckboxLabel = styled('label', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-700',
  px: '$4',
});

const TabNav = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const TabContent = styled(Tabs.RawContent, {
  backgroundColor: 'White',
});

const NoItemMsg = styled('p', {
  px: '$2',
  py: '$1',
  margin: 0,
  color: '$gray-600',
  fontSize: '$sm',
  lineHeight: '$sm',
});
