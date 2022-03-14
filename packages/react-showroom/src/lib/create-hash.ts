import * as crypto from 'crypto';

const cache = new Map<string, string>();

export const createHash = (value: string): string => {
  const cachedValue = cache.get(value);

  if (cachedValue) {
    return cachedValue;
  }

  const result = crypto.createHash('md5').update(value).digest('hex');

  cache.set(value, result);

  return result;
};
