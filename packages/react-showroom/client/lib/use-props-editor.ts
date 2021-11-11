import { isDefined, isNil } from '@showroomjs/core';
import { useId } from '@showroomjs/ui';
import * as React from 'react';
import { ComponentDoc } from 'react-docgen-typescript';
import { useComponentMeta } from './component-props-context';

export const usePropsEditor = ({
  initialProps = {},
}: { initialProps?: Record<string, any> } = {}) => {
  const componentMeta = useComponentMeta();
  const id = useId();

  const [state, dispatch] = React.useReducer(
    propsEditorReducer,
    { componentMeta, initialProps },
    initState
  );

  return {
    props: state.values,
    controls: state.controls.map((control) => ({
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

interface SelectOption {
  label: string;
  value: boolean | string | number | undefined;
}

export type PropsEditorControl =
  | {
      label: string;
      type: 'checkbox';
      key: string;
    }
  | {
      label: string;
      key: string;
      type: 'select';
      options: Array<SelectOption>;
    }
  | {
      label: string;
      key: string;
      type: 'textinput';
    };

export interface PropsEditorState {
  controls: Array<PropsEditorControl>;
  values: Record<string, any>;
}

type PropsEditorEvent =
  | {
      type: 'init';
      componentMeta: ComponentDoc | undefined;
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
}: {
  componentMeta: ComponentDoc | undefined;
  initialProps: Record<string, any>;
}): PropsEditorState => {
  if (!componentMeta) {
    return {
      controls: [],
      values: {},
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

    if (!hasProperty(initialProps, prop.name)) {
      const initialValue = (function getInitialValue() {
        const declaredDefaultValue =
          prop.defaultValue && prop.defaultValue.value;

        return !isNil(declaredDefaultValue) ? declaredDefaultValue : undefined;
      })();

      if (isDefined(initialValue)) {
        values[prop.name] = initialValue;
      }
    }

    if (prop.type.name === 'string') {
      controls.push({
        label: prop.name,
        type: 'textinput',
        key: prop.name,
      });
    }

    if (prop.type.raw === 'boolean') {
      controls.push({
        label: prop.name,
        type: 'checkbox',
        key: prop.name,
      });
      return;
    }

    if (prop.type.name === 'enum') {
      if (prop.type.raw === 'ReactNode') {
        return;
      }

      const optionValues = prop.type.value;

      const options = Array.isArray(optionValues)
        ? optionValues.map((opt) => parseSafely(opt.value)).filter(isDefined)
        : [];

      if (options.length > 0) {
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
          options: defaultOptions.concat(
            options.map((value) => ({
              value,
              label: String(value),
            }))
          ),
        });

        if (prop.required && !isDefined(values[prop.name])) {
          values[prop.name] = options[0];
        }
      }
      return;
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
