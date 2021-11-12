import { isBoolean, isDefined, isNil, isString } from '@showroomjs/core';
import { useId } from '@showroomjs/ui';
import * as React from 'react';
import { ComponentDoc } from 'react-docgen-typescript';
import { useComponentMeta } from './component-props-context';

export interface UsePropsEditorOptions {
  initialProps?: Record<string, any>;
  controls?: Record<
    string,
    PropsEditorControlDef | 'checkbox' | 'textinput' | 'object' | undefined
  >;
  includes?: Array<string>;
}

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

  return {
    props: state.values,
    controls: (includes
      ? state.controls.filter((ctrl) => includes.includes(ctrl.key))
      : state.controls
    ).map((control) => ({
      ...control,
      key: `${id}${control.key}`,
      value: state.values[control.label],
      setValue: (value: any) =>
        dispatch({
          type: 'setValue',
          prop: control.label,
          value,
        }),
    })),
  };
};

const normalizeControls = (
  provided: Record<
    string,
    PropsEditorControlDef | 'checkbox' | 'textinput' | 'object' | undefined
  >
): Record<string, PropsEditorControlDef | undefined> => {
  const result: Record<string, PropsEditorControlDef | undefined> = {};

  Object.keys(provided).forEach((prop) => {
    const config = provided[prop];

    if (isString(config)) {
      result[prop] = {
        type: config,
      };
    } else {
      result[prop] = config;
    }
  });

  return result;
};
interface SelectOption {
  label: string;
  value: any;
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
      type: 'textinput';
    }
  | {
      type: 'object';
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

    if (
      prop.type.name === 'string' ||
      (override && override.type === 'textinput')
    ) {
      controls.push({
        label: prop.name,
        type: 'textinput',
        key: prop.name,
      });

      if (isString(initialValue)) {
        values[prop.name] = initialValue;
      }

      return;
    }

    if (
      prop.type.raw === 'boolean' ||
      (override && override.type === 'checkbox')
    ) {
      controls.push({
        label: prop.name,
        type: 'checkbox',
        key: prop.name,
      });

      if (isBoolean(initialValue)) {
        values[prop.name] = initialValue;
      }

      return;
    }

    if (override && override.type === 'select') {
      if (override.options.length > 0) {
        const defaultOptions: Array<SelectOption> = prop.required
          ? []
          : [
              {
                value: undefined,
                label: '(none)',
              },
            ];

        controls.push({
          type: 'select',
          label: prop.name,
          key: prop.name,
          options: defaultOptions.concat(override.options),
        });

        if (
          isDefined(initialValue) &&
          override.options.some((opt) => opt.value === initialValue)
        ) {
          values[prop.name] = initialValue;
        }

        if (prop.required && !isDefined(values[prop.name])) {
          values[prop.name] = override.options[0].value;
        }
      }

      return;
    }

    if (prop.type.name === 'enum') {
      if (prop.type.raw === 'ReactNode') {
        return;
      }

      const optionValues = prop.type.value;

      const parseOptions = Array.isArray(optionValues)
        ? optionValues.map((opt) => parseSafely(opt.value)).filter(isDefined)
        : [];

      if (parseOptions.length > 0) {
        const defaultOptions: Array<SelectOption> = prop.required
          ? []
          : [
              {
                value: undefined,
                label: '(none)',
              },
            ];

        const options = defaultOptions.concat(
          parseOptions.map((value) => ({
            value,
            label: String(value),
          }))
        );

        controls.push({
          type: 'select',
          label: prop.name,
          key: prop.name,
          options,
        });

        if (
          isDefined(initialValue) &&
          options.some((opt) => opt.value === initialValue)
        ) {
          values[prop.name] = initialValue;
        }

        if (prop.required && !isDefined(values[prop.name])) {
          values[prop.name] = parseOptions[0];
        }
      }
      return;
    }
  });

  const additionalControls = Object.entries(controlOverrides).filter(
    ([key]) => !propItems.some((prop) => prop.name === key)
  );

  additionalControls.forEach(([propName, control]) => {
    if (isDefined(control)) {
      controls.push({
        ...control,
        label: propName,
        key: propName,
      });
    }
  });

  return {
    controls,
    values,
  };
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
