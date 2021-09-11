export { flattenArray, NestedArray } from './flatten-array';
export { parseQueryString, stringifyQueryString } from './query-string';
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

export type Environment = 'development' | 'production';
