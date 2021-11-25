export {
  compileTarget,
  getCompilationKey,
  NON_VISUAL_LANGUAGES,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from './compilation';
export { decodeDisplayName, encodeDisplayName } from './display-name';
export { flattenArray, NestedArray } from './flatten-array';
export { callAll, noop } from './fn-lib';
export type { Callback } from './fn-lib';
export { getSafeName } from './get-safe-name';
export { isEqualArray } from './is-equal-array';
export { omit } from './object';
export { ImportMapData, Packages, postCompile } from './post-compile';
export { compileHtml } from './process-html';
export { parseQueryString, stringifyQueryString } from './query-string';
export { removeTrailingSlash } from './remove-trailing-slash';
export { safeEval } from './safe-eval';
export type { Ssr } from './ssr-types';
export { createSymbol } from './symbol';
export {
  isBoolean,
  isDefined,
  isFunction,
  isNil,
  isNumber,
  isPlainObject,
  isString,
} from './type-guard';

import { SupportedLanguage } from './compilation';
export interface RequestCompileData {
  source: string;
  messageId: number;
  lang: SupportedLanguage;
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
  lang: SupportedLanguage;
  isPlayground: boolean;
  initialCodeHash?: string;
}

export interface CompilationErrorResult {
  type: 'error';
  error: string;
  messageId: number;
  meta?: CompilationError;
}

export type CompileResult = CompilationSuccessResult | CompilationErrorResult;

export type CodeBlocks = Record<string, CompilationSuccessResult | undefined>;

export type Environment = 'development' | 'production';
