import { getSafeName } from './get-safe-name';

const pkgs = ['react-showroom/client'] as const;

export const codeBlockOverrides = {
  get pkgs() {
    return pkgs;
  },
  createOverrides(overrides: {
    [key in typeof pkgs[number]]: any;
  }): Readonly<Record<string, any>> {
    return pkgs.reduce((acc, pkg) => {
      return {
        ...acc,
        [getSafeName(pkg)]: overrides[pkg],
      };
    }, {});
  },
} as const;
