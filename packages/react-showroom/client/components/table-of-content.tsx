import { ReactShowroomMarkdownHeading } from '@showroomjs/core/react';
import { Collapsible, EditIcon, tw } from '@showroomjs/ui';
import * as React from 'react';

export const TableOfContent = ({
  headings,
  editUrl,
}: {
  headings: Array<ReactShowroomMarkdownHeading>;
  editUrl: string | null;
}) => {
  const [submenuIsOpen, setSubmenuIsOpen] = React.useState<boolean | undefined>(
    false
  );

  const hasHeadings = headings && headings.length > 0;

  return (
    <div
      className={tw([
        'xl:sticky xl:w-1/4 xl:top-[64px] xl:bottom-0 xl:max-h-[calc(100vh-58px-2rem)]',
      ])}
    >
      {hasHeadings && (
        <Collapsible
          open={submenuIsOpen}
          onOpenChange={setSubmenuIsOpen}
          className={tw([
            'py-3 rounded-md overflow-hidden -mx-2 sm:mx-0 xl:hidden',
          ])}
        >
          <Collapsible.Button
            className={tw([
              'flex justify-between items-center w-full py-2 px-4 bg-zinc-100',
            ])}
          >
            In this page
            <Collapsible.ToggleIcon
              aria-label={submenuIsOpen ? 'Hide' : 'View'}
            />
          </Collapsible.Button>
          <Collapsible.Content className={tw(['pb-1 bg-zinc-50'])} animate>
            <ul
              className={tw([
                'list-none m-0 py-0 px-2 overflow-y-auto max-h-[300px] md:max-h-[500px]',
              ])}
            >
              {headings.map((heading, index) => (
                <li
                  style={{
                    paddingLeft: (heading.rank - 2) * 24,
                  }}
                  key={index}
                >
                  {heading.id ? (
                    <a
                      href={`#${heading.id}`}
                      dangerouslySetInnerHTML={{ __html: heading.text }}
                      className={tw([
                        'block p-2 text-sm no-underline text-inherit hover:text-primary-700 transition-colors',
                      ])}
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: heading.text }} />
                  )}
                </li>
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible>
      )}
      {editUrl ? (
        <div className={tw(['xl:hidden'])}>
          <EditLink floatRight url={editUrl} />
        </div>
      ) : null}
      <div className={tw(['hidden xl:block xl:sticky xl:top-0 py-4'])}>
        <div className={tw(['relative'])}>
          <div
            className={tw([
              'h-12 absolute inset-x-0 top-0 z-10 pointer-events-none',
            ])}
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)',
            }}
          />
          <div
            className={tw([
              'py-6 max-h-[80vh] overflow-auto border-l border-l-zinc-300 overscroll-contain',
            ])}
          >
            {hasHeadings && (
              <>
                <div
                  className={tw([
                    'pl-6 mb-2 text-zinc-400 uppercase text-sm font-bold tracking-wider',
                  ])}
                >
                  In this page
                </div>
                <ul className={tw(['list-none m-0 p-0'])}>
                  {headings.map((heading, index) => (
                    <li
                      className={tw(['text-zinc-600 pr-3'])}
                      style={{
                        paddingLeft: 16 + (heading.rank - 2) * 24,
                      }}
                      key={index}
                    >
                      {heading.id ? (
                        <a
                          href={`#${heading.id}`}
                          dangerouslySetInnerHTML={{ __html: heading.text }}
                          className={tw([
                            'block p-2 text-sm no-underline text-inherit hover:text-primary-700 transition-colors',
                          ])}
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: heading.text }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div
            className={tw([
              'h-12 absolute inset-x-0 bottom-0 z-10 pointer-events-none',
            ])}
            style={{
              backgroundImage:
                'linear-gradient(to top, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)',
            }}
          />
        </div>
        {editUrl ? (
          <div className={tw(['fixed z-20 bottom-6 pl-3'])}>
            <EditLink url={editUrl} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const EditLink = (props: {
  url: string;
  floatRight?: boolean;
  fullWidth?: boolean;
}) => (
  <a
    className={tw([
      props.floatRight && 'float-right',
      props.fullWidth ? 'flex' : 'inline-flex',
      'group/link text-xs items-center gap-2 px-3 py-1 text-zinc-400 hover:text-primary-600',
    ])}
    href={props.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span
      className={tw([
        'text-zinc-500 font-bold tracking-wider group-hover/link:text-primary-600',
      ])}
    >
      EDIT THIS PAGE
    </span>
    <EditIcon width={16} height={16} />
  </a>
);
