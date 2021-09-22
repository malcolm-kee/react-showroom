import Highlight, { Language, Prism, PrismTheme } from 'prism-react-renderer';
import * as React from 'react';
import { Fragment } from 'react';

export const CodeHighlight = (props: {
  code: string;
  language: Language;
  theme: PrismTheme;
}) => (
  <Highlight
    Prism={Prism}
    {...props}
    language={isMarkdown(props.language) ? 'markdown' : props.language}
  >
    {({ tokens, getLineProps, getTokenProps }) => (
      <Fragment>
        {tokens.map((line, i) => (
          // eslint-disable-next-line react/jsx-key
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              // eslint-disable-next-line react/jsx-key
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </Fragment>
    )}
  </Highlight>
);

const isMarkdown = (language: Language) => ['md', 'mdx'].includes(language);
