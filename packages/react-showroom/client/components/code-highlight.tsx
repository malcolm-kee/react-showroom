import Highlight, { Language, Prism, PrismTheme } from 'prism-react-renderer';
import * as React from 'react';
import { Fragment } from 'react';
import { styled } from '@showroomjs/ui';

export const CodeHighlight = (props: {
  code: string;
  language: Language;
  theme: PrismTheme;
  highlights?: number[];
}) => {
  const hasHighlight = props.highlights && props.highlights.length > 0;

  return (
    <Highlight
      Prism={Prism}
      {...props}
      language={isMarkdown(props.language) ? 'markdown' : props.language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <Line
              {...getLineProps({
                line,
                className:
                  props.highlights && props.highlights.includes(i + 1)
                    ? 'react-showroom-line-highlight'
                    : hasHighlight
                    ? 'react-showroom-line-dim'
                    : undefined,
                key: i,
              })}
            >
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </Line>
          ))}
        </Fragment>
      )}
    </Highlight>
  );
};

const Line = styled('div');

const isMarkdown = (language: Language) => ['md', 'mdx'].includes(language);
