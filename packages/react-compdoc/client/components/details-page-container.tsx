import { icons } from '@compdoc/ui';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Div, NavLink } from './base';
import { Seo } from './seo';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => (
  <>
    <Seo title={props.title} />
    <Div
      as="nav"
      css={{
        maxWidth: '$screen2Xl',
        marginX: 'auto',
        padding: '$3',
      }}
    >
      <NavLink
        to="/"
        css={{
          padding: '$2',
        }}
      >
        <ArrowLeftIcon className={icons()} width={24} height={24} />
      </NavLink>
    </Div>
    <Div
      css={{
        maxWidth: '$screen2Xl',
        marginX: 'auto',
        padding: '$6',
      }}
    >
      {props.children}
    </Div>
  </>
);
