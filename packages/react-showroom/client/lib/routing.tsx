export {
  HashRouter,
  matchPath,
  MemoryRouter,
  Route,
  StaticRouter,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from '@showroomjs/bundles/routing';
import {
  BrowserRouter,
  HashRouter,
  LinkProps as OriLinkProps,
  matchPath,
  useHistory,
  useLocation,
} from '@showroomjs/bundles/routing';
import { callAll } from '@showroomjs/core';
import cx from 'classnames';
import * as React from 'react';
import { loadCodeAtPath } from '../route-mapping';
import { basename, isSpa } from './config';

export interface LinkProps extends Omit<OriLinkProps, 'to'> {
  to: string;
  pendingClassName?: string;
}

/**
 * Custom Link component so we can preload code before navigate
 * to avoid blank screen flash
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ to, replace, pendingClassName, ...props }, ref) {
    const history = useHistory();
    const [isPending, setIsPending] = React.useState(false);

    return (
      <a
        {...props}
        className={cx(props.className, isPending && pendingClassName)}
        onClick={callAll(props.onClick, (ev) => {
          ev.preventDefault();
          setIsPending(true);
          loadCodeAtPath(to, () => {
            setIsPending(false);
            const method = replace ? history.replace : history.push;
            method(to);
          });
        })}
        onMouseEnter={callAll(props.onMouseEnter, () => loadCodeAtPath(to))}
        aria-busy={isPending || undefined}
        href={basename && to === '/' ? basename : `${basename}${to}`}
        ref={ref}
      />
    );
  }
);

export const NavLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & { exact?: boolean }
>(function NavLink({ exact, ...props }, ref) {
  const location = useLocation();

  const match = matchPath(location.pathname, {
    path: props.to,
    exact,
  });

  return (
    <Link {...props} aria-current={!!match ? 'page' : undefined} ref={ref} />
  );
});

export const Router = (props: {
  children: React.ReactNode;
  basename?: string;
}) => {
  if (isSpa) {
    return <HashRouter>{props.children}</HashRouter>;
  }

  return <BrowserRouter {...props} />;
};
