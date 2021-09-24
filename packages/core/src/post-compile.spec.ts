import { postCompile } from './post-compile';

describe('postCompile', () => {
  it('able to get the import and packages', () => {
    const result = postCompile(`
        import * as React from 'react';
        import formik from 'formik';
        import { useForm } from 'react-hook-form';`);

    expect(result.importNames).toStrictEqual(['React', 'formik', 'useForm']);
    expect(result.importedPackages).toStrictEqual([
      'react',
      'formik',
      'react-hook-form',
    ]);
  });

  it('wraps JSX with render call', () => {
    const result = postCompile(`import { Button } from 'components';
        
    React.createElement(Button, { className: 'bg' }, 'Hello');`);

    expect(result.code).toMatchInlineSnapshot(`
"const {Button} = imports['components'];

        
    render(React.createElement(Button, { className: 'bg' }, 'Hello'));"
`);
  });
});
