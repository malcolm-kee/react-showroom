import { isNumber } from './type-guard';

/**
 * lightweight query string parsing shamelessly
 * copied and tweaked from https://github.com/kawanet/qs-lite/blob/master/qs-lite.js
 */
export function parseQueryString(input: string) {
  const obj: { [key: string]: string | string[] | undefined } = {};

  if (input) {
    const sanitizedInput = input[0] === '?' ? input.slice(1) : input;
    sanitizedInput.replace(/\+/g, ' ').split(/[&;]/).forEach(it);
  }
  return obj;

  function it(pair: string) {
    const len = pair.length;
    if (!len) return;
    let pos = pair.indexOf('=');
    if (pos < 0) pos = len;

    const key = decodeURIComponent(pair.substr(0, pos));
    const value = decodeURIComponent(pair.substr(pos + 1));

    const currentValue = obj[key];

    if (currentValue) {
      if (Array.isArray(currentValue)) {
        currentValue.push(value);
      } else {
        obj[key] = [currentValue, value];
      }
    } else {
      obj[key] = value;
    }
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const stringifyQueryString = (
  params:
    | {
        [key: string]:
          | string
          | boolean
          | number
          | Array<string | boolean | number>
          | undefined
          | null;
      }
    | undefined,
  preText = '?'
) => {
  if (!params) {
    return '';
  }

  const result: string[] = [];

  function collectPair(key: string, value: string | boolean | number) {
    result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  for (const key in params) {
    if (hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (isNumber(value) || value) {
        if (Array.isArray(value)) {
          value.forEach((val) => collectPair(key, val));
        } else {
          collectPair(key, value);
        }
      }
    }
  }

  return preText + result.join('&');
};
