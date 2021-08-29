export interface RequestCompileData {
  source: string;
  messageId: number;
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
    };
