export const SUPPORTED_LANGUAGES = ['js', 'jsx', 'ts', 'tsx'] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const NON_VISUAL_LANGUAGES = ['js', 'ts'] as const;

export const getCompilationKey = (
  source: string,
  language: SupportedLanguage
) => ['codeCompilation', source, language];
