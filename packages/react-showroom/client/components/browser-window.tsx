import { Bars3Icon as MenuIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Collapsible, Dialog, tw } from '@showroomjs/ui';
import * as React from 'react';
import { ErrorBound } from './error-fallback';

export interface BrowserWindowProps {
  children: React.ReactNode;
  minHeight?: number | string;
  url?: string;
  className?: string;
}

/**
 * This component is mostly a shameless copy from `docusaurus`.
 *
 * @see https://github.com/facebook/docusaurus/blob/b6d0378704d68f5d6ac821243f7a1ae19d5ccdbe/website/src/components/BrowserWindow/styles.module.css
 */
export const BrowserWindow = ({
  minHeight = 'auto',
  children,
  url,
  ...props
}: BrowserWindowProps) => {
  const [show, setShow] = React.useState<boolean | undefined>(true);
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <div
      style={{ minHeight }}
      {...props}
      className={tw(
        ['border-[3px] border-zinc-500 rounded-md shadow'],
        [props.className]
      )}
    >
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <Collapsible open={show} onOpenChange={setShow}>
          <div className={tw(['flex items-center bg-zinc-500 py-2 px-4'])}>
            <div
              className={tw([
                'group/winControls flex items-center whitespace-nowrap',
              ])}
            >
              <span style={{ background: '#f25f58' }} className={dotClass} />
              <Collapsible.Button asChild>
                <button
                  style={{ background: '#fbbe3c', padding: 0 }}
                  aria-label={show ? 'Show' : 'Collapse'}
                  className={dotClass}
                >
                  <MinusIcon
                    width={12}
                    height={12}
                    className={tw([
                      'text-yellow-800 invisible group-hover/winControls:visible group-focus-visible/dot:visible',
                    ])}
                  />
                </button>
              </Collapsible.Button>
              <Dialog.Trigger asChild>
                <button
                  style={{ background: '#58cb42', padding: 0 }}
                  aria-label="Open focus view"
                  className={dotClass}
                >
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 20 20"
                    fill="none"
                    className={tw([
                      'text-green-700 invisible group-hover/winControls:visible group-focus-visible/dot:visible',
                    ])}
                  >
                    <polygon points="5,5 5,13 13,5" fill="currentColor" />
                    <polygon points="15,15 15,7 7,15" fill="currentColor" />
                  </svg>
                </button>
              </Dialog.Trigger>
            </div>
            <div
              className={tw([
                'flex-grow flex-shrink-0 bg-white ml-4 mr-2 py-[5px] px-[15px] text-zinc-800 rounded-[12.5px] select-none truncate',
              ])}
              style={{
                font: '400 13px Arial',
              }}
            >
              {url}
            </div>
            <div>
              <MenuIcon
                width={20}
                height={20}
                className={tw(['text-zinc-300'])}
              />
            </div>
          </div>
          <Collapsible.Content animate>
            <ErrorBound>{children}</ErrorBound>
          </Collapsible.Content>
        </Collapsible>
        <Dialog.Content fullWidth>
          <ErrorBound>{children}</ErrorBound>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

const dotClass = tw([
  'group/dot inline-flex justify-center items-center h-3 w-3 mr-[6px] bg-[#bbb] rounded-full',
]);
