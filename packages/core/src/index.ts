export { flattenArray, NestedArray } from './flatten-array';
export { getSafeName } from './get-safe-name';
export { omit } from './object';
export { ImportMapData, Packages, postCompile } from './post-compile';
export { parseQueryString, stringifyQueryString } from './query-string';
export { safeEval } from './safe-eval';
export { Ssr } from './ssr-types';
export { isDefined, isNil, isNumber, isString } from './type-guard';

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
  importedPackages: Array<string>;
}

export interface CompilationErrorResult {
  type: 'error';
  error: string;
  messageId: number;
  meta?: CompilationError;
}

export type CompileResult = CompilationSuccessResult | CompilationErrorResult;

export type CodeBlocks = Record<string, CompilationSuccessResult | undefined>;

export const SUPPORTED_LANGUAGES: ReadonlyArray<string> = [
  'js',
  'jsx',
  'ts',
  'tsx',
];

export type Environment = 'development' | 'production';
