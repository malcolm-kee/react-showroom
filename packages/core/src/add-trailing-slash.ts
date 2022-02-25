import { isString } from './type-guard';

export const addTrailingSlash = (path: string) =>
  isString(path) && (path.endsWith('/') || path === '') ? path : path + '/';
