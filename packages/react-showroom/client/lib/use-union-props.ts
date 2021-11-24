import { isDefined } from '@showroomjs/core';
import {
  isType,
  useComponentMeta,
  parseSafely,
} from './component-props-context';

export const useUnionProps = (props: string) => {
  const componentMeta = useComponentMeta();
  const propTypes = componentMeta && componentMeta.props[props];

  if (
    propTypes &&
    isType(propTypes, 'enum') &&
    propTypes.type.raw !== 'ReactNode' &&
    Array.isArray(propTypes.type.value)
  ) {
    const parsedOptions = propTypes.type.value
      .map((raw) => {
        const value = parseSafely(raw.value);

        if (isDefined(value)) {
          return {
            value,
            label: String(value),
          };
        }
      })
      .filter(isDefined);

    return parsedOptions;
  }

  return [];
};
