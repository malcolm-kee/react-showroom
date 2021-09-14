import { ReactShowroomSection } from '@showroomjs/core/react';
import { Option, SearchDialog, styled } from '@showroomjs/ui';
import { Link, useHistory, useLocation } from 'react-router-dom';
import sections from 'react-showroom-sections';
import { colorTheme, THEME } from '../theme';
import { GenericLink } from './generic-link';

const options = (function (allItems: Array<ReactShowroomSection>) {
  const result: Array<Option<string>> = [];

  function collectOption(items: Array<ReactShowroomSection>) {
    items.forEach((item) => {
      switch (item.type) {
        case 'component':
          result.push({
            label: item.data.component.displayName,
            value: item.slug,
            description: item.data.component.description,
          });
          return;

        case 'group':
          collectOption(item.items);
          return;

        case 'markdown':
          result.push({
            label: item.title,
            value: item.slug,
            description: item.frontmatter.description,
          });
      }
    });
  }

  collectOption(allItems);

  return result;
})(sections);

const navbarOptions = THEME.navbar;

export const Header = () => {
  const history = useHistory();
  const location = useLocation<{ searchNavigated?: boolean }>();

  return (
    <HeaderRoot>
      <HeaderInner>
        <ItemWrapper>
          {navbarOptions.logo && <img {...navbarOptions.logo} />}
          <Title to="/">
            {THEME.title}{' '}
            {navbarOptions.version && <small>v{navbarOptions.version}</small>}
          </Title>
        </ItemWrapper>
        <ItemWrapper>
          {navbarOptions.items &&
            navbarOptions.items.map((item, i) => (
              <HeaderLink href={item.to} key={i}>
                {item.label}
              </HeaderLink>
            ))}
          <SearchDialog.Root>
            <SearchDialog.Trigger
              autoFocus={!!(location.state && location.state.searchNavigated)}
            >
              Search
            </SearchDialog.Trigger>
            <SearchDialog
              options={options}
              placeholder="Search docs"
              onSelect={(result) => {
                if (result) {
                  history.push(`/${result}`, { searchNavigated: true });
                }
              }}
              className={colorTheme}
            />
          </SearchDialog.Root>
        </ItemWrapper>
      </HeaderInner>
    </HeaderRoot>
  );
};

const ItemWrapper = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
});

const HeaderRoot = styled('header', {
  backgroundColor: '$primary-800',
  color: 'White',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px',
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
