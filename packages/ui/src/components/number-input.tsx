import { useRifm } from 'rifm';
import { callAll, noop, isDefined, isNumber } from '@showroomjs/core';
import { formatMoney } from '../lib/number';
import { TextInput, TextInputProps } from './text-input';
import { styled } from '../stitches.config';

export interface NumberInputProps
  extends Omit<TextInputProps, 'value' | 'onValue' | 'type' | 'max'> {
  value: string;
  /**
   * callback when value change. The value not contains comma.
   */
  onValue?: (newValue: string) => void;
  /**
   * maximum decimal places that user can input
   */
  decimalPlaces?: number;
  /**
   * allow trailing zero. By default, user cannot type 0 character for last decimal place.
   */
  allowTrailingZero?: boolean;
  /**
   * allow negative number. By default, only positive number is allowed.
   *
   * Be careful that with this props set to `true`, you need to handle the edge case that `value` may be `"-"` before converting it to number.
   */
  allowNegative?: boolean;
  /**
   * maximum value that is allowed. If you enter more than this value, last character will be trimmed.
   */
  max?: number;
}

/**
 * NumberInput allows user to enter number that is formatted with fixed number of decimal places.
 * The value will be displayed with thousand separators.
 *
 * It accepts all props that an `<input />` element accepts except `type`.
 */
const NumberInputImpl = styled(function NumberInput({
  decimalPlaces = 2,
  onValue = noop,
  allowTrailingZero,
  allowNegative,
  max,
  ...inputProps
}: NumberInputProps) {
  const { value, onChange } = useRifm({
    value: inputProps.value,
    onChange: (newVal) =>
      onValue(parseNumber(newVal, decimalPlaces === 0, max, allowNegative)),
    accept: /[\d.-]/g,
    format: (val) =>
      formatFixedPointNumber(
        val,
        decimalPlaces,
        max,
        allowTrailingZero,
        allowNegative
      ),
  });

  return (
    <TextInput
      {...inputProps}
      value={value}
      onChange={callAll(onChange, inputProps.onChange)}
    />
  );
});

const getNumberValue = (value: string | number): number | undefined => {
  if (isNumber(value)) {
    return value;
  }

  if (value === '' || value === '-') {
    return undefined;
  }

  const numValue = Number(value);

  return isNaN(numValue) ? undefined : numValue;
};

export const NumberInput = Object.assign(NumberInputImpl, {
  getNumberValue,
});

const numberAccept = /[\d.]+/g;
const negativeNumberAccept = /[\d.-]+/g;
const integerAccept = /[\d]+/g;
const negativeIntegerAccept = /[\d-]]+/g;
const MAX_SAFE_LENGTH = 16; // length of Number.MAX_SAFE_INTEGER

const parseNumber = (
  stringValue: string | number,
  isInteger: boolean,
  max: number | undefined,
  allowNegative: boolean | undefined
) => {
  const string = String(stringValue);

  const result = (
    string.match(
      allowNegative
        ? isInteger
          ? negativeIntegerAccept
          : negativeNumberAccept
        : isInteger
        ? integerAccept
        : numberAccept
    ) || []
  )
    .join('')
    .substring(0, MAX_SAFE_LENGTH);

  if (isDefined(max) && Number(result) > max) {
    let finalResult = '';

    for (let index = 0; index < result.length; index++) {
      const char = result.charAt(index);

      const newResult = `${finalResult}${char}`;

      if (Number(newResult) > max) {
        return finalResult;
      }

      finalResult = newResult;
    }

    return finalResult;
  }

  return result;
};

const formatFixedPointNumber = (
  value: string,
  decimalPlaces: number,
  max: number | undefined,
  allowTrailingZero: boolean | undefined,
  allowNegative: boolean | undefined
) => {
  const parsed = parseNumber(value, decimalPlaces === 0, max, allowNegative);

  if (parsed === '-') {
    return '-';
  }

  const [head, tail] = parsed.split('.');
  // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
  // must not to convert it to 1.24, it must stay 1.23
  const scaledTail = tail != null ? tail.slice(0, decimalPlaces) : '';

  let number = Number.parseFloat(`${head}.${scaledTail}`);

  if (Number.isNaN(number)) {
    return '';
  }

  const formatted = formatMoney(number, {
    maxDecimal: scaledTail.length,
    minDecimal: scaledTail.length,
  });

  if (parsed.includes('.')) {
    const [formattedHead] = formatted.split('.');

    // skip zero at digits position for non fixed floats
    // as at digits 2 for non fixed floats numbers like 1.50 has no sense, just 1.5 allowed
    // but 1.0 has sense as otherwise you will not be able to enter 1.05 for example
    const formattedTail =
      scaledTail !== '' &&
      scaledTail[decimalPlaces - 1] === '0' &&
      !allowTrailingZero
        ? scaledTail.slice(0, -1)
        : scaledTail;

    return `${formattedHead}.${formattedTail}`;
  }

  return formatted;
};
