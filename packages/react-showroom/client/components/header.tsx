import { ReactShowroomSection } from '@showroomjs/core/react';
import { Option, SearchDialog, styled } from '@showroomjs/ui';
import * as React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import sections from 'react-showroom-sections';

export const Header = () => {
  const history = useHistory();
  const location = useLocation<{ searchNavigated?: boolean }>();

  const options = React.useMemo<Array<Option<string>>>(() => {
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

    collectOption(sections);

    return result;
  }, []);

  return (
    <HeaderRoot>
      <HeaderInner>
        <Title to="/">{process.env.PAGE_TITLE}</Title>
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
          />
        </SearchDialog.Root>
      </HeaderInner>
    </HeaderRoot>
  );
};

const HeaderRoot = styled('header', {
  backgroundColor: '$primary-800',
  color: 'White',
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
