import type { ReactShowroomSection } from '@showroomjs/core/react';
import { css, icons, styled } from '@showroomjs/ui';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Div, NavLink } from './base';

export const Sidebar = (props: { sections: Array<ReactShowroomSection> }) => {
  return (
    <Div
      as="nav"
      css={{
        paddingBottom: '$10',
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
  section: ReactShowroomSection;
  level?: number;
}) => {
  if ('slug' in section && section.slug === '') {
    return null;
  }

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
          <Div className={sectionClass()}>{section.title}</Div>
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
        <Link to={`/${section.slug}`} root={level === 0}>
          {section.data.component.displayName}
        </Link>
      );

    case 'markdown':
      return (
        <Link to={`/${section.slug}`} root={level === 0}>
          {section.title}
        </Link>
      );

    case 'link':
      return (
        <Link
          href={section.href}
          target="_blank"
          rel="noopener"
          as="a"
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

const Link = styled(NavLink, {
  display: 'block',
  color: '$gray-600',
  px: '$4',
  py: '$1',
  borderRadius: '$md',
  '&:hover': {
    backgroundColor: '$gray-200',
  },
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: '1px solid $primary-300',
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
