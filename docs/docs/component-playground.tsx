import * as React from 'react';
import {
  allComponentsMetadata,
  mdxComponents,
  Checkbox,
  Select,
  SelectButton,
  ToggleGroup,
  NumberInput,
} from 'react-showroom/client';
import { ComponentDocRoute } from '../components/component-doc-route';
import ButtonPlaygroundDocs2, {
  headings as headings2,
} from './component-playground/button-playground-example-2.mdx';
import playgroundSource2 from './component-playground/button-playground-example-2.mdx?raw';
import playgroundCodeBlocks2 from './component-playground/button-playground-example-2.mdx?showroomRemarkCodeblocks';
import { imports as imports2 } from './component-playground/button-playground-example-2.mdx?showroomRemarkImports';
import ButtonPlaygroundDocs, {
  headings,
} from './component-playground/button-playground-example.mdx';
import playgroundSource from './component-playground/button-playground-example.mdx?raw';
import playgroundCodeBlocks from './component-playground/button-playground-example.mdx?showroomRemarkCodeblocks';
import { imports } from './component-playground/button-playground-example.mdx?showroomRemarkImports';
import ControlOptionsDocs, {
  headings as controlOptionsHeadings,
} from './component-playground/control-options.mdx';
import controlOptionsSource from './component-playground/control-options.mdx?raw';
import controlOptionsCodeBlocks from './component-playground/control-options.mdx?showroomRemarkCodeblocks';
import { imports as controlOptionsImports } from './component-playground/control-options.mdx?showroomRemarkImports';
import { Button } from './components/button';
import { useSetCompilationCaches } from './set-compilation-caches';

const allMetadata = Object.values(allComponentsMetadata);

const buttonData = allMetadata.find((m) => m.displayName === 'Button')!;
const { pre: Pre, code: Code } = mdxComponents;

const mockLoadDts = () => Promise.resolve({ default: {} });

const playgroundContent = {
  doc: ButtonPlaygroundDocs,
  headings,
  imports,
  codeblocks: playgroundCodeBlocks,
  Component: Button,
  loadDts: mockLoadDts,
};

export const PlaygroundSource = () => {
  useSetCompilationCaches([
    playgroundCodeBlocks,
    playgroundCodeBlocks2,
    controlOptionsCodeBlocks,
  ]);

  return (
    <Pre>
      <Code
        className="language-mdx"
        static
        fileName="src/components/button.mdx"
      >
        {playgroundSource}
      </Code>
    </Pre>
  );
};

export const PlaygroundResult = () => (
  <ComponentDocRoute
    content={playgroundContent}
    slug=""
    metadata={buttonData}
  />
);

const playgroundContent2 = {
  doc: ButtonPlaygroundDocs2,
  headings: headings2,
  imports: imports2,
  codeblocks: playgroundCodeBlocks2,
  Component: Button,
  loadDts: mockLoadDts,
};

export const PlaygroundSource2 = () => {
  return (
    <Pre>
      <Code
        className="language-mdx"
        static
        fileName="src/components/button.mdx"
        highlights="{6-9}"
      >
        {playgroundSource2}
      </Code>
    </Pre>
  );
};

export const PlaygroundResult2 = () => (
  <ComponentDocRoute
    content={playgroundContent2}
    slug=""
    metadata={buttonData}
  />
);

const controlOptionsContent = {
  doc: ControlOptionsDocs,
  headings: controlOptionsHeadings,
  imports: controlOptionsImports,
  codeblocks: controlOptionsCodeBlocks,
  Component: Button,
  loadDts: mockLoadDts,
};

export const ControlOptionsSource = () => {
  return (
    <Pre>
      <Code
        className="language-mdx"
        static
        fileName="src/components/button.mdx"
        highlights="{26-38}"
      >
        {controlOptionsSource}
      </Code>
    </Pre>
  );
};

export const ControlOptionsResult = () => (
  <ComponentDocRoute
    content={controlOptionsContent}
    slug=""
    metadata={buttonData}
  />
);

export const CheckboxDemo = () => {
  const [checked, setChecked] = React.useState<'indeterminate' | boolean>(
    'indeterminate'
  );

  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
};

export const NumberInputDemo = () => {
  const [value, setValue] = React.useState('');

  return (
    <NumberInput
      value={value}
      onValue={setValue}
      css={{
        maxWidth: '20rem',
      }}
      allowNegative
    />
  );
};

const options = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
];

export const SelectDemo = () => {
  const [value, setValue] = React.useState('1');

  return (
    <>
      <Select
        value={value}
        onValue={setValue}
        css={{
          maxWidth: '36rem',
          '@lg': {
            display: 'none',
          },
        }}
      >
        {options.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      <ToggleGroup>
        {options.map((opt) => (
          <SelectButton
            onClick={() => setValue(opt.value)}
            selected={opt.value === value}
            key={opt.value}
          >
            {opt.label}
          </SelectButton>
        ))}
      </ToggleGroup>
    </>
  );
};
