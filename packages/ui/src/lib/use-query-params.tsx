import { isString } from '@showroomjs/core';
import { useSearchParams } from '@showroomjs/bundles/routing';

export const useQueryParams = () => {
  const [params, setParams] = useSearchParams();

  return [
    params,
    function setParamsValue<Merge extends boolean = false>(
      value: Merge extends true
        ? Record<string, string | undefined>
        : Record<string, string>,
      { replace = true, merge }: { replace?: boolean; merge?: Merge } = {}
    ) {
      if (merge) {
        const nextQuery = searchParamsToObject(params, Object.keys(value));

        Object.entries(value).forEach(([key, value]) => {
          if (isString(value)) {
            nextQuery[key] = value;
          }
        });

        setParams(nextQuery, { replace });
      } else {
        setParams(value as Record<string, string>, { replace });
      }
    },
  ] as const;
};

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
