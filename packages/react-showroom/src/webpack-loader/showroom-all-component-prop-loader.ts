import * as docgen from 'react-docgen-typescript';
import type { LoaderDefinition } from 'webpack';
import { logToStdout } from '../lib/log-to-stdout';
import { isString } from '@showroomjs/core';
export interface ShowroomAllComponentLoaderOptions {
  parse: (
    sourcePaths: Array<string>
  ) => Array<docgen.ComponentDoc & { id: string }>;
  dts?: string | false;
  debug?: boolean;
}

const showroomAllComponentPropLoader: LoaderDefinition<ShowroomAllComponentLoaderOptions> =
  function (content) {
    const loaderOptions = this.getOptions();

    if (loaderOptions.dts === false) {
      return `export default '';`;
    }

    if (loaderOptions.dts && isString(loaderOptions.dts)) {
      return `import dts from '${loaderOptions.dts}?raw';
      export default dts;`;
    }

    const paths = JSON.parse(content) as Array<string>;

    if (loaderOptions.debug) {
      logToStdout(
        `Parsing components at: \n${paths.map((p) => `- ${p}`).join('\n')}`
      );
    }

    paths.forEach((path) => {
      this.addDependency(path);
    });

    const compdoc = loaderOptions.parse(paths);

    const allCompDefs = compdoc.map((comp) => {
      const props: Array<string> = [];
      const extendedInterfaces = new Map<string, Array<string>>();

      const addInterfaceProp = (interfaceName: string, propName: string) => {
        const currentInterface = extendedInterfaces.get(interfaceName);
        if (currentInterface) {
          currentInterface.push(propName);
        } else {
          extendedInterfaces.set(interfaceName, [propName]);
        }
      };

      Object.entries(comp.props).forEach(([propName, propDef]) => {
        if (
          propDef.declarations &&
          propDef.declarations.some((d) => d.fileName.includes('@types/react'))
        ) {
          const reactDeclaration = propDef.declarations.find((d) =>
            d.fileName.includes('@types/react')
          );

          if (reactDeclaration) {
            if (
              ['DOMAttributes', 'HTMLAttributes'].indexOf(
                reactDeclaration.name
              ) !== -1
            ) {
              const interfaceBase = `React.${reactDeclaration.name}`;
              const genericInterface = `${interfaceBase}<Element>`;

              const matches = propDef.type.name.match(/\<(\w+)\>/);
              const elementType = matches && matches[1];

              if (elementType) {
                addInterfaceProp(`${interfaceBase}<${elementType}>`, propName);
              } else {
                addInterfaceProp(genericInterface, propName);
              }

              return;
            }

            if (reactDeclaration.name === 'AriaAttributes') {
              addInterfaceProp(`React.${reactDeclaration.name}`, propName);
              return;
            }
          }
        }

        props.push(
          `'${propName}'${propDef.required ? '' : '?'}: ${normalizeType(
            propDef.type.name
          )};`
        );
      });

      const extendedInterfacesArray = Array.from(extendedInterfaces);

      if (extendedInterfacesArray.length > 1) {
        const htmlAttributes = extendedInterfacesArray.find((a) =>
          /React\.HTMLAttributes\<Element\>/.test(a[0])
        );

        if (htmlAttributes) {
          extendedInterfacesArray
            .filter((a) => /React\.DOMAttributes\<\w+\>/.test(a[0]))
            .forEach((domAttributesEntry) => {
              extendedInterfacesArray.splice(
                extendedInterfacesArray.indexOf(domAttributesEntry),
                1
              );

              const [domAttributes, props] = domAttributesEntry;
              htmlAttributes[1].push(...props);
              const matches = domAttributes.match(/\<(\w+)\>/);

              if (matches && matches[1] !== 'Element') {
                htmlAttributes[0] = htmlAttributes[0].replace(
                  '<Element>',
                  `<${matches[1]}>`
                );
              }
            });

          extendedInterfacesArray
            .filter((a) => a[0] === 'React.AriaAttributes')
            .forEach((entry) => {
              extendedInterfacesArray.splice(
                extendedInterfacesArray.indexOf(entry),
                1
              );
              htmlAttributes[1].push(...entry[1]);
            });
        }
      }

      return {
        id: comp.id,
        name: comp.displayName,
        props: `{
          ${props.join('\n')} }${extendedInterfacesArray
          .filter((entry) => entry[1].length > 0)
          .map(
            ([interfaceName, props]) =>
              ` & Pick<${interfaceName}, ${props
                .map((p) => `'${p}'`)
                .join(' | ')}>`
          )
          .join('')}`,
      };
    });

    return `export default \`import * as React from 'react';
    ${allCompDefs
      .map(
        (compDef) =>
          `export declare const ${compDef.name}: React.ComponentType<${compDef.props}>`
      )
      .join('\n')}\`;`;
  };

const normalizeType = (type: string): string => {
  if (/\s\|\s/.test(type)) {
    return type
      .split(' | ')
      .map((t) => normalizeType(t))
      .join(' | ');
  }

  if (
    REACT_TYPES.indexOf(type) !== -1 ||
    REACT_EVENT_HANDLERS_PATTERN.test(type) ||
    /^Ref\<\w+\>/.test(type)
  ) {
    return `React.${type}`;
  }

  return type;
};

const REACT_TYPES = [
  'ReactNode',
  'Key',
  'CSSProperties',
  'AriaRole',
  'HTMLAttributeReferrerPolicy',
  'HTMLInputTypeAttribute',
];
const REACT_EVENT_HANDLERS_PATTERN = /^(\w)+EventHandler/;

module.exports = showroomAllComponentPropLoader;
