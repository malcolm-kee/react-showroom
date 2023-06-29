import { isDefined, safeEval } from '@showroomjs/core';
import {
  Button,
  Checkbox,
  ColorInput,
  FileInput,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  tw,
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
    <div
      {...rootProps}
      className={tw(
        [
          'grid items-center [grid-template-columns:max-content_1fr] gap-x-2 sm:gap-2 py-1',
        ],
        [rootProps.className]
      )}
    >
      {editor.controls.map((ctrl) => {
        if (ctrl.type === 'checkbox') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key} className={tw(['mb-4 sm:mb-0'])}>
                {ctrl.label}
              </Label>
              <ControlWrapper className={tw(['mb-4 sm:mb-0'])}>
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
                className={tw(['col-span-full sm:col-span-1 mb-4 sm:mb-0'])}
              >
                <TextInput
                  id={ctrl.key}
                  value={ctrl.value || ''}
                  onValue={ctrl.setValue}
                  className={tw(['max-w-xl'])}
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
                className={tw(['col-span-full sm:col-span-1 mb-4 sm:mb-0'])}
              >
                <NumberInput
                  id={ctrl.key}
                  value={ctrl.value || ''}
                  onValue={ctrl.setValue}
                  allowNegative
                  className={tw(['max-w-xs'])}
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
                className={tw(['col-span-full sm:col-span-1 mb-4 sm:mb-0'])}
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
                className={tw(['col-span-full sm:col-span-1 mb-4 sm:mb-0'])}
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
                className={tw(['col-span-full sm:col-span-1 mb-4 sm:mb-0'])}
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
                <ColorInput
                  value={ctrl.value}
                  onValue={ctrl.setValue}
                  id={ctrl.key}
                />
              </ControlWrapper>
            </React.Fragment>
          );
        }

        return null;
      })}
    </div>
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
        className={tw(['col-span-full sm:col-span-1 mb-4 sm:mb-0'])}
      >
        <Select
          id={ctrl.key}
          value={selectedOptionIndex}
          onValue={(value) => {
            const valueIndex = Number(value);

            handleSelectOption(ctrl.options[valueIndex], valueIndex);
          }}
          className={tw(['max-w-xl lg:hidden'])}
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
                      className={tw(['max-w-xl'])}
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
                      className={tw(['max-w-xs'])}
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

const Label = (props: React.ComponentPropsWithoutRef<'label'>) => (
  <label
    {...props}
    className={tw(
      ['text-zinc-600 font-mono sm:px-2 sm:py-1'],
      [props.className]
    )}
  />
);

type DivProps = React.ComponentPropsWithoutRef<'div'>;

const ControlWrapper = (props: DivProps) => (
  <div {...props} className={tw(['sm:px-2 sm:py-1'], [props.className])} />
);

export const ToggleGroup = (props: DivProps) => (
  <div
    {...props}
    className={tw(
      [
        'hidden lg:inline-flex lg:p-0.5 lg:gap-0.5 lg:flex-wrap border border-zinc-300 rounded-lg bg-zinc-100',
      ],
      [props.className]
    )}
  />
);

const SelectSubControlDiv = (props: DivProps) => (
  <div {...props} className={tw(['mt-1'], [props.className])} />
);

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
      isError={!isValid}
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

export const SelectButton = ({
  selected,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & { selected?: boolean }) => {
  return (
    <Button
      {...props}
      className={tw(
        [
          'px-3 text-base sm:text-sm rounded-lg transition-colors border-transparent',
          selected
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-700 hover:text-zinc-900',
        ],
        [props.className]
      )}
    />
  );
};
