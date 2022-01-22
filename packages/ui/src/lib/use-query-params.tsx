import { useSearchParams } from '@showroomjs/bundles/routing';

export const useQueryParams = useSearchParams;

export const searchParamsToObject = (
  search: URLSearchParams,
  excludes: Array<string> = []
) => {
  const result: Record<string, string> = {};

  search.forEach((value, key) => {
    if (!excludes.includes(key)) {
      result[key] = value;
    }
  });

  return result;
};
