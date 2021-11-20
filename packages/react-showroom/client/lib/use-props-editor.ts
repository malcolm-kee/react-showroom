import {
  isBoolean,
  isDefined,
  isNil,
  isNumber,
  isString,
  createSymbol,
} from '@showroomjs/core';
import { NumberInput, useId } from '@showroomjs/ui';
import * as React from 'react';
import { ComponentDoc, PropItem } from 'react-docgen-typescript';
import { findBestMatch } from 'string-similarity';
import { useComponentMeta } from './component-props-context';

export type ControlType = 'checkbox' | 'text' | 'object' | 'file' | 'number';

export const NonLiteralValue = createSymbol('NonLiteral');

export interface UsePropsEditorOptions {
  initialProps?: Record<string, any>;
  controls?: Record<string, PropsEditorControlDef | ControlType | undefined>;
  includes?: Array<string>;
}

export type PropsEditorControlData = PropsEditorControl & {
  value: any;
  setValue: (val: any) => void;
};

export const usePropsEditor = ({
  initialProps = {},
  controls: providedControls = {},
  includes,
}: UsePropsEditorOptions = {}) => {
  const controls = normalizeControls(providedControls);

  const componentMeta = useComponentMeta();
  const id = useId();

  const [state, dispatch] = React.useReducer(
    propsEditorReducer,
    { componentMeta, initialProps, controls },
    initState
  );

  const props = { ...state.values };

  Object.entries(state.values).forEach(([prop, value]) => {
    const control = state.controls.find((ctrl) => ctrl.key === prop);

    if (control && control.type === 'number') {
      props[prop] = NumberInput.getNumberValue(value);
    }
  });

  return {
    props,
    controls: (includes
      ? state.controls.filter((ctrl) => includes.includes(ctrl.key))
      : state.controls
    ).map(
      (control): PropsEditorControlData => ({
        ...control,
        key: `${id}${control.key}`,
        value: state.values[control.label],
        setValue: (value: any) =>
          dispatch({
            type: 'setValue',
            prop: control.label,
            value,
          }),
      })
    ),
  };
};

const normalizeControls = (
  provided: Record<string, PropsEditorControlDef | ControlType | undefined>
): Record<string, PropsEditorControlDef | undefined> => {
  const result: Record<string, PropsEditorControlDef | undefined> = {};

  Object.keys(provided).forEach((prop) => {
    const config = provided[prop];

    if (isString(config)) {
      result[prop] = {
        type: config,
      };
    } else if (config && config.type === 'select') {
      result[prop] = {
        ...config,
        options: Array.isArray(config.options)
          ? config.options.map(({ type = 'literal', value, label }) => ({
              type,
              value,
              label,
            }))
          : config.options,
      };
    } else {
      result[prop] = config;
    }
  });

  return result;
};
export interface SelectOption {
  label: string;
  value: any;
  type: 'literal' | ControlType;
}

export interface EditorControlBase {
  label: string;
  key: string;
}

export type PropsEditorControlDef =
  | {
      type: 'checkbox';
    }
  | {
      type: 'select';
      options: Array<SelectOption>;
    }
  | {
      type: 'text';
    }
  | {
      type: 'number';
    }
  | {
      type: 'object';
    }
  | {
      type: 'file';
    };

export type PropsEditorControl = EditorControlBase & PropsEditorControlDef;

export interface PropsEditorState {
  controls: Array<PropsEditorControl>;
  values: Record<string, any>;
}

type PropsEditorEvent =
  | {
      type: 'init';
      componentMeta: ComponentDoc | undefined;
      controls: Record<string, PropsEditorControlDef | undefined>;
      initialProps: Record<string, any>;
    }
  | {
      type: 'setValue';
      prop: string;
      value: any;
    };

