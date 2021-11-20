import { isNil } from '@showroomjs/core';

export interface FormatMoneyOptions {
  decimalPlaces?: number;
}

const numberFormatters: Record<string, Intl.NumberFormat> = {};

/**
 *
 * @param value the number value that you wish to format
 * @param currency can be 'MYR'
 */
export const formatMoney = (
  value: string | number | undefined | null,
  { decimalPlaces = 2 }: FormatMoneyOptions = {}
): string => {
  if (isNil(value)) {
    return '';
  }

  const numValue = typeof value === 'number' ? value : Number(value);

  let displayValue = '';

  if (isNaN(numValue)) {
    return value as string;
  }

  if (featureCheck.intlNumberFormat) {
    if (!numberFormatters[decimalPlaces]) {
      numberFormatters[decimalPlaces] = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
    }

    displayValue = numberFormatters[decimalPlaces].format(numValue);
  } else {
    displayValue = insertThousandSeparator(numValue.toFixed(decimalPlaces));
  }

  return displayValue;
};

const featureCheck = {
  intlNumberFormat: !!(
    Intl &&
    typeof Intl === 'object' &&
    typeof Intl.NumberFormat === 'function'
  ),
};

const commaPositionRegex = /\B(?=(\d{3})+(?!\d))/g;

export function insertThousandSeparator(number: string | number): string {
  const numString = String(number);
  if (numString.includes('.')) {
    const [integer, decimal] = numString.split('.');
    return `${integer.replace(commaPositionRegex, ',')}.${decimal}`;
  }
  return numString.replace(commaPositionRegex, ',');
}
