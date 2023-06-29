import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@showroomjs/bundles/query';
import { Option, SearchDialog, tw } from '@showroomjs/ui';
import * as React from 'react';
import { Link, useLocation, useNavigate } from '../lib/routing';
import { loadCodeAtPath } from '../route-mapping';
import { THEME, colorTheme } from '../theme';
import { GenericLink } from './generic-link';

const navbarOptions = THEME.navbar;

export interface HeaderProps {
  backUrl?: string;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  function Header(props, forwardedRef) {
    const location = useLocation();

    const { navigate } = useNavigate();

    const [searchValue, setSearchValue] = React.useState('');

    const { data: options, isLoading } = useQuery<Array<Option<string>>>(
      ['search', searchValue],
      () => {
        if (!searchValue) {
          return [];
        }
        return import('../lib/get-search-result').then((m) =>
          m.getSearchResult(searchValue)
        );
      }
    );

    return (
      <header
        className={tw([
          'sticky top-0 bg-primary-800 text-white shadow-lg z-20',
        ])}
        ref={forwardedRef}
      >
        <div
          className={tw([
            'flex justify-between items-center px-4 py-2 md:py-3',
          ])}
        >
          <div className={tw(['flex items-center gap-2'])}>
            {props.backUrl && (
              <HeaderLink href={props.backUrl}>
                <ArrowLeftIcon aria-label="Back" width={20} height={20} />
              </HeaderLink>
            )}
            {navbarOptions.logo && (
              <img
                className={tw(['max-h-10 w-auto'])}
                {...navbarOptions.logo}
              />
            )}
            <Link
              to="/"
              className={tw([
                'px-2 text-inherit no-underline md:text-xl focus-visible:outline-primary-200',
              ])}
            >
              {THEME.title}{' '}
              {navbarOptions.version && (
                <small className={tw(['text-sm'])}>
                  v{navbarOptions.version}
                </small>
              )}
            </Link>
          </div>
          <div className={tw(['flex items-center gap-4'])}>
            {navbarOptions.items &&
              navbarOptions.items.map((item, i) => (
                <HeaderLink href={item.to} key={i}>
                  {item.label}
                </HeaderLink>
              ))}
            <SearchDialog.Root>
              <SearchDialog.Trigger
                autoFocus={
                  !!(
                    location.state &&
                    (location.state as { searchNavigated: boolean })
                      .searchNavigated
                  )
                }
              >
                <span className={tw(['sr-only md:not-sr-only'])}>Search</span>
              </SearchDialog.Trigger>
              <SearchDialog
                options={options || []}
                placeholder="Search docs"
                onSelect={(result) => {
                  if (result) {
                    navigate(result, {
                      state: {
                        searchNavigated: true,
                      },
                    });
                  }
                }}
                onHighlightedItemChange={(item) => loadCodeAtPath(`/${item}`)}
                onInputChange={setSearchValue}
                className={colorTheme}
                isLoading={isLoading}
              />
            </SearchDialog.Root>
          </div>
        </div>
      </header>
    );
  }
);

const HeaderLink = (
  props: React.ComponentPropsWithoutRef<typeof GenericLink>
) => (
  <GenericLink
    {...props}
    className={tw(
      ['px-2 hidden md:block focus-visible:outline-primary-200'],
      [props.className]
    )}
  />
);
