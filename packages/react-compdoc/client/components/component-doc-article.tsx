import type { ReactCompdocComponentSection } from '@compdoc/core';
import { icons } from '@compdoc/ui';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Div, NavLink } from '../components/base';
import { slashToDash } from '../lib/slash-to-dash';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactCompdocComponentSection;
  mode: 'standalone' | 'embedded';
}) => {
  const { doc: Doc } = props.doc.data;

  const homelinkRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (
      homelinkRef.current &&
      document &&
      document.activeElement === document.body
    ) {
      homelinkRef.current.focus();
    }
  }, []);

  return (
    <>
      <Article standalone={props.mode === 'standalone'}>
        <ComponentMeta
          section={props.doc}
          propsDefaultOpen={!Doc}
          showLinkToDetails={props.mode === 'embedded'}
        />
        {Doc && <Doc components={mdxComponents} />}
      </Article>
      {props.mode === 'standalone' && (
        <Div
          as="nav"
          css={{
            padding: '$3',
          }}
        >
          <NavLink
            to={`/#${slashToDash(props.doc.slug)}`}
            css={{
              padding: '$2',
              borderRadius: '$xl',
              border: '1px solid transparent',
              '&:focus': {
                outline: 'none',
              },
              '&:focus-visible': {
                border: '1px solid $primary-300',
              },
            }}
            ref={homelinkRef}
          >
            <ArrowLeftIcon className={icons()} width={24} height={24} />
          </NavLink>
        </Div>
      )}
    </>
  );
};
