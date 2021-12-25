export const isDefined = <T>(value: T | undefined): value is T =>
  typeof value !== 'undefined';

export const isNil = (value: any): value is undefined | null =>
  typeof value === 'undefined' || value === null;

export const isNumber = (value: any): value is number =>
  typeof value === 'number';

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isBoolean = (value: any): value is boolean =>
  typeof value === 'boolean';

export const isFunction = (value: any): value is Function =>
  typeof value === 'function';

export function isPlainObject(value: unknown): value is object {
  if (typeof value !== 'object' || value === null) return false;

  let proto = Object.getPrototypeOf(value);
  if (proto === null) return true;

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}

export const isPrimitive = (value: any) => {
  const valueType = typeof value;
  return value === null || (valueType !== 'object' && valueType !== 'function');
};
