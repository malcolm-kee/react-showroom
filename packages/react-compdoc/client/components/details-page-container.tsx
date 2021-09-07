import { ArrowLeftIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { icons } from '../stitches.config';
import { Div, NavLink } from './base';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => (
  <>
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
