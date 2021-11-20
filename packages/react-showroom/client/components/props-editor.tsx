import { isDefined, safeEval } from '@showroomjs/core';
import {
  Button,
  Checkbox,
  NumberInput,
  Select,
  styled,
  Textarea,
  TextInput,
} from '@showroomjs/ui';
import * as React from 'react';
import stringifyObject from 'stringify-object';
import {
  PropsEditorControlData,
  SelectOption,
  usePropsEditor,
} from '../lib/use-props-editor';

export interface PropsEditorProps
  extends React.ComponentPropsWithoutRef<'div'> {
  editor: ReturnType<typeof usePropsEditor>;
}

export const PropsEditor = ({ editor, ...rootProps }: PropsEditorProps) => {
  return (
    <Root {...rootProps}>
      {editor.controls.map((ctrl) => {
        if (ctrl.type === 'checkbox') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <Checkbox
                  checked={isDefined(ctrl.value) ? ctrl.value : 'indeterminate'}
                  onCheckedChange={ctrl.setValue}
                  id={ctrl.key}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'select') {
          return <PropsSelectControl control={ctrl} key={ctrl.key} />;
        }

        if (ctrl.type === 'text') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <TextInput
                  id={ctrl.key}
                  value={ctrl.value || ''}
                  onValue={ctrl.setValue}
                  css={{
                    maxWidth: '36rem',
                  }}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'number') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <NumberInput
                  id={ctrl.key}
                  value={ctrl.value || ''}
                  onValue={ctrl.setValue}
                  css={{
                    maxWidth: '20rem',
                  }}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'object') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <ObjectValueEditor
                  id={ctrl.key}
                  value={ctrl.value || ''}
                  onValue={ctrl.setValue}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'file') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <input
                  type="file"
                  id={ctrl.key}
                  onChange={(ev) =>
                    ctrl.setValue(ev.target.files && ev.target.files[0])
                  }
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        return null;
      })}
    </Root>
  );
};

const PropsSelectControl = (props: {
  control: PropsEditorControlData & { type: 'select' };
}) => {
  const ctrl = props.control;

  const [type, setType] = React.useState<SelectOption['type']>(() =>
    ctrl.options.some((opt) => opt.type === 'literal')
      ? 'literal'
      : ctrl.options[0]?.type
  );

  const selectedOptionIndex =
    type === 'literal'
      ? ctrl.options.findIndex((opt) => opt.value === ctrl.value)
      : ctrl.options.findIndex((opt) => opt.type === type);

  const handleSelectOption = (option: SelectOption) => {
    if (option.type === 'literal') {
      setType('literal');
      ctrl.setValue(option.value);
    } else {
      setType(option.type);
      ctrl.setValue(undefined);
    }
  };

  return (
    <React.Fragment>
      <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
      <ControlWrapper>
        <Select
          id={ctrl.key}
          value={selectedOptionIndex}
          onValue={(value) => {
            const valueIndex = Number(value);

            handleSelectOption(ctrl.options[valueIndex]);
          }}
          css={{
            maxWidth: '36rem',
            '@lg': {
              display: 'none',
            },
          }}
        >
          {ctrl.options.map((opt, i) => (
            <option value={i} key={i}>
              {opt.label}
            </option>
          ))}
        </Select>
        <ToggleGroup>
          {ctrl.options.map((opt, i) => {
            const selected =
              opt.type === type &&
              (opt.type !== 'literal' || ctrl.value === opt.value);
            return (
              <SelectButton
                onClick={() => handleSelectOption(opt)}
                selected={selected}
                key={i}
              >
                {opt.label}
              </SelectButton>
            );
          })}
        </ToggleGroup>
        {type !== 'literal' && (
          <SelectSubControlDiv>
            {(function getControl() {
              switch (type) {
                case 'checkbox':
                  return (
                    <Checkbox
                      checked={
                        isDefined(ctrl.value) ? ctrl.value : 'indeterminate'
                      }
                      onCheckedChange={ctrl.setValue}
                    />
                  );

                case 'file':
                  return (
                    <input
                      type="file"
                      onChange={(ev) =>
                        ctrl.setValue(ev.target.files && ev.target.files[0])
                      }
                    />
                  );

                case 'text':
                  return (
                    <TextInput
                      value={ctrl.value || ''}
                      onValue={ctrl.setValue}
                      css={{
                        maxWidth: '36rem',
                      }}
                    />
                  );

                case 'object':
                  return (
                    <ObjectValueEditor
                      value={ctrl.value || ''}
                      onValue={ctrl.setValue}
                    />
                  );

                case 'number':
                  return (
                    <NumberInput
                      value={ctrl.value || ''}
                      onValue={ctrl.setValue}
                      css={{
                        maxWidth: '20rem',
                      }}
                    />
                  );

                default:
                  return null;
              }
            })()}
          </SelectSubControlDiv>
        )}
      </ControlWrapper>
    </React.Fragment>
  );
};

const Root = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  alignItems: 'center',
  gap: '$2',
  py: '$1',
});

const Label = styled('label', {
  px: '$2',
  py: '$1',
  color: '$gray-600',
  fontFamily: '$mono',
});

const ControlWrapper = styled('div', {
  px: '$2',
  py: '$1',
});

const ToggleGroup = styled('div', {
  display: 'none',
  '@lg': {
    display: 'flex',
    gap: '$2',
  },
});

const SelectSubControlDiv = styled('div', {
  marginTop: '$1',
});

const emptyValue = `{

}`;

const ObjectValueEditor = (props: {
  value: object | undefined;
  onValue: (value: object | undefined) => void;
  id?: string;
}) => {
  const [value, setValue] = React.useState(() =>
    props.value ? stringifyObject(props.value) : emptyValue
  );

  React.useEffect(() => {
    setValue(props.value ? stringifyObject(props.value) : emptyValue);
  }, [props.value]);

  const isValid = React.useMemo(() => !value || isValidJson(value), [value]);

  return (
    <Textarea
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      onBlur={() => {
        if (!value) {
          props.onValue(undefined);
          return;
        }

        if (!props.value && value === emptyValue) {
          return;
        }

        if (isValid) {
          props.onValue(parseJsObject(value));
        }
      }}
      id={props.id}
      css={
        isValid
          ? undefined
          : {
              borderColor: '$red-400',
            }
      }
    />
  );
};

// we don't use JSON.parse because valid js object (prop without quote) is invalid JSON
const parseJsObject = (jsObjString: string) =>
  safeEval(`return (${jsObjString});`, {});

const isValidJson = (val: string) => {
  try {
    parseJsObject(val);
    return true;
  } catch (err) {
    return false;
  }
};

const SelectButton = styled(Button, {
  px: '$3',
  py: '$1',
  color: '$gray-600',
  backgroundColor: '$gray-100',
  variants: {
    selected: {
      true: {
        backgroundColor: '$primary-700',
        color: 'White',
      },
    },
  },
});
