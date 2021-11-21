import { useQuery } from '@showroomjs/bundles/query';
import {
  CompilationErrorResult,
  CompilationSuccessResult,
  CompileResult,
  getCompilationKey,
  SupportedLanguage,
} from '@showroomjs/core';
import { addMissingImports } from './add-missing-imports';
import { useCodeImports } from './code-imports-context';

export const useCodeCompilationCache = (
  providedCode: string,
  lang: SupportedLanguage
) => {
  const code = providedCode.trim();

  return useQuery<CompileResult>(getCompilationKey(code, lang), {
    enabled: false,
  });
};

export const useCodeCompilation = (
  providedCode: string,
  lang: SupportedLanguage,
  options: {
    onSuccess?: () => void;
  } = {}
) => {
  const code = providedCode.trim();
  const precompiledImports = useCodeImports();

  const result = useQuery({
    queryKey: getCompilationKey(code, lang),
    queryFn: () =>
      import(/* webpackChunkName: "compileCode" */ './compile-code')
        .then((m) => m.compileCode(code, lang))
        .then(
          (
            result
          ): Promise<
            | CompilationErrorResult
            | (CompilationSuccessResult & { imports?: Record<string, any> })
          > => {
            if (result.type === 'error') {
              return Promise.resolve(result);
            }

            return new Promise((fulfill) => {
              addMissingImports(
                precompiledImports,
                result.importedPackages,
                (imports) =>
                  fulfill({
                    ...result,
                    imports,
                  })
              );
            });
          }
        ),
    keepPreviousData: true,
    ...options,
  });

  return {
    ...result,
    isCompiling: result.isLoading || result.isFetching,
  };
};
