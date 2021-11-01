import { styled, Collapsible } from '@showroomjs/ui';
import { isPlainObject } from '@showroomjs/core';
import * as React from 'react';
import { useConsoleMessage } from '../lib/use-preview-console';

export const ConsolePanel = () => {
  const msgs = useConsoleMessage();

  const [isShown, setIsShown] = React.useState(false);

  return msgs.length === 0 ? null : (
    <Collapsible.Root open={isShown} onOpenChange={setIsShown}>
      <SummaryBar>
        <Collapsible.Button
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '$1',
            fontSize: '$sm',
          }}
        >
          Console ({msgs.length}){' '}
          <Collapsible.ToggleIcon
            hide={isShown}
            aria-label={isShown ? 'Hide' : 'View'}
            width="16"
            height="16"
          />
        </Collapsible.Button>
      </SummaryBar>
      <Collapsible.Content
        animate
        css={{
          px: 4,
          paddingBottom: 4,
          backgroundColor: '$gray-100',
        }}
      >
        <Wrapper>
          {msgs.map((msg, i) =>
            msg.level === 'fatal' ? (
              <Item
                css={{
                  backgroundColor: '$red-800',
                }}
                key={i}
              >
                {msg.count > 1 && <Count>{msg.count}</Count>}
                {msg.data.map((d, i) => (
                  <Content content={d} key={i} wrapString={false} />
                ))}
              </Item>
            ) : (
              <Item key={i}>
                <ContentInner
                  css={{
                    width: '7ch',
                    color:
                      msg.level === 'error'
                        ? '#FCA5A5'
                        : msg.level === 'info'
                        ? '#93C5FD'
                        : msg.level === 'warn'
                        ? '#FDE68A'
                        : undefined,
                  }}
                >
                  [{msg.level}]
                </ContentInner>
                {msg.count > 1 && <Count>{msg.count}</Count>}
                {msg.data.map((d, i) => (
                  <Content content={d} key={i} />
                ))}
              </Item>
            )
          )}
        </Wrapper>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const Content = ({
  content,
  wrapString = true,
}: {
  content: any;
  wrapString?: boolean;
}) => {
  if (Array.isArray(content)) {
    return (
      <>
        [
        {content.map((c, i, all) => (
          <React.Fragment key={i}>
            <Content content={c} wrapString={wrapString} />
            {i !== all.length - 1 && ','}
          </React.Fragment>
        ))}
        ]
      </>
    );
  }

  const contentType = typeof content;

  switch (contentType) {
    case 'undefined':
      return (
        <ContentInner
          css={{
            opacity: '60%',
          }}
        >
          undefined
        </ContentInner>
      );

    case 'boolean':
      return (
        <ContentInner
          css={{
            color: '$blue-100',
          }}
        >
          {String(content)}
        </ContentInner>
      );

    case 'string':
      return (
        <ContentInner
          css={{
            color: '$red-100',
          }}
        >
          {wrapString ? `'${content}'` : content}
        </ContentInner>
      );

    case 'object':
      return content === null ? (
        <ContentInner
          css={{
            opacity: '60%',
          }}
        >
          null
        </ContentInner>
      ) : isPlainObject(content) ? (
        <ContentInner>{JSON.stringify(content)}</ContentInner>
      ) : (
        <span>
          <ContentInner
            css={{
              fontStyle: 'italic',
            }}
          >
            {getConstructorName(content)}
          </ContentInner>
          {getObjectDetails(content)}
        </span>
      );

    default:
      return null;
  }
};

const wrapIfString = (val: unknown) =>
  typeof val === 'string' ? `'${val}'` : val;

const getObjectDetails = (val: object) =>
  val instanceof Date
    ? ` (${val.toString()})`
    : val instanceof Map
    ? `(${val.size})${
        val.size > 0
          ? ` {${Array.from(val.entries())
              .map(
                ([key, value]) =>
                  `${wrapIfString(key)} => ${wrapIfString(value)}`
              )
              .join(', ')}}`
          : ''
      }`
    : null;

const getConstructorName = (obj: object) =>
  Object.getPrototypeOf(obj)?.constructor?.name;

const Wrapper = styled('ul', {
  shadow: 'inner',
  backgroundColor: '$gray-800',
  color: 'White',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  py: '$1',
});

const Item = styled('li', {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: '$2',
  fontSize: '$sm',
  lineHeight: '$sm',
  fontFamily: 'monospace',
  px: '$2',
});

const Count = styled('span', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  width: 16,
  height: 16,
  fontSize: '$xs',
  lineHeight: '$xs',
  backgroundColor: '$gray-500',
  color: 'White',
});

const ContentInner = styled('span');

const SummaryBar = styled('div', {
  padding: '$1',
  backgroundColor: '$gray-100',
});
