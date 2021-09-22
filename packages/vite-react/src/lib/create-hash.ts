import * as crypto from 'crypto';

export const createHash = (value: string) =>
  crypto.createHash('md5').update(value).digest('hex');
