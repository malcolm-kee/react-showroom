import { Alert, tw, useIsClient } from '@showroomjs/ui';
import { GenericLink } from './generic-link';

export interface DocPlaceholderProps {
  componentFilePath: string;
  className?: string;
}

export function DocPlaceholder(props: DocPlaceholderProps) {
  const isClient = useIsClient();

  return isClient ? (
    <div className={tw(['my-4'], [props.className])}>
      <Alert variant="info">
        <div>
          <p className={tw(['mb-2'])}>
            There is no documentation/example for this component.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <>
              <p className={tw(['mb-2'])}>
                Create a file at the following location to start adding
                documentation/example:
              </p>
              <p className={tw(['mb-2'])}>
                <code>
                  {props.componentFilePath.replace(
                    /(\.(js|ts|jsx|tsx))$/,
                    '.mdx'
                  )}
                </code>
              </p>
              <p>
                To learn more about creating documentation/example for your
                component, visit{' '}
                <GenericLink
                  href="https://react-showroom.js.org/getting-started/documenting-components#show-usages-with-markdown"
                  className={tw(['underline'])}
                >
                  this page
                </GenericLink>
                .
              </p>
            </>
          )}
        </div>
      </Alert>
    </div>
  ) : null;
}
