import * as React from 'react';
import { isExternalLink } from '../lib/is-external-link';
import { Link } from '../lib/routing';

export const GenericLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'>
>(function GenericLink({ href, ...props }, ref) {
  if (href && href.startsWith('/')) {
    return <Link to={href} {...props} ref={ref} />;
  }
  const isExternal = isExternalLink(href);

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopenner noreferrer' : undefined}
      {...props}
      ref={ref}
    />
  );
});
