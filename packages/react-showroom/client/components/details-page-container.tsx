import { tw } from '@showroomjs/ui';
import * as React from 'react';
import { Seo } from './seo';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => {
  return (
    <>
      <Seo title={props.title} description={props.description} />
      <main className={tw(['flex-1 min-w-0 pb-12 bg-zinc-50'])}>
        <div className={tw(['max-w-screen-2xl mx-auto'])}>{props.children}</div>
      </main>
    </>
  );
};
