import { compileScript } from './compile-script';
import * as esbuild from 'esbuild';

describe('compileScript', () => {
  it('able to get the import and packages', async () => {
    const result = await compileScript(
      `import * as React from 'react';
      import formik from 'formik';
      import { useForm } from 'react-hook-form';
        
      const obj = {
        React,
        formik,
        useForm
      };`,
      esbuild,
      { insertRenderIfEndWithJsx: true, language: 'ts' }
    );

    expect(result.importNames).toStrictEqual(['React', 'formik', 'useForm']);
    expect(result.importedPackages).toStrictEqual([
      'react',
      'formik',
      'react-hook-form',
    ]);
  });

  it('will not wrap JSX with render call by default', async () => {
    const result = await compileScript(
      `import { Button } from 'components';
        
    <Button className="bg">Hello</Button>;`,
      esbuild,
      {
        language: 'tsx',
      }
    );

    expect(result.code).toMatchInlineSnapshot(`
      "const {Button} = imports['components'];

      /* @__PURE__ */ React.createElement(Button, { className: \\"bg\\" }, \\"Hello\\");
      "
    `);
  });

  it('wraps JSX with render call', async () => {
    const result = await compileScript(
      `import { Button } from 'components';
        
    React.createElement(Button, { className: 'bg' }, 'Hello');`,
      esbuild,
      { language: 'js', insertRenderIfEndWithJsx: true }
    );

    expect(result.code).toMatchInlineSnapshot(`
      "const {Button} = imports['components'];

      render(React.createElement(Button, { className: \\"bg\\" }, \\"Hello\\"));"
    `);
  });
});
