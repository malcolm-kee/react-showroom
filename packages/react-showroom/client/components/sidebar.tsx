import { ExternalLinkIcon, MenuIcon } from '@heroicons/react/outline';
import type { ReactShowroomSection } from '@showroomjs/core/react';
import {
  css,
  DropdownMenu,
  IconButton,
  icons,
  keyframes,
  Portal,
  styled,
  useIsClient,
} from '@showroomjs/ui';
import * as React from 'react';
import { audienceDefault } from '../lib/config';
import { isExternalLink } from '../lib/is-external-link';
import { NavLink, useNavigate } from '../lib/routing';
import { colorTheme, THEME } from '../theme';
import { AudienceDropdownGroup, AudienceToggle } from './audience-toggle';
import { Div } from './base';
import { GenericLink } from './generic-link';

const toggle = audienceDefault ? (
  <Div css={{ textAlign: 'right' }}>
    <AudienceToggle />
  </Div>
) : null;

const navBarItems = THEME.navbar.items;

export const Sidebar = (props: { sections: Array<ReactShowroomSection> }) => {
  const mobileSections = React.useMemo(() => {
    if (navBarItems) {
      return props.sections.concat({
        type: 'group',
        items: navBarItems
          .filter((item) => item.showInMobileMenu)
          .map((item) => ({
            type: 'link',
            href: item.to,
            title: item.label,
          })),
        slug: '',
        title: '',
      } as ReactShowroomSection);
    }

    return props.sections;
  }, [props.sections]);

  const isClient = useIsClient();

  return (
    <>
      <Div
        as="nav"
        css={{
          display: 'none',
          '@md': {
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 'var(--header-height, 64px)',
            left: 0,
            bottom: 0,
            height: 'calc(100vh - var(--header-height, 64px))',
          },
          borderRight: '1px solid',
          borderRightColor: '$gray-200',
          width: 240,
          background: '$gray-100',
          overflowY: 'auto',
          overscrollBehaviorBlock: 'contain',
        }}
      >
        <Div css={{ flex: 1 }}>
          {props.sections.map((section, i) => (
            <SidebarSection section={section} key={i} />
          ))}
        </Div>
        {toggle}
      </Div>
      {isClient && <MobileSidebar sections={mobileSections} />}
    </>
  );
};

const MobileSidebar = (props: { sections: Array<ReactShowroomSection> }) => (
  <Portal
    style={{
      position: 'fixed',
      top: 'auto',
      left: 'auto',
      right: 'calc(1rem + env(safe-area-inset-right, 24px))',
      bottom: 'calc(1rem + env(safe-area-inset-bottom, 24px))',
    }}
    className={colorTheme}
  >
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          css={{
            width: 48,
            height: 48,
            backgroundColor: '$primary-700',
            color: 'White',
            boxShadow:
              '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
            '&:hover': {
              backgroundColor: '$primary-900',
            },
            '@md': {
              display: 'none',
            },
          }}
        >
          <MenuIcon width={24} height={24} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={colorTheme}
        css={{
          maxHeight:
            'calc(100vh - env(safe-area-inset-bottom, 24px) - env(safe-area-inset-top, 24px) - 48px - 2rem)',
          maxWidth:
            'calc(100vw - env(safe-area-inset-right, 24px) - env(safe-area-inset-left, 24px) - 2rem)',
          overflowY: 'auto',
        }}
      >
        {props.sections.map((section, i) => (
          <DropdownSection section={section} key={i} index={i} />
        ))}
        {audienceDefault ? <AudienceDropdownGroup /> : null}
      </DropdownMenu.Content>
    </DropdownMenu>
  </Portal>
);

const DropdownSection = (props: {
  section: ReactShowroomSection;
  level?: number;
  index: number;
}) => {
  const section = props.section;

  const { navigate } = useNavigate();

  switch (section.type) {
    case 'component':
      return section.hideFromSidebar ? null : (
        <DropdownMenu.Item onSelect={() => navigate(`/${section.slug}`)}>
          {section.title}
        </DropdownMenu.Item>
      );

    case 'markdown':
      return section.hideFromSidebar ? null : (
        <DropdownMenu.Item onSelect={() => navigate(`/${section.slug}`)}>
          {section.formatLabel(
            section.frontmatter.title || section.fallbackTitle
          )}
        </DropdownMenu.Item>
      );

    case 'link':
      return (
        <DropdownMenu.Item asChild>
          <DropdownLink href={section.href} css={{ gap: '$2' }}>
            {section.title}
            {isExternalLink(section.href) && (
              <ExternalLinkIcon className={icons()} width={20} height={20} />
            )}
          </DropdownLink>
        </DropdownMenu.Item>
      );

    case 'group':
      return section.hideFromSidebar ? null : (
        <>
          {props.index !== 0 && <DropdownMenu.Separator />}
          <DropdownMenu.Label>{section.title}</DropdownMenu.Label>
          {section.items.map((sec, i) => (
            <DropdownSection section={sec} key={i} index={i} />
          ))}
        </>
      );

    default:
      return null;
  }
};

const SidebarSection = ({
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
      return section.hideFromSidebar ? null : (
        <Div
          css={{
            marginY: '$4',
          }}
        >
          <Div className={sectionClass()}>{section.title}</Div>
          {section.items.map((section, i) => (
            <SidebarSection section={section} level={level + 1} key={i} />
          ))}
        </Div>
      );

    case 'component':
      return section.hideFromSidebar ? null : (
        <Div css={{ px: '$2' }}>
          <Link to={`/${section.slug}`} root={level === 0} exact>
            {section.title}
          </Link>
        </Div>
      );

    case 'markdown':
      return section.hideFromSidebar ? null : (
        <Div css={{ px: '$2' }}>
          <Link to={`/${section.slug}`} root={level === 0} exact>
            {section.formatLabel(
              section.frontmatter.title || section.fallbackTitle
            )}
          </Link>
        </Div>
      );

    case 'link':
      return (
        <Div css={{ px: '$2' }}>
          <Link
            href={section.href}
            target="_blank"
            rel="noopener"
            as={GenericLink}
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '$2',
              alignItems: 'center',
              px: '$2',
              borderRadius: '$md',
            }}
            root={level === 0}
          >
            {section.title}
            {isExternalLink(section.href) && (
              <ExternalLinkIcon className={icons()} width={16} height={16} />
            )}
          </Link>
        </Div>
      );

    default:
      return null;
  }
};

const sectionClass = css({
  px: '$4',
  py: '$1',
  fontSize: '$xs',
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  color: '$gray-400',
  textTransform: 'uppercase',
});

const DropdownLink = styled(GenericLink, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const fadeInOut = keyframes({
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0.6,
  },
});

const Link = styled(NavLink, {
  display: 'block',
  color: '$gray-600',
  textDecoration: 'none',
  px: '$2',
  py: '$1',
  borderRadius: '$md',
  fontSize: '$sm',
  lineHeight: '$sm',
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
  '&[aria-current="page"]': {
    color: '$primary-900',
    backgroundColor: 'White',
  },
  '&[aria-busy]': {
    animation: `${fadeInOut} 500ms infinite alternate`,
  },
});
