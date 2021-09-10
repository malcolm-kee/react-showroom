const PAGE_TITLE = process.env.PAGE_TITLE;
import { Helmet } from 'react-helmet';

export const Seo = (props: { title?: string }) => (
  <Helmet
    title={props.title}
    defaultTitle={PAGE_TITLE}
    titleTemplate={`%s | ${PAGE_TITLE}`}
  />
);
