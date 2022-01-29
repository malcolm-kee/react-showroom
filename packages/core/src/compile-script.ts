import { Node, Options, parse } from 'acorn';
import * as walk from 'acorn-walk';
import type * as esbuild from 'esbuild';
import type {
  ExpressionStatementNode,
  ImportDeclarationNode,
  ImportDefaultSpecifierNode,
  ImportNamespaceSpecifierNode,
  ImportSpecifierNode,
  MemberExpressionNode,
  ProgramNode,
} from './acorn-ast';
import { ReactShowroomFeatureCompilation } from './compilation';
import { getSafeName } from './get-safe-name';

export interface ImportMapData {
  name: string;
  varName: string;
}

export type Packages = Record<string, ImportMapData>;

const ACORN_OPTIONS: Options = {
  ecmaVersion: 2018,
  sourceType: 'module',
};

export interface CompileScriptResult {
  code: string;
  importNames: Array<string>;
  importedPackages: Array<string>;
  features: Array<ReactShowroomFeatureCompilation>;
}

/**
 * Additional compilation after compiled by esbuild to JavaScript
 */
export const compileScript = async (
  providedCode: string,
  compiler: typeof esbuild,
  options: {
    insertRenderIfEndWithJsx?: boolean;
    language: esbuild.Loader;
  }
): Promise<CompileScriptResult> => {
  const transpiled = await compiler.transform(providedCode, {
    loader: options.language,
    target: 'es2018',
  });

  let code = transpiled.code;
  const importNames: Array<string> = [];
  const importedPackages: Array<string> = [];

  const features: Array<ReactShowroomFeatureCompilation> = [];

  code = options.insertRenderIfEndWithJsx
    ? insertRenderIfEndWithJsx(code)
    : code;

  if (hasImports(code)) {
    const ast = parse(code, ACORN_OPTIONS);

    let offset = 0;

    walk.simple(ast, {
      ImportDeclaration: (node) => {
        const start = node.start + offset;
        const end = node.end + offset;
        const statement = code.substring(start, end);

        const declarationNode = node as ImportDeclarationNode;

        const transpiledStatement = transformImports(declarationNode);

        const importLocals = getImportNames(declarationNode);
        importNames.push(...importLocals);

        const importedPkg = getImportedPackage(declarationNode);

        importedPackages.push(importedPkg);

        if (importedPkg === 'react-showroom/client') {
          const { namedImports } = categorizeImports(declarationNode);

          if (
            namedImports.some((imp) => imp.imported.name === 'usePropsEditor')
          ) {
            features.push({
              feature: 'propsEditor',
              hasRenderEditor: namedImports.some(
                (imp) => imp.imported.name === 'PropsEditor'
              ),
            });
          }

          if (
            namedImports.some((imp) => imp.imported.name === 'useUnionProps')
          ) {
            features.push({
              feature: 'unionProps',
            });
          }
        }

        code =
          code.substring(0, start) + transpiledStatement + code.substring(end);

        offset += transpiledStatement.length - statement.length;
      },
    });
  }

  return { code, importNames, importedPackages, features };
};

// Strip semicolon (;) at the end
const unsemicolon = (s: string): string => s.replace(/;\s*$/, '');

const insertRenderIfEndWithJsx = (code: string): string => {
  let result = code;

  try {
    const ast: ProgramNode = parse(code, ACORN_OPTIONS) as any;

    if (ast.body && ast.body.length > 0) {
      const lastNode = ast.body[ast.body.length - 1];
      if (isReactCreateElementExpression(lastNode)) {
        result =
          result.substring(0, lastNode.start) +
          `render(${unsemicolon(
            result.substring(lastNode.start, lastNode.end)
          )});`;

        return result;
      }
    }
  } catch (err) {
    console.error(err);
  }

  return result;
};

const hasImports = (code: string): boolean =>
  !!code.match(/import[\S\s]+?['"]([^'"]+)['"];?/m);

const isExpressionNode = (node: Node): node is ExpressionStatementNode =>
  node.type === 'ExpressionStatement';
const isMemberExpressionNode = (node: Node): node is MemberExpressionNode =>
  !!node && node.type === 'MemberExpression';
const isReactCreateElementExpression = (node: Node) =>
  isExpressionNode(node) &&
  isMemberExpressionNode(node.expression.callee) &&
  node.expression.callee.object.name === 'React' &&
  node.expression.callee.property.name === 'createElement';

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

const getImportedPackage = (importDec: ImportDeclarationNode): string =>
  importDec.source.value;

const transformImports = (importDec: ImportDeclarationNode) => {
  const importedPkg = importDec.source.value;

  const { starImports, namedImports, defaultImports } =
    categorizeImports(importDec);

  const starImportsOutput: string = (function () {
    if (starImports.length === 0) {
      return '';
    }

    return starImports
      .map(
        ({ local }) =>
          `const ${local.name} = imports['${getSafeName(importedPkg)}'];\n`
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

    return `const {${importSpecifiers}} = imports['${getSafeName(
      importedPkg
    )}'];\n`;
  })();

  const defaultImportsOutput: string = (function () {
    if (defaultImports.length === 0) {
      return '';
    }

    return defaultImports
      .map(
        ({ local }) =>
          `const ${local.name} = tslib.__importDefault(imports['${getSafeName(
            importedPkg
          )}']).default;\n`
      )
      .join('');
  })();

  return `${starImportsOutput}${defaultImportsOutput}${namedImportsOutput}`;
};
