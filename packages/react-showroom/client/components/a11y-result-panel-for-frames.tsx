import { Tabs, callAll } from '@showroomjs/ui';
import { useCodeFrameContext } from '../lib/code-frame-context';
import { getFrameId } from '../lib/get-frame-id';
import { getScrollFn } from '../lib/scroll-into-view';
import {
  A11yResultContextProvider,
  useA11yResultByFrame,
} from '../lib/use-a11y-result';
import { A11yResultPanel } from './a11y-result-panel';

export interface A11yResultPanelForFramesProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onHighlightItems: (data: {
    frameName: string;
    selectors: Array<string>;
    color: string;
  }) => void;
  resetHiglights: () => void;
  scrollToFrameWhenSelect?: boolean;
}

export const A11yResultPanelForFrames = (
  props: A11yResultPanelForFramesProps
) => {
  const { frameDimensions } = useCodeFrameContext();
  const { resultByFrameName } = useA11yResultByFrame();

  if (frameDimensions.length === 0) {
    return null;
  }

  return frameDimensions.length === 1 ? (
    <>
      {frameDimensions.map((frame) => (
        <A11yResultContextProvider
          result={resultByFrameName[frame.name]}
          key={frame.name}
        >
          <A11yResultPanel
            highlightItems={(selectors, color) =>
              props.onHighlightItems({
                frameName: frame.name,
                selectors,
                color,
              })
            }
          />
        </A11yResultContextProvider>
      ))}
    </>
  ) : (
    <Tabs.Root
      value={props.activeTab}
      onValueChange={callAll(
        props.setActiveTab,
        props.scrollToFrameWhenSelect
          ? (frameName) => {
              const frame = frameDimensions.find((f) => f.name === frameName);

              if (frame) {
                const frameId = getFrameId(frame);

                const targetFrame = document.querySelector(
                  `[data-frame-id="${frameId}"]`
                );

                if (targetFrame) {
                  getScrollFn().then((scroll) =>
                    scroll(targetFrame, {
                      block: 'center',
                      behavior: 'smooth',
                      inline: 'center',
                    })
                  );
                }
              }
            }
          : undefined,
        props.resetHiglights
      )}
    >
      <Tabs.List>
        {frameDimensions.map((frame) => (
          <Tabs.Trigger value={frame.name} key={frame.name}>
            {frame.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {frameDimensions.map((frame) => (
        <Tabs.Content value={frame.name} key={frame.name}>
          <A11yResultContextProvider result={resultByFrameName[frame.name]}>
            <A11yResultPanel
              highlightItems={(selectors, color) =>
                props.onHighlightItems({
                  frameName: frame.name,
                  selectors,
                  color,
                })
              }
            />
          </A11yResultContextProvider>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
