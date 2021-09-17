import { Helmet } from 'react-helmet';
import { THEME } from '../theme';

export const Seo = (props: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) => (
  <Helmet
    title={props.title}
    defaultTitle={THEME.title}
    titleTemplate={`%s | ${THEME.title}`}
  >
    {props.title && <meta name="twitter:title" content={props.title}></meta>}
    <meta name="twitter:card" content="summary"></meta>
    {props.description && (
      <meta name="description" content={props.description}></meta>
    )}
    {props.description && (
      <meta name="twitter:description" content={props.description}></meta>
    )}
    <meta property="og:type" content="article" />
    {props.title && <meta property="og:title" content={props.title} />}
    {props.description && (
      <meta property="og:description" content={props.description} />
    )}
    {props.children}
  </Helmet>
);
