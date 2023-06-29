import * as TabsPrimitive from '@radix-ui/react-tabs';
import { tw } from '../lib/tw';
import * as React from 'react';

export const Tabs = Object.assign({}, TabsPrimitive, {
  List: React.forwardRef<HTMLDivElement, TabsPrimitive.TabsListProps>(
    function TabList(props, forwardedRef) {
      return (
        <TabsPrimitive.List
          {...props}
          className={tw(['relative top-px overflow-x-auto'], [props.className])}
          ref={forwardedRef}
        />
      );
    }
  ),
  Trigger: React.forwardRef<HTMLButtonElement, TabsPrimitive.TabsTriggerProps>(
    function TabTrigger(props, forwardedRef) {
      return (
        <TabsPrimitive.Trigger
          {...props}
          className={tw(
            [
              'text-sm px-3 py-1',
              'bg-inherit cursor-pointer rounded-t',
              'data-[state=active]:bg-zinc-100 data-[state=active]:text-primary-800 data-[state=active]:border-b-transparent',
            ],
            [props.className]
          )}
          ref={forwardedRef}
        />
      );
    }
  ),
  Content: React.forwardRef<HTMLDivElement, TabsPrimitive.TabsContentProps>(
    function TabContent(props, forwardedRef) {
      return (
        <TabsPrimitive.Content
          {...props}
          className={tw(['bg-zinc-100 rounded-b'], [props.className])}
          ref={forwardedRef}
        />
      );
    }
  ),
  RawList: TabsPrimitive.List,
  RawTrigger: TabsPrimitive.Trigger,
  RawContent: TabsPrimitive.Content,
});
