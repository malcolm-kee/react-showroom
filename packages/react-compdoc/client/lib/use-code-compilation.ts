import { useQuery } from 'react-query';

export const useCodeCompilation = (providedCode: string) => {
  const code = providedCode.trim();

  return useQuery({
    queryKey: ['codeCompilation', code],
    queryFn: () => import('./compile-code').then((m) => m.compileCode(code)),
    keepPreviousData: true,
  });
};
