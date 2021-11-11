import { isDefined } from '@showroomjs/core';
import { Checkbox, Select, styled, TextInput, Button } from '@showroomjs/ui';
import * as React from 'react';
import type { usePropsEditor } from '../lib/use-props-editor';

export interface PropsEditorProps {
  editor: ReturnType<typeof usePropsEditor>;
}

export const PropsEditor = ({ editor }: PropsEditorProps) => {
  return (
    <Root>
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
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <Select
                  id={ctrl.key}
                  value={
                    ctrl.options.findIndex((opt) => opt.value === ctrl.value) ||
                    undefined
                  }
                  onValue={(value) => {
                    const valueIndex = Number(value);

                    ctrl.setValue(ctrl.options[valueIndex].value);
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
                    const selected = ctrl.value === opt.value;
                    return (
                      <SelectButton
                        onClick={() => ctrl.setValue(opt.value)}
                        selected={selected}
                        key={i}
                      >
                        {opt.label}
                      </SelectButton>
                    );
                  })}
                </ToggleGroup>
              </ControlWrapper>
            </React.Fragment>
          );
        }

        if (ctrl.type === 'textinput') {
          return (
            <React.Fragment key={ctrl.key}>
              <Label htmlFor={ctrl.key}>{ctrl.label}</Label>
              <ControlWrapper>
                <TextInput
                  id={ctrl.key}
                  value={ctrl.value}
                  onValue={ctrl.setValue}
                  css={{
                    maxWidth: '36rem',
                  }}
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

const Root = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  alignItems: 'center',
  gap: '$1',
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
