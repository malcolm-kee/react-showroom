/// <reference lib="WebWorker" />

import type { Node } from 'acorn';
import * as walk from 'acorn-walk';
import * as esbuild from 'esbuild-wasm';
import wasmPath from 'esbuild-wasm/esbuild.wasm';
import type { CompileResult, RequestCompileData } from '../types';
import { serverData } from './server-data';
const acorn = require('acorn');

const esBuildIsReady = esbuild.initialize({
  wasmURL: wasmPath,
  worker: false,
});

self.onmessage = (ev) => {
  const data: RequestCompileData = ev.data;

  const handleError = (err: unknown) => {
    const errorResult: CompileResult = {
      type: 'error',
      error: String(err),
      messageId: data.messageId,
    };
    self.postMessage(errorResult);
  };

  esBuildIsReady
    .then(() =>
      esbuild
        .transform(data.source, {
          loader: 'tsx',
          target: 'es2018',
        })
        .then((transformOutput) => {
          let code = transformOutput.code;

          if (hasImports(code)) {
            const ast = acorn.parse(code, {
              ecmaVersion: 2018,
              sourceType: 'module',
            });

            let offset = 0;

            walk.simple(ast, {
              ImportDeclaration: (node) => {
                const start = node.start + offset;
                const end = node.end + offset;
                const statement = code.substring(start, end);
                const transpiledStatement = transformImports(
                  node as ImportDeclarationNode
                );

                code =
                  code.substring(0, start) +
                  transpiledStatement +
                  code.substring(end);

                offset += transpiledStatement.length - statement.length;
              },
            });
          }

          const result: CompileResult = {
            type: 'success',
            code: code,
            messageId: data.messageId,
          };
          self.postMessage(result);
        })
    )
    .catch(handleError);
};

const hasImports = (code: string): boolean =>
  !!code.match(/import[\S\s]+?['"]([^'"]+)['"];?/m);

interface LiteralNode extends Node {
  type: 'Literal';
  value: string;
  raw: string;
}

interface IdentifierNode extends Node {
  type: 'Identifier';
  name: string;
}

interface ImportSpecifierNode extends Node {
  type: 'ImportSpecifier';
  imported: IdentifierNode;
  local: IdentifierNode;
}

interface ImportNamespaceSpecifierNode extends Node {
  type: 'ImportNamespaceSpecifier';
  local: IdentifierNode;
}

interface ImportDefaultSpecifierNode extends Node {
  type: 'ImportDefaultSpecifier';
  local: IdentifierNode;
}

interface ImportDeclarationNode extends Node {
  type: 'ImportDeclaration';
  source: LiteralNode;
  specifiers: Array<
    | ImportSpecifierNode
    | ImportNamespaceSpecifierNode
    | ImportDefaultSpecifierNode
  >;
}

const transformImports = (importDec: ImportDeclarationNode) => {
  const importedPkg = importDec.source.value;

  const pkgConfig = serverData.packages[importedPkg];

  if (!pkgConfig) {
    console.error(
      `${importedPkg} is not added in "imports" in react-compdoc.js`
    );
    return '';
  }

  const starImports: Array<ImportNamespaceSpecifierNode> = [];
  const namedImports: Array<ImportSpecifierNode> = [];
  const defaultImports: Array<ImportDefaultSpecifierNode> = [];

  importDec.specifiers.forEach((specifier) => {
    if (specifier.type === 'ImportSpecifier') {
      namedImports.push(specifier);
    } else if (specifier.type === 'ImportNamespaceSpecifier') {
      starImports.push(specifier);
    } else {
      defaultImports.push(specifier);
    }
  });

  const starImportsOutput: string = (function () {
    if (starImports.length === 0) {
      return '';
    }

    return starImports
      .map(
        ({ local }) =>
          `const ${local.name} = window.__compdoc__.moduleMap.${pkgConfig.varName};\n`
      )
      .join('');
  })();

  const namedImportsOutput: string = (function () {
    if (namedImports.length === 0) {
      return '';
    }

    const importSpecifiers = namedImports
      .map(({ imported, local }) =>
        imported.name === local.name
          ? imported.name
          : `${imported.name}: ${local.name}`
      )
      .join(',');

    return `const {${importSpecifiers}} = window.__compdoc__.moduleMap.${pkgConfig.varName};\n`;
  })();

  const defaultImportsOutput: string = (function () {
    if (defaultImports.length === 0) {
      return '';
    }

    return defaultImports
      .map(
        ({ local }) =>
          `const ${local.name} = tslib.__importDefault(window.__compdoc__.moduleMap.${pkgConfig.varName}).default;\n`
      )
      .join('');
  })();

  return `${starImportsOutput}${defaultImportsOutput}${namedImportsOutput}`;
};
