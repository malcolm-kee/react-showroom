import { ReactCompdocSection } from '@compdoc/core';
import { Option, SearchDialog, styled } from '@compdoc/ui';
import * as React from 'react';
import sections from 'react-compdoc-sections';
import { Link, useHistory } from 'react-router-dom';

export const Header = () => {
  const history = useHistory();

  const options = React.useMemo<Array<Option<string>>>(() => {
    const result: Array<Option<string>> = [];

    function collectOption(items: Array<ReactCompdocSection>) {
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
          <SearchDialog.Trigger>Search</SearchDialog.Trigger>
          <SearchDialog
            options={options}
            placeholder="Search docs"
            onSelect={(result) => {
              if (result) {
                history.push(`/${result}`);
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
  '@md': {
    fontSize: '$xl',
  },
});
