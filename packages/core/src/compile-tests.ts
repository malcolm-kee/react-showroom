import { Node, Options as AcornOptions, parse } from 'acorn';
import * as walk from 'acorn-walk';
import type { ImportDeclarationNode } from './acorn-ast';
import { stringToIdentifier } from './get-safe-name';

const ACORN_OPTIONS: AcornOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
};

export const compileTestsToMap = (source: string) => {
  const testsMap: Record<string, string> = {};

  let code = source;

  const ast = parse(code, ACORN_OPTIONS);

  let offset = 0;

  walk.simple(ast, {
    CallExpression: (callNode) => {
      const node = callNode as CallExpressionNode;
      if (node.callee.name === 'test' || node.callee.name === 'it') {
        const name = node.arguments[0].value;

        testsMap[name] = stringToIdentifier(name);

        code =
          code.substring(0, node.start + offset) +
          code.substring(node.end + offset);
        offset -= node.end - node.start;
      }
    },
  });

  return `export default {${Object.entries(testsMap)
    .map(([fnName, encodedName]) => `['${fnName}']: '${encodedName}',`)
    .join('\n')}
  };`;
};

export const compileTests = (source: string) => {
  const imports: Array<string> = [
    `import { jest, expect } from 'react-showroom/client-dist/lib/test-globals.js';`,
  ];
  let hasImportedReact = false;

  const testsMap: Record<string, string> = {};

  let code = source;

  const ast = parse(code, ACORN_OPTIONS);

  let offset = 0;

  walk.simple(ast, {
    ImportDeclaration: (n) => {
      const node = n as ImportDeclarationNode;
      const start = node.start + offset;
      const end = node.end + offset;

      if (node.source.value === 'react') {
        hasImportedReact = true;
      }

      const statement = code.substring(start, end);
      imports.push(statement);

      code = code.substring(0, start) + code.substring(end);
      offset -= statement.length;
    },
    CallExpression: (callNode) => {
      const node = callNode as CallExpressionNode;
      if (node.callee.name === 'test' || node.callee.name === 'it') {
        const name = node.arguments[0].value;
        const testCode = node.arguments[1];

        testsMap[stringToIdentifier(name)] = code.substring(
          testCode.start + offset,
          testCode.end + offset
        );

        code =
          code.substring(0, node.start + offset) +
          code.substring(node.end + offset);
        offset -= node.end - node.start;
      }
    },
  });

  return `${(hasImportedReact
    ? imports
    : imports.concat(`import * as React from 'react';`)
  ).join('\n')}
  ${stripDescribe(code)}
  ${Object.entries(testsMap)
    .map(
      ([fnName, fnExpression]) =>
        `export const ${fnName} = async ${fnExpression};`
    )
    .join('\n')}`;
};

function stripDescribe(source: string) {
  let code = source;

  const ast = parse(code, {
    ecmaVersion: 2018,
    sourceType: 'module',
  });

  let offset = 0;

  walk.simple(ast, {
    CallExpression: (callNode) => {
      const node = callNode as CallExpressionNode;
      if (node.callee.name === 'describe') {
        code =
          code.substring(0, node.start + offset) +
          code.substring(node.end + offset);
        offset -= node.end - node.start;
      }
    },
  });

  return code;
}

interface CallExpressionNode extends Node {
  callee: {
    name: string;
  } & Node;
  arguments: Array<
    {
      value: string;
    } & Node
  >;
}
