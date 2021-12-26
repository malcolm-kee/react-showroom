import { isDefined, safeEval } from '@showroomjs/core';
import {
  Button,
  Checkbox,
  ColorInput,
  FileInput,
  NumberInput,
  Popover,
  Select,
  styled,
  Textarea,
  TextInput,
} from '@showroomjs/ui';
import * as React from 'react';
import { HexColorPicker } from 'react-colorful';
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
              <Label
                htmlFor={ctrl.key}
                css={{
                  marginBottom: '$4',
                  '@sm': {
                    marginBottom: 0,
                  },
                }}
              >
                {ctrl.label}
              </Label>
              <ControlWrapper
                css={{
                  marginBottom: '$4',
                  '@sm': {
                    marginBottom: 0,
                  },
                }}
              >
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
              <ControlWrapper
                css={{
                  gridColumn: '1 / -1',
                  marginBottom: '$4',
                  '@sm': {
                    gridColumn: 'auto',
                    marginBottom: 0,
                  },
                }}
              >
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
              <ControlWrapper
                css={{
                  gridColumn: '1 / -1',
                  marginBottom: '$4',
                  '@sm': {
                    gridColumn: 'auto',
                    marginBottom: 0,
                  },
                }}
              >
                <NumberInput
                  id={ctrl.key}
                  value={ctrl.value || ''}
                  onValue={ctrl.setValue}
                  allowNegative
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
              <ControlWrapper
                css={{
                  gridColumn: '1 / -1',
                  marginBottom: '$4',
                  '@sm': {
                    gridColumn: 'auto',
                    marginBottom: 0,
                  },
                }}
              >
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
              <ControlWrapper
                css={{
                  gridColumn: '1 / -1',
                  marginBottom: '$4',
                  '@sm': {
                    gridColumn: 'auto',
                    marginBottom: 0,
                  },
                }}
              >
                <FileInput
                  id={ctrl.key}
                  file={ctrl.value}
                  onFilesSelected={(files) => ctrl.setValue(files[0])}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'date') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper
                css={{
                  gridColumn: '1 / -1',
                  marginBottom: '$4',
                  '@sm': {
                    gridColumn: 'auto',
                    marginBottom: 0,
                  },
                }}
              >
                <TextInput
                  type="date"
                  id={ctrl.key}
                  value={ctrl.value ? dateToString(ctrl.value) : ''}
                  onChange={(ev) => ctrl.setValue(ev.target.valueAsDate)}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'color') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <ColorControl
                  value={ctrl.value}
                  onChange={ctrl.setValue}
                  id={ctrl.key}
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

export const ColorControl = (props: {
  value: string;
  id?: string;
  onChange: (color: string) => void;
}) => {
  const [showPopover, setShowPopover] = React.useState(false);
  return (
    <Popover onOpenChange={setShowPopover} open={showPopover}>
      <Popover.Trigger asChild>
        <ColorInput
          id={props.id}
          value={props.value || ''}
          onValue={props.onChange}
          css={{
            maxWidth: '10rem',
          }}
          placeholder="#rrggbb"
        />
      </Popover.Trigger>
      <Popover.Content>
        <HexColorPicker color={props.value} onChange={props.onChange} />
      </Popover.Content>
    </Popover>
  );
};

const dateToString = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

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

  const handleSelectOption = (option: SelectOption, index: number) => {
    if (option.type === 'literal') {
      setType('literal');
      ctrl.setValue(option.value, index);
    } else {
      setType(option.type);
      ctrl.setValue(undefined);
    }
  };

  return (
    <React.Fragment>
      <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
      <ControlWrapper
        css={{
          gridColumn: '1 / -1',
          marginBottom: '$4',
          '@sm': {
            gridColumn: 'auto',
            marginBottom: 0,
          },
        }}
      >
        <Select
          id={ctrl.key}
          value={selectedOptionIndex}
          onValue={(value) => {
            const valueIndex = Number(value);

            handleSelectOption(ctrl.options[valueIndex], valueIndex);
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
                onClick={() => handleSelectOption(opt, i)}
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
                    <FileInput
                      onFilesSelected={(files) => ctrl.setValue(files[0])}
                      file={ctrl.value}
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
                      allowNegative
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
  alignItems: 'center',
  py: '$1',
  gridTemplateColumns: 'max-content 1fr',
  columnGap: '$2',
  '@sm': {
    gap: '$2',
  },
});

const Label = styled('label', {
  color: '$gray-600',
  fontFamily: '$mono',
  '@sm': {
    px: '$2',
    py: '$1',
  },
});

const ControlWrapper = styled('div', {
  '@sm': {
    px: '$2',
    py: '$1',
  },
});

export const ToggleGroup = styled('div', {
  display: 'none',
  '@lg': {
    display: 'flex',
    gap: '$2',
    flexWrap: 'wrap',
  },
});

const SelectSubControlDiv = styled('div', {
  marginTop: '$1',
});

const emptyValue = `{

}`;

export const ObjectValueEditor = (props: {
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

export const SelectButton = styled(Button, {
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
