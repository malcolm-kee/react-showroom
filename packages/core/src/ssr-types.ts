import { HelmetData } from 'react-helmet';

export interface Ssr {
  render: (options: { pathname: string }) => Promise<{
    result: string;
    cleanup: () => void;
  }>;
  getCssText: () => string;
  getHelmet: () => HelmetData;
  getRoutes: () => Promise<Array<string>>;
}
