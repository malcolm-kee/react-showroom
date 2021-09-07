import { HelmetData } from 'react-helmet';

export interface Ssr {
  render: (options?: { pathname?: string }) => string;
  getCssText: () => string;
  getHelmet: () => HelmetData;
}
