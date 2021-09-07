import type { ReactCompdocSection } from '@compdoc/core';
import { slashToDash } from '../lib/slash-to-dash';
import { css, styled } from '../stitches.config';
import { A, Div, text } from './base';

export const Sidebar = (props: { sections: Array<ReactCompdocSection> }) => {
  return (
    <Div
      as="nav"
      css={{
        py: '$10',
        borderRight: '1px solid',
        borderRightColor: '$gray-300',
        minWidth: 240,
        background: '$gray-100',
        overflowY: 'auto',
      }}
    >
      {props.sections.map((section, i) => (
        <Section section={section} key={i} />
      ))}
    </Div>
  );
};

const Section = ({ section }: { section: ReactCompdocSection }) => {
  switch (section.type) {
    case 'group':
      return (
        <div>
          {section.Component ? (
            <A
              href={`#${slashToDash(section.slug)}`}
              className={sectionClass()}
            >
              {section.title}
            </A>
          ) : (
            <Div className={sectionClass()}>{section.title}</Div>
          )}
          <Div
            css={{
              px: '$2',
            }}
          >
            {section.items.map((section, i) => (
              <Section section={section} key={i} />
            ))}
          </Div>
        </div>
      );

    case 'component':
      return (
        <Link
          href={`#${slashToDash(section.slug)}`}
          className={text({ variant: 'lg' })}
        >
          {section.data.component.displayName}
        </Link>
      );

    case 'markdown':
      return (
        <Link
          href={`#${slashToDash(section.slug)}`}
          className={text({ variant: 'lg' })}
        >
          {section.title}
        </Link>
      );

    default:
      return null;
  }
};

const sectionClass = css({
  px: '$4',
  py: '$1',
  fontSize: '$sm',
  fontWeight: 'bolder',
  color: '$gray-500',
  textTransform: 'uppercase',
});

const Link = styled('a', {
  display: 'block',
  color: '$gray-600',
  px: '$4',
  py: '$1',
  borderRadius: '$md',
  '&:hover': {
    backgroundColor: '$gray-200',
  },
});
