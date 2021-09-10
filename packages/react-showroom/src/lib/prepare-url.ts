import * as url from 'url';

export function prepareUrls(
  protocol: string,
  host: string,
  port: number,
  pathname = '/'
) {
  const formatUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname,
    });
  const prettyPrintUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname,
    });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  const prettyHost = isUnspecifiedHost ? 'localhost' : host;
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    localUrlForTerminal,
    localUrlForBrowser,
  };
}
