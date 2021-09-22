import { useQuery } from '@showroomjs/bundles/query';
import {
  CompilationErrorResult,
  CompilationSuccessResult,
  getCompilationKey,
  getSafeName,
  SupportedLanguage,
} from '@showroomjs/core';
import { useCodeImports } from './code-imports-context';

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
      import('./compile-code')
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

            return prepareImports(
              precompiledImports,
              result.importedPackages
            ).then((finalImports) => ({
              ...result,
              imports: finalImports,
            }));
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

const nonLocalRegex = /^[a-z][a-zA-Z\-\/]+/;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const prepareImports = (
  precompiledImports: Record<string, any>,
  importedPackages: Array<string>
): Promise<Record<string, any>> => {
  const newImporteds = importedPackages.filter(
    (pkg) =>
      nonLocalRegex.test(pkg) &&
      !hasOwnProperty.call(precompiledImports, getSafeName(pkg))
  );

  if (newImporteds.length > 0) {
    const result = { ...precompiledImports };

    return Promise.all(
      newImporteds.map((newPkg) =>
        loadRemotePackage(newPkg).then((newModule) => {
          result[getSafeName(newPkg)] = newModule;
        })
      )
    ).then(() => result);
  }

  return Promise.resolve(precompiledImports);
};

const remotePackageMap = new Map<string, any>();

export const loadRemotePackage = (pkgName: string) => {
  const cached = remotePackageMap.get(pkgName);

  if (cached) {
    return Promise.resolve(cached);
  }

  return import(/* @vite-ignore */ `https://cdn.skypack.dev/${pkgName}`).then(
    (result) => {
      remotePackageMap.set(pkgName, result);
      return result;
    }
  );
};
