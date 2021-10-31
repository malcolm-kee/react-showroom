import { Alert, styled, useIsClient } from '@showroomjs/ui';
import * as React from 'react';
import { GenericLink } from './generic-link';

export interface DocPlaceholderProps {
  componentFilePath: string;
  className?: string;
}

export const DocPlaceholder = styled(
  function DocPlaceholder(props: DocPlaceholderProps) {
    const isClient = useIsClient();

    return isClient ? (
      <div className={props.className}>
        <Alert variant="info">
          <div>
            <P>There is no documentation/example for this component.</P>
            {process.env.NODE_ENV === 'development' && (
              <>
                <P>
                  Create a file at the following location to start adding
                  documentation/example:
                </P>
                <P>
                  <code>
                    {props.componentFilePath.replace(
                      /(\.(js|ts|jsx|tsx))$/,
                      '.mdx'
                    )}
                  </code>
                </P>
                <p>
                  To learn more about creating documentation/example for your
                  component, visit{' '}
                  <Link href="https://react-showroom.js.org/getting-started/documenting-components#show-usages-with-markdown">
                    this page
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </Alert>
      </div>
    ) : null;
  },
  {
    marginY: '$4',
  }
);

const Link = styled(GenericLink, {
  textDecoration: 'underline',
});

const P = styled('p', {
  marginBottom: '$2',
});
