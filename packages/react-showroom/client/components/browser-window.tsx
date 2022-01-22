import { MenuIcon } from '@heroicons/react/outline';
import { Collapsible, Dialog, styled } from '@showroomjs/ui';
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
    <BrowserWindowWrapper style={{ minHeight }} {...props}>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <Collapsible.Root open={show} onOpenChange={setShow}>
          <BrowserWindowHeader>
            <Buttons>
              <Dot style={{ background: '#f25f58' }} />
              <Collapsible.Button asChild>
                <Dot
                  as="button"
                  style={{ background: '#fbbe3c' }}
                  aria-label={show ? 'Show' : 'Collapse'}
                />
              </Collapsible.Button>
              <Dialog.Trigger asChild>
                <Dot
                  as="button"
                  style={{ background: '#58cb42' }}
                  aria-label="Open focus view"
                />
              </Dialog.Trigger>
            </Buttons>
            <BrowserWindowAddressBar>{url}</BrowserWindowAddressBar>
            <div>
              <BrowserMenu width={20} height={20} />
            </div>
          </BrowserWindowHeader>
          <Collapsible.Content>
            <ErrorBound>{children}</ErrorBound>
          </Collapsible.Content>
        </Collapsible.Root>
        <Dialog.Content fullWidth>
          <ErrorBound>{children}</ErrorBound>
        </Dialog.Content>
      </Dialog>
    </BrowserWindowWrapper>
  );
};

const BrowserMenu = styled(MenuIcon, {
  color: '$gray-300',
});

const BrowserWindowWrapper = styled('div', {
  border: '3px solid $gray-500',
  borderRadius: '$md',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px',
});

const BrowserWindowHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '$gray-500',
  padding: '0.5rem 1rem',
});

const Buttons = styled('div', {
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
});

const Dot = styled('span', {
  display: 'inline-block',
  height: 12,
  width: 12,
  marginRight: 6,
  backgroundColor: '#bbb',
  borderRadius: '50%',
});

const BrowserWindowAddressBar = styled('div', {
  flex: '1 0',
  margin: '0 1rem 0 0.5rem',
  borderRadius: '12.5px',
  backgroundColor: '#fff',
  color: '$gray-800',
  padding: '5px 15px',
  font: '400 13px Arial',
  userSelect: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});