const initState = ({
  componentMeta,
  initialProps,
  controls: controlOverrides,
}: {
  componentMeta: ComponentDoc | undefined;
  initialProps: Record<string, any>;
  controls: Record<string, PropsEditorControlDef | undefined>;
}): PropsEditorState => {
  if (!componentMeta) {
    return {
      controls: [],
      values: initialProps,
    };
  }

  const propItems = Object.values(componentMeta.props);
  const controls: Array<PropsEditorControl> = [];
  const values: Record<string, any> = { ...initialProps };

  propItems.forEach((prop) => {
    const isDeprecated = prop.tags && hasProperty(prop.tags, 'deprecated');

    if (isDeprecated) {
      return;
    }

    const initialValue = (function getInitialValue() {
      if (hasProperty(initialProps, prop.name)) {
        return undefined;
      }
      const declaredDefaultValue = prop.defaultValue && prop.defaultValue.value;

      return !isNil(declaredDefaultValue) ? declaredDefaultValue : undefined;
    })();

    const override = controlOverrides[prop.name];

    const addControl = (config: PropsEditorControlDef) => {
      if (config.type !== 'select') {
        controls.push({
          ...config,
          label: prop.name,
          key: prop.name,
        });
      }

      if (config.type === 'text' && isString(initialValue)) {
        values[prop.name] = initialValue;
      }

      if (config.type === 'number' && isNumber(initialValue)) {
        values[prop.name] = initialValue;
      }

      if (config.type === 'checkbox' && isBoolean(initialValue)) {
        values[prop.name] = initialValue;
      }

      if (config.type === 'select') {
        if (config.options.length > 0) {
          const optionsWithType = config.options.map(
            ({ type = 'literal', value, label }) => ({
              value,
              label,
              type,
            })
          );

          const nullOptionIndex = optionsWithType.findIndex(
            (opt) => opt.value === null
          );

          const defaultOptions: Array<SelectOption> =
            prop.required && nullOptionIndex === -1
              ? []
              : [
                  {
                    value: nullOptionIndex !== -1 ? null : undefined,
                    label: '(none)',
                    type: 'literal',
                  },
                ];

          controls.push({
            type: 'select',
            label: prop.name,
            key: prop.name,
            options: defaultOptions.concat(
              nullOptionIndex === -1
                ? optionsWithType
                : optionsWithType.filter((opt) => opt.value !== null)
            ),
          });

          if (
            isDefined(initialValue) &&
            config.options.some((opt) => opt.value === initialValue)
          ) {
            values[prop.name] = initialValue;
          }

          if (prop.required && !isDefined(values[prop.name])) {
            values[prop.name] = config.options[0].value;
          }
        }
      }
    };

    if (override) {
      if (isValidControlConfig(override)) {
        addControl(override);
        return;
      }
    }

    if (isType(prop, 'string')) {
      addControl({ type: 'text' });
      return;
    }

    if (isType(prop, 'number')) {
      addControl({ type: 'number' });
      return;
    }

    if (isType(prop, 'boolean')) {
      addControl({ type: 'checkbox' });
      return;
    }

    if (isType(prop, 'File')) {
      addControl({ type: 'file' });
      return;
    }

    if (prop.type.name === 'enum') {
      if (prop.type.raw === 'ReactNode') {
        return;
      }

      const optionValues = prop.type.value;

      const parseOptions = Array.isArray(optionValues)
        ? optionValues
            .map((opt): Omit<SelectOption, 'label'> | undefined => {
              const literalValue = parseSafely(opt.value);

              if (isDefined(literalValue)) {
                return {
                  value: literalValue,
                  type: 'literal',
                };
              }

              const controlType = controlByTypeMap[opt.value];

              if (controlType) {
                return {
                  value: NonLiteralValue,
                  type: controlType,
                };
              }
            })
            .filter(isDefined)
        : [];

      if (parseOptions.length > 0) {
        const options = parseOptions.map((opt) => ({
          ...opt,
          label: opt.type === 'literal' ? String(opt.value) : `(${opt.type})`,
        }));

        addControl({
          type: 'select',
          options,
        });
      }
      return;
    }
  });

  const additionalControls = Object.entries(controlOverrides).filter(
    ([key]) => !propItems.some((prop) => prop.name === key)
  );

  additionalControls.forEach(([propName, control]) => {
    if (isDefined(control)) {
      if (isValidControlConfig(control)) {
        controls.push({
          ...control,
          label: propName,
          key: propName,
        });
      }
    }
  });

  return {
    controls,
    values,
  };
};

const isType = (prop: PropItem, type: string) =>
  prop.type.name === type ||
  (prop.type.name === 'enum' && prop.type.raw === type);

const VALID_TYPES: Array<PropsEditorControlDef['type']> = [
  'checkbox',
  'text',
  'object',
  'file',
  'number',
  'select',
];

const controlByTypeMap: Record<string, ControlType | undefined> = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  object: 'object',
  File: 'file',
};

const isValidControlConfig = (controlConfig: PropsEditorControlDef) => {
  if (
    ['checkbox', 'text', 'object', 'number', 'file'].includes(
      controlConfig.type
    )
  ) {
    return true;
  }

  if (controlConfig.type === 'select') {
    if (
      Array.isArray(controlConfig.options) &&
      controlConfig.options.length > 0 &&
      controlConfig.options.every((option) => isString(option.label))
    ) {
      return true;
    } else {
      console.warn(`options must be Array of label/value if type is 'select'.`);
      return false;
    }
  }

  const bestMatch =
    controlConfig.type && findBestMatch(controlConfig.type, VALID_TYPES);

  let warningMessage = `'${controlConfig.type}' is not a supported type for control.`;

  if (bestMatch.bestMatch && bestMatch.bestMatch.rating > 0.4) {
    warningMessage += `\nDo you mean to use '${bestMatch.bestMatch.target}'?`;
  }

  console.warn(warningMessage);

  return false;
};

const parseSafely = (raw: string): boolean | string | number | undefined => {
  try {
    const result = JSON.parse(raw);
    return result;
  } catch (err) {
    return undefined;
  }
};

const propsEditorReducer = (
  state: PropsEditorState,
  event: PropsEditorEvent
): PropsEditorState => {
  switch (event.type) {
    case 'init':
      return initState(event);

    case 'setValue':
      return {
        ...state,
        values: {
          ...state.values,
          [event.prop]: event.value,
        },
      };

    default:
      return state;
  }
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasProperty = (obj: Record<string, unknown>, property: string) =>
  hasOwnProperty.call(obj, property);
