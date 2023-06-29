import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from '@heroicons/react/20/solid';
import { Bars3Icon as MenuIcon } from '@heroicons/react/24/outline';
import type { ReactShowroomSection } from '@showroomjs/core/react';
import {
  Collapsible,
  DropdownMenu,
  IconButton,
  Portal,
  iconClass,
  tw,
  useIsClient,
} from '@showroomjs/ui';
import * as React from 'react';
import { audienceDefault } from '../lib/config';
import { isExternalLink } from '../lib/is-external-link';
import { NavLink, useNavigate } from '../lib/routing';
import { THEME, colorTheme } from '../theme';
import { AudienceDropdownGroup, AudienceToggle } from './audience-toggle';

const toggle = audienceDefault ? (
  <div className={tw(['text-right'])}>
    <AudienceToggle />
  </div>
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
      <nav
        className={tw([
          'hidden md:flex md:flex-col md:sticky md:left-0 md:bottom-0',
          'md:top-[var(--header-height)] md:h-[calc(100vh-var(--header-height))]',
          'border-r border-zinc-200 w-60 bg-zinc-100 overflow-y-scroll overscroll-contain',
        ])}
      >
        <div className={tw(['flex-1'])}>
          {props.sections.map((section, i) => (
            <SidebarSection section={section} key={i} />
          ))}
        </div>
        {toggle}
      </nav>
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
          className={tw(['md:hidden shadow-lg'])}
          colorClass={tw(['!bg-primary-700 !text-white hover:!bg-primary-900'])}
          sizeClass={tw(['w-12 h-12'])}
        >
          <MenuIcon width={24} height={24} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={colorTheme}
        style={{
          maxHeight:
            'calc(100vh - env(safe-area-inset-bottom, 24px) - env(safe-area-inset-top, 24px) - 100px - 2rem)',
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
          <a
            href={section.href}
            className={tw(['flex justify-between items-center gap-2'])}
          >
            {section.title}
            {isExternalLink(section.href) && (
              <ExternalLinkIcon className={iconClass} width={20} height={20} />
            )}
          </a>
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
      if (section.hideFromSidebar) {
        return null;
      }

      if (section.collapsible) {
        return (
          <Collapsible
            className={tw(['my-4 first:mt-1'])}
            defaultOpen={section.collapsible === 'expand-by-default'}
          >
            <Collapsible.Trigger
              className={tw([
                'flex justify-between items-center w-full px-4 py-1 text-left hover:bg-zinc-200',
              ])}
            >
              <span
                className={tw([
                  'text-xs leading-5 font-bold tracking-wider uppercase text-zinc-400',
                ])}
              >
                {section.title}
              </span>
              <Collapsible.ToggleIcon />
            </Collapsible.Trigger>
            <Collapsible.Content animate>
              {section.items.map((section, i) => (
                <SidebarSection section={section} level={level + 1} key={i} />
              ))}
            </Collapsible.Content>
          </Collapsible>
        );
      }

      return (
        <div className={tw(['my-4 first:mt-1'])}>
          <div
            className={tw([
              'px-4 py-1 text-xs font-bold tracking-wider uppercase text-zinc-400',
            ])}
          >
            {section.title}
          </div>
          {section.items.map((section, i) => (
            <SidebarSection section={section} level={level + 1} key={i} />
          ))}
        </div>
      );

    case 'component':
      return section.hideFromSidebar ? null : (
        <SidebarLink to={`/${section.slug}`} root={level === 0} exact>
          {section.title}
        </SidebarLink>
      );

    case 'markdown':
      return section.hideFromSidebar ? null : (
        <SidebarLink to={`/${section.slug}`} root={level === 0} exact>
          {section.formatLabel(
            section.frontmatter.title || section.fallbackTitle
          )}
        </SidebarLink>
      );

    case 'link':
      return (
        <SidebarLink
          to={section.href}
          target="_blank"
          rel="noopener"
          root={false}
        >
          <div className={tw(['flex justify-between items-center gap-2'])}>
            {section.title}
            {isExternalLink(section.href) && (
              <ExternalLinkIcon className={iconClass} width={16} height={16} />
            )}
          </div>
        </SidebarLink>
      );

    default:
      return null;
  }
};

const SidebarLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NavLink> & { root?: boolean }
>(function SidebarLink({ root, to, ...props }, forwardedRef) {
  const className = tw(
    [
      'block py-1 text-sm text-zinc-500 no-underline border-r-4 border-transparent',
      'hover:bg-zinc-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-300',
      root ? 'pl-6 pr-5' : 'pl-4 pr-3',
      'aria-[current=page]:text-primary-800 aria-[current=page]:bg-white aria-[current=page]:border-primary-700',
      'aria-[busy]:animate-pulse',
    ],
    [props.className]
  );

  if (props.target === '_blank') {
    return <a {...props} href={to} className={className} ref={forwardedRef} />;
  }

  return (
    <NavLink {...props} to={to} className={className} ref={forwardedRef} />
  );
});
