import { Helmet } from 'react-helmet';
import { THEME } from '../theme';

export const Seo = (props: { title?: string }) => (
  <Helmet
    title={props.title}
    defaultTitle={THEME.title}
    titleTemplate={`%s | ${THEME.title}`}
  />
);
