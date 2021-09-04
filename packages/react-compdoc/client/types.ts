export interface RequestCompileData {
  source: string;
  messageId: number;
}

export interface CompilationError {
  type: 'compilationError';
  line: number;
}

export type CompileResult =
  | {
      type: 'success';
      code: string;
      messageId: number;
    }
  | {
      type: 'error';
      error: string;
      messageId: number;
      meta?: CompilationError;
    };
