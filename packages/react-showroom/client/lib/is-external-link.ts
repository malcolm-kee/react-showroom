export const isExternalLink = (href: string | undefined) =>
  !!href && !href.startsWith('#') && !href.startsWith('/');
