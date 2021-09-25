import { HelmetData } from 'react-helmet';

export interface Ssr {
  render: (options: { pathname: string }) => Promise<string>;
  getCssText: () => string;
  getHelmet: () => HelmetData;
  getRoutes: () => Promise<Array<string>>;
}
