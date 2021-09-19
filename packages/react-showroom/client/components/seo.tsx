import { useLocation } from '@showroomjs/bundles/routing';
import { Helmet } from 'react-helmet';
import { THEME } from '../theme';

const SITE_URL = process.env.SITE_URL;

export const Seo = (props: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  const { pathname } = useLocation();

  const realUrl = SITE_URL && `${SITE_URL}${pathname === '/' ? '' : pathname}`;

  return (
    <Helmet
      title={props.title}
      defaultTitle={THEME.title}
      titleTemplate={`%s | ${THEME.title}`}
    >
      {props.title && <meta name="twitter:title" content={props.title}></meta>}
      {realUrl && <link rel="canonical" href={realUrl} />}
      <meta name="twitter:card" content="summary"></meta>
      {props.description && (
        <meta name="description" content={props.description}></meta>
      )}
      {props.description && (
        <meta name="twitter:description" content={props.description}></meta>
      )}
      <meta property="og:type" content="article" />
      {realUrl && <link rel="canonical" href={realUrl} />}
      {props.title && <meta property="og:title" content={props.title} />}
      {props.description && (
        <meta property="og:description" content={props.description} />
      )}
      {props.children}
    </Helmet>
  );
};
