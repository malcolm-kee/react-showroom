export {
  HashRouter,
  matchPath,
  Route,
  Routes,
  useLocation,
  useNavigate as useRouterNavigate,
  useParams,
} from '@showroomjs/bundles/routing';
import {
  BrowserRouter as OriBrowserRouter,
  BrowserRouterProps,
  LinkProps as OriLinkProps,
  useLocation,
  useMatch,
  useNavigate as useRouterNavigate,
  useResolvedPath,
  MemoryRouter as OriMemoryRouter,
  UNSAFE_LocationContext,
} from '@showroomjs/bundles/routing';
import { callAll, noop } from '@showroomjs/core';
import { createNameContext } from '@showroomjs/ui';
import cx from 'classnames';
import * as React from 'react';
import { loadCodeAtPath } from '../route-mapping';
import { basename } from './config';

/**
 * Hack based on https://github.com/remix-run/react-router/issues/7375#issuecomment-975431736
 */
export const MemoryRouter = (props: { children: React.ReactNode }) => (
  <UNSAFE_LocationContext.Provider value={null as any}>
    <OriMemoryRouter>{props.children}</OriMemoryRouter>
  </UNSAFE_LocationContext.Provider>
);

const RouteIsLoadingContext = createNameContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>('RouteIsLoadingContext', [false, noop]);

export const useIsLoadingRoute = () =>
  React.useContext(RouteIsLoadingContext)[0];

export const useNavigate = () => {
  const [, setIsPending] = React.useContext(RouteIsLoadingContext);
  const [isPending, setLocalIsPending] = React.useState(false);
  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const navigate = useRouterNavigate();

  const location = useLocation();

  return {
    navigate: (
      to: string,
      options: { replace?: boolean; state?: unknown } = {}
    ) => {
      if (/https?:\/\//.test(to)) {
        openInNewTab(to);
        return;
      }

      setIsPending(true);
      setLocalIsPending(true);
      const urlWhenClick = location.pathname;
      Promise.race([loadCode(to), wait(1500)]).then(() => {
        setIsPending(false);

        // avoid race condition where user click another route before the Promise resolves
        if (urlWhenClick === location.pathname) {
          navigate(to, options);
        }
        if (isMountedRef.current) {
          setLocalIsPending(false);
        }
      });
    },
    isPending,
  };
};

export const BrowserRouter = (props: BrowserRouterProps) => {
  const loadingRouteState = React.useState(false);

  return (
    <RouteIsLoadingContext.Provider value={loadingRouteState}>
      <OriBrowserRouter {...props} />
    </RouteIsLoadingContext.Provider>
  );
};

function openInNewTab(url: string) {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('target', '_BLANK');
    a.click();
  } catch (err) {
    window.location.href = url;
  }
}

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
    const { navigate, isPending } = useNavigate();

    return (
      <a
        {...props}
        className={cx(props.className, isPending && pendingClassName)}
        onClick={callAll(props.onClick, (ev) => {
          ev.preventDefault();
          navigate(to, {
            replace,
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
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: exact });

  return (
    <Link {...props} {...(match ? { 'aria-current': 'page' } : {})} ref={ref} />
  );
});

const loadCode = (path: string) =>
  new Promise<void>((fulfill) => {
    loadCodeAtPath(path, fulfill);
  });

const wait = (ms: number) => new Promise((fulfill) => setTimeout(fulfill, ms));
