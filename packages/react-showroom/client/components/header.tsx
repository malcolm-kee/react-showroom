import { ArrowLeftIcon } from '@heroicons/react/outline';
import { SearchIndexItem } from '@showroomjs/core/react';
import { Option, SearchDialog, styled } from '@showroomjs/ui';
import * as React from 'react';
import { Link, useLocation, useNavigate } from '../lib/routing';
import { loadCodeAtPath } from '../route-mapping';
import { colorTheme, THEME } from '../theme';
import { GenericLink } from './generic-link';

let cachedOptions: Array<Option<string>> | undefined = undefined;

function collectOptions(indexItems: SearchIndexItem[]) {
  const result: Array<Option<string>> = [];

  function innerCollect(items: SearchIndexItem[]) {
    items.forEach((item) => {
      switch (item.type) {
        case 'component':
          result.push({
            label: item.title,
            value: item.slug,
            description: item.description,
          });

          if (item.headings) {
            item.headings.forEach((heading) => {
              if (heading.slug) {
                result.push({
                  label: heading.text,
                  value: `${item.slug}#${heading.slug}`,
                  description: item.title,
                });
              }
            });
          }
          break;

        case 'markdown':
          const title = item.formatLabel(
            item.frontmatter.title || item.fallbackTitle
          );
          if (item.slug && title) {
            result.push({
              label: title,
              value: item.slug,
              description: item.frontmatter.description,
            });
            item.headings.forEach((heading) => {
              if (heading.slug) {
                result.push({
                  label: heading.text,
                  value: `${item.slug}#${heading.slug}`,
                  description: title,
                });
              }
            });
          }
          break;

        case 'group':
          innerCollect(item.items);
          break;

        default:
          break;
      }
    });
  }

  innerCollect(indexItems);

  return result;
}

function getOptions(): Promise<Array<Option<string>>> {
  if (cachedOptions) {
    return Promise.resolve(cachedOptions);
  }

  return import(
    /* webpackChunkName: "searchIndex" */
    'react-showroom-index'
  ).then((m) => {
    const result = collectOptions(m.default);
    cachedOptions = result;
    return result;
  });
}

const navbarOptions = THEME.navbar;

export interface HeaderProps {
  backUrl?: string;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  function Header(props, forwardedRef) {
    const location = useLocation<{ searchNavigated?: boolean }>();

    const [options, setOptions] = React.useState(cachedOptions || []);

    const { navigate } = useNavigate();

    return (
      <HeaderRoot ref={forwardedRef}>
        <HeaderInner>
          <TitleWrapper>
            {props.backUrl && (
              <HeaderLink href={props.backUrl}>
                <ArrowLeftIcon aria-label="Back" width={20} height={20} />
              </HeaderLink>
            )}
            {navbarOptions.logo && <Logo {...navbarOptions.logo} />}
            <Title to="/">
              {THEME.title}{' '}
              {navbarOptions.version && (
                <Version>v{navbarOptions.version}</Version>
              )}
            </Title>
          </TitleWrapper>
          <ItemWrapper>
            {navbarOptions.items &&
              navbarOptions.items.map((item, i) => (
                <HeaderLink href={item.to} key={i}>
                  {item.label}
                </HeaderLink>
              ))}
            <SearchDialog.Root
              onOpenChange={(open) =>
                open && getOptions().then((result) => setOptions(result))
              }
            >
              <SearchDialog.Trigger
                autoFocus={!!(location.state && location.state.searchNavigated)}
              >
                <SearchText>Search</SearchText>
              </SearchDialog.Trigger>
              <SearchDialog
                options={options}
                placeholder="Search docs"
                onSelect={(result) => {
                  if (result) {
                    navigate(`/${result}`, {
                      state: {
                        searchNavigated: true,
                      },
                    });
                  }
                }}
                onHighlightedItemChange={(item) => loadCodeAtPath(`/${item}`)}
                className={colorTheme}
              />
            </SearchDialog.Root>
          </ItemWrapper>
        </HeaderInner>
      </HeaderRoot>
    );
  }
);

const Logo = styled('img', {
  maxHeight: '40px',
  width: 'auto',
});

const TitleWrapper = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
});

const SearchText = styled('span', {
  srOnly: true,
  '@md': {
    srOnly: false,
  },
});

const Version = styled('small', {
  fontSize: '$sm',
  lineHeight: '$sm',
});

const ItemWrapper = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
});

const HeaderRoot = styled('header', {
  position: 'sticky',
  top: 0,
  backgroundColor: '$primary-800',
  color: 'White',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px',
  zIndex: 20,
});

const HeaderInner = styled('div', {
  px: '$4',
  py: '$2',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@md': {
    py: '$3',
  },
});

const HeaderLink = styled(GenericLink, {
  px: '$2',
  '&:focus': {
    outlineColor: '$primary-200',
  },
  display: 'none',
  '@md': {
    display: 'block',
  },
});

const Title = styled(Link, {
  color: 'inherit',
  textDecoration: 'none',
  px: '$2',
  '&:focus': {
    outlineColor: '$primary-200',
  },
  '@md': {
    fontSize: '$xl',
  },
});
