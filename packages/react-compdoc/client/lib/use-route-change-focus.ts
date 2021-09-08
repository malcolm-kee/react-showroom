import * as React from 'react';
import { useLocation } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view-if-needed';

/**
 * A naive implementation that focus the hash target when route change
 */
export const useRouteChangeFocus = () => {
  const location = useLocation();
  const hasRenderedRef = React.useRef(false); // don't do the focus on initial mount

  React.useEffect(() => {
    if (location.hash) {
      const $target = document.querySelector(location.hash);

      if ($target && $target instanceof HTMLElement) {
        scrollIntoView($target, {
          scrollMode: 'if-needed',
          block: 'start',
          inline: 'nearest',
        });

        if (hasRenderedRef.current) {
          const targetFocusable = $target.querySelector('a, button') as
            | HTMLButtonElement
            | HTMLAnchorElement;

          if (targetFocusable) {
            targetFocusable.focus();
          }
        }
      }

      return;
    }

    if (document.activeElement === document.body) {
      const $mainContent = document.querySelector('#__react-compdoc-main__');
      if ($mainContent) {
        ($mainContent as HTMLElement).focus();
      }
    }

    hasRenderedRef.current = true;
  }, [location]);
};
