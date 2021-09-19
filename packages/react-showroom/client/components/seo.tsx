import { useLocation } from '@showroomjs/bundles/routing';
import { Helmet, HelmetProps } from 'react-helmet';
import { THEME } from '../theme';

const SITE_URL = process.env.SITE_URL;

export const Seo = (props: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Head
      defaultTitle={THEME.title}
      titleTemplate={`%s | ${THEME.title}`}
      {...props}
    />
  );
};

export const Head = ({
  description,
  ...props
}: HelmetProps & {
  description?: string;
  children?: React.ReactNode;
}) => {
  const { pathname } = useLocation();

  const realUrl = SITE_URL && `${SITE_URL}${pathname === '/' ? '' : pathname}`;

  return (
    <Helmet>
      {realUrl && <link rel="canonical" href={realUrl} />}
      {props.title && <meta name="twitter:title" content={props.title}></meta>}
      <meta name="twitter:card" content="summary"></meta>
      {description && <meta name="description" content={description}></meta>}
      {description && (
        <meta name="twitter:description" content={description}></meta>
      )}
      <meta property="og:type" content="article" />
      {realUrl && <meta property="og:url" content={realUrl} />}
      {props.title && <meta property="og:title" content={props.title} />}
      {description && <meta property="og:description" content={description} />}
      {props.children}
    </Helmet>
  );
};
