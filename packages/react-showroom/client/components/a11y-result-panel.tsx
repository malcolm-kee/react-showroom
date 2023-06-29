import { dedupeArray, flattenArray, isDefined } from '@showroomjs/core';
import { Checkbox, Collapsible, Tabs, tw } from '@showroomjs/ui';
import * as React from 'react';
import { A11yResult, useA11yResult } from '../lib/use-a11y-result';
import { A11yResultItem, Root as ItemRoot } from './a11y-result-item';

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
      <div
        className={tw(['flex justify-between items-center gap-4 flex-wrap'])}
      >
        <Tabs.RawList>
          <TabTrigger
            value="violations"
            disabled={result && result.violations.length === 0}
          >
            VIOLATIONS <Count>{result ? result.violations.length : '?'}</Count>
          </TabTrigger>
          <TabTrigger
            value="passes"
            disabled={result && result.passes.length === 0}
          >
            PASSES <Count>{result ? result.passes.length : '?'}</Count>
          </TabTrigger>
          <TabTrigger
            value="incompletes"
            disabled={result && result.incomplete.length === 0}
          >
            INCOMPLETE <Count>{result ? result.incomplete.length : '?'}</Count>
          </TabTrigger>
        </Tabs.RawList>
        <label
          className={tw([
            'flex-1 flex justify-end items-center gap-2 px-4 text-sm text-zinc-500',
          ])}
        >
          <span>Highlight</span>
          <Checkbox
            checked={checkStatus}
            onCheckedChange={(allChecked) => {
              setHighlightedItems(allChecked ? allSelectors : []);
            }}
            disabled={allSelectors.length === 0}
          />
        </label>
      </div>
      {result ? (
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
      ) : (
        <LoadingPlaceholderList />
      )}
    </Tabs.Root>
  );
};

const LoadingPlaceholderList = () => (
  <ResultItemList className={tw(['bg-white animate-pulse'])}>
    <PlaceholderItem width="60%" />
    <PlaceholderItem width="70%" />
    <PlaceholderItem width="50%" />
  </ResultItemList>
);

const ResultItemList = (props: React.ComponentPropsWithoutRef<'ul'>) => (
  <ul {...props} className={tw(['list-none p-0 m-0'], [props.className])} />
);

const PlaceholderItem = ({ width }: { width: string }) => (
  <ItemRoot>
    <div className={tw(['flex items-center pr-4 pl-1'])}>
      <Collapsible.ToggleIcon direction="right" className={tw(['mr-1'])} />
      <div
        className={tw(['h-5 bg-zinc-300'])}
        style={{
          width,
        }}
      />
    </div>
  </ItemRoot>
);

const Count = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={tw(
      [
        'inline-flex justify-center items-center',
        'text-xs w-[14px] h-[14px]',
        'bg-zinc-500 text-white rounded-full',
      ],
      [props.className]
    )}
  />
);

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

const TabTrigger = (
  props: React.ComponentPropsWithoutRef<typeof Tabs['RawTrigger']>
) => (
  <Tabs.RawTrigger
    {...props}
    className={tw(
      [
        'inline-flex items-center gap-1 px-2 py-1 text-xs border-0 text-zinc-500 font-semibold tracking-wide cursor-pointer',
        'border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-700',
        'disabled:opacity-50 disabled:cursor-default',
      ],
      [props.className]
    )}
  />
);

const TabContent = (
  props: React.ComponentPropsWithoutRef<typeof Tabs.RawContent>
) => (
  <Tabs.RawContent {...props} className={tw(['bg-white'], [props.className])} />
);

const NoItemMsg = (props: React.ComponentPropsWithoutRef<'p'>) => (
  <p
    {...props}
    className={tw(['text-zinc-500 px-2 py-2'], [props.className])}
  />
);
