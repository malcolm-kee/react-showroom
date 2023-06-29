import { tw } from '@showroomjs/ui';
import * as React from 'react';

export type ArticleProps = React.ComponentPropsWithoutRef<'article'> & {
  center?: boolean;
};

export const Article = React.forwardRef<HTMLElement, ArticleProps>(
  function Article({ center, ...props }, forwardedRef) {
    return (
      <article
        {...props}
        className={tw(
          ['pt-6 border-b border-b-zinc-200', center && 'max-w-screen-lg'],
          [props.className]
        )}
        ref={forwardedRef}
      />
    );
  }
);
