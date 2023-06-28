import { isPlainObject } from '@showroomjs/core';
import { Collapsible, tw } from '@showroomjs/ui';
import * as React from 'react';
import { useConsoleMessage } from '../lib/use-preview-console';

export const ConsolePanel = ({
  defaultIsOpen = false,
  isCompiling,
}: {
  defaultIsOpen?: boolean;
  isCompiling?: boolean;
}) => {
  const msgs = useConsoleMessage();

  const [isShown, setIsShown] = React.useState(defaultIsOpen);

  return msgs.length === 0 ? null : (
    <Collapsible open={isShown} onOpenChange={setIsShown}>
      <div className={tw(['p-1 bg-zinc-100'])}>
        <Collapsible.Button className={tw(['flex items-center gap-1 text-sm'])}>
          Console ({msgs.length}){' '}
          <Collapsible.ToggleIcon
            direction={isShown ? 'up' : 'down'}
            aria-label={isShown ? 'Hide' : 'View'}
          />
        </Collapsible.Button>
      </div>
      <Collapsible.Content animate className={tw(['px-1 pb-1 bg-zinc-100'])}>
        <ul className={tw(['flex flex-col gap-1 py-1 text-white bg-zinc-800'])}>
          {msgs.map((msg, i) =>
            msg.level === 'fatal' ? (
              <Item className={tw(['bg-red-800'])} key={i}>
                {msg.count > 1 && <Count>{msg.count}</Count>}
                {msg.data.map((d, i) => (
                  <Content content={d} key={i} wrapString={false} />
                ))}
              </Item>
            ) : (
              <Item key={i}>
                <span
                  style={{
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
                </span>
                {msg.count > 1 && <Count>{msg.count}</Count>}
                {msg.data.map((d, i) => (
                  <Content content={d} key={i} />
                ))}
              </Item>
            )
          )}
          {isCompiling && <Item>Compiling...</Item>}
        </ul>
      </Collapsible.Content>
    </Collapsible>
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
      return <span className={tw(['opacity-60'])}>undefined</span>;

    case 'boolean':
      return <span className={tw(['text-blue-100'])}>{String(content)}</span>;

    case 'string':
      return (
        <span className={tw(['text-red-100'])}>
          {wrapString ? `'${content}'` : content}
        </span>
      );

    case 'object':
      return content === null ? (
        <span className={tw(['opacity-60'])}>null</span>
      ) : isPlainObject(content) ? (
        <span>{JSON.stringify(content)}</span>
      ) : (
        <span>
          <span className={tw(['italic'])}>{getConstructorName(content)}</span>
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

const Item = (props: { className?: string; children: React.ReactNode }) => (
  <li
    {...props}
    className={tw(
      ['flex items-center flex-wrap gap-y-2 text-sm font-[monospace] px-2'],
      [props.className]
    )}
  />
);

const Count = ({ children }: { children: React.ReactNode }) => (
  <span
    className={tw([
      'flex justify-center items-center w-4 h-4 text-xs bg-zinc-500 text-white rounded-full',
    ])}
  >
    {children}
  </span>
);
