import { ArrowsExpandIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { slashToDash } from '../lib/slash-to-dash';
import { icons, styled } from '../stitches.config';
import { NavLink } from './base';
import { Code, Pre } from './code-block';
import { HashTag, Title } from './title';

const H1 = styled('h1', {
  fontSize: '$6xl',
  lineHeight: '$6xl',
  marginBottom: '$3',
});

interface MdxContextValue {
  title: string;
  titleSlug: string;
  showLinkToDetails?: boolean;
}

const MdxContext = React.createContext<MdxContextValue | undefined>(undefined);
MdxContext.displayName = 'MdxContext';

export const MdxContextProvider = MdxContext.Provider;

const Heading = (props: { children: React.ReactNode }) => {
  const mdx = React.useContext(MdxContext);

  if (mdx) {
    if (mdx.title === props.children) {
      const slug = slashToDash(mdx.titleSlug);

      return (
        <H1
          id={slug}
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title href={`#${slug}`}>
            <HashTag />
            {props.children}
          </Title>
          {mdx.showLinkToDetails && (
            <NavLink to={`/${mdx.titleSlug}`}>
              <ArrowsExpandIcon className={icons()} width={20} height={20} />
            </NavLink>
          )}
        </H1>
      );
    }
  }

  return <H1 {...props} />;
};

export const mdxComponents = {
  h1: Heading,
  h2: styled('h2', {
    fontSize: '$4xl',
    lineHeight: '$4xl',
    marginBottom: '$2',
  }),
  pre: Pre,
  code: Code,
  p: styled('p', {
    marginY: '$3',
  }),
} as const;
