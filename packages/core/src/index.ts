export { flattenArray, NestedArray } from './flatten-array';
export { omit } from './object';
export { parseQueryString, stringifyQueryString } from './query-string';
export { safeEval } from './safe-eval';
export { Ssr } from './ssr-types';
export { ImportMapData, Packages, transpileImports } from './transpile-imports';
export { isDefined, isNil, isNumber } from './type-guard';

export interface RequestCompileData {
  source: string;
  messageId: number;
}

export interface CompilationError {
  type: 'compilationError';
  line: number;
}

export interface CompilationSuccessResult {
  type: 'success';
  code: string;
  messageId: number;
  /**
   * Local names for the import statements in the code.
   */
  importNames: Array<string>;
}

export type CompileResult =
  | CompilationSuccessResult
  | {
      type: 'error';
      error: string;
      messageId: number;
      meta?: CompilationError;
    };

export type CodeBlocks = Record<string, CompilationSuccessResult | undefined>;

export const SUPPORTED_LANGUAGES: ReadonlyArray<string> = [
  'js',
  'jsx',
  'ts',
  'tsx',
];

export type Environment = 'development' | 'production';
