export const isDefined = <T>(value: T | undefined): value is T =>
  typeof value !== 'undefined';

export const isNil = (value: any): value is undefined | null =>
  typeof value === 'undefined' || value === null;

export const isNumber = (value: any): value is number =>
  typeof value === 'number';

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isFunction = (value: any): value is Function =>
  typeof value === 'function';
