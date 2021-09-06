import type { ComponentDocItem } from 'react-compdoc-components';
import { getComponentSlug } from '../lib/get-component-slug';
import { A, Div, text } from './base';

export const Sidebar = (props: { items: Array<ComponentDocItem> }) => {
  return (
    <Div
      as="nav"
      css={{
        py: '$10',
        borderRight: '1px solid',
        borderRightColor: '$gray-300',
        minWidth: 240,
        background: '$gray-100',
        overflowY: 'auto',
      }}
    >
      <Div
        as="ul"
        css={{
          px: '$2',
        }}
      >
        {props.items.map((item) => (
          <li key={item.component.filePath}>
            <A
              href={`#${getComponentSlug(item.component)}`}
              css={{
                display: 'block',
                color: '$gray-600',
                px: '$4',
                py: '$1',
                borderRadius: '$md',
                '&:hover': {
                  backgroundColor: '$gray-200',
                },
              }}
              className={text({ variant: 'lg' })}
            >
              {item.component.displayName}
            </A>
          </li>
        ))}
      </Div>
    </Div>
  );
};
