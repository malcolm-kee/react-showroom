export { ImportMapData, Packages, transpileImports } from './transpile-imports';

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
