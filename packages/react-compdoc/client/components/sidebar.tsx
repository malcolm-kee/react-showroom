import type { ReactCompdocSection } from '@compdoc/core';
import { css, icons, styled } from '@compdoc/ui';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { slashToDash } from '../lib/slash-to-dash';
import { A, Div } from './base';

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

const Section = ({
  section,
  level = 0,
}: {
  section: ReactCompdocSection;
  level?: number;
}) => {
  switch (section.type) {
    case 'group':
      return (
        <Div
          css={{
            borderBottom: '1px solid $gray-200',
            py: '$2',
            marginBottom: '$2',
          }}
        >
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
              <Section section={section} level={level + 1} key={i} />
            ))}
          </Div>
        </Div>
      );

    case 'component':
      return (
        <Link href={`#${slashToDash(section.slug)}`} root={level === 0}>
          {section.data.component.displayName}
        </Link>
      );

    case 'markdown':
      return (
        <Link href={`#${slashToDash(section.slug)}`} root={level === 0}>
          {section.title}
        </Link>
      );

    case 'link':
      return (
        <Link
          href={section.href}
          target="_blank"
          rel="noopener"
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          root={level === 0}
        >
          {section.title}
          <ExternalLinkIcon className={icons()} width={20} height={20} />
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
  variants: {
    root: {
      true: {
        px: '$4',
        borderRadius: '$none',
      },
    },
  },
});
