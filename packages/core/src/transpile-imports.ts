import type { Node } from 'acorn';
import * as walk from 'acorn-walk';

const acorn = require('acorn');

export interface ImportMapData {
  name: string;
  varName: string;
}

export type Packages = Record<string, ImportMapData>;

export const transpileImports = (
  providedCode: string,
  packages: Packages
): {
  code: string;
  importNames: Array<string>;
} => {
  let code = providedCode;
  const importNames: Array<string> = [];

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
          node as ImportDeclarationNode,
          packages
        );

        const importLocals = getImportNames(node as ImportDeclarationNode);
        importNames.push(...importLocals);

        code =
          code.substring(0, start) + transpiledStatement + code.substring(end);

        offset += transpiledStatement.length - statement.length;
      },
    });
  }

  return { code, importNames };
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

const categorizeImports = (importDec: ImportDeclarationNode) => {
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

  return {
    starImports,
    namedImports,
    defaultImports,
  };
};

const getImportNames = (importDec: ImportDeclarationNode): Array<string> =>
  importDec.specifiers.map(({ local }) => local.name);

const transformImports = (
  importDec: ImportDeclarationNode,
  packages: Packages
) => {
  const importedPkg = importDec.source.value;

  const pkgConfig = packages[importedPkg];

  if (!pkgConfig) {
    console.error(
      `${importedPkg} is not added in "imports" in react-showroom.js`
    );
    return '';
  }

  const { starImports, namedImports, defaultImports } =
    categorizeImports(importDec);

  const starImportsOutput: string = (function () {
    if (starImports.length === 0) {
      return '';
    }

    return starImports
      .map(
        ({ local }) =>
          `const ${local.name} = imports['${pkgConfig.varName}'];\n`
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

    return `const {${importSpecifiers}} = imports['${pkgConfig.varName}'];\n`;
  })();

  const defaultImportsOutput: string = (function () {
    if (defaultImports.length === 0) {
      return '';
    }

    return defaultImports
      .map(
        ({ local }) =>
          `const ${local.name} = tslib.__importDefault(imports['${pkgConfig.varName}']).default;\n`
      )
      .join('');
  })();

  return `${starImportsOutput}${defaultImportsOutput}${namedImportsOutput}`;
};
