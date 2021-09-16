import { useId } from '@radix-ui/react-id';
import { useQueryParams } from './use-query-params';

export const useDialog = (fixedId?: string) => {
  const dialogId = useId(fixedId);

  const [params, setQueryParams] = useQueryParams();

  return {
    dialogId,
    isOpen: params.modalId === dialogId,
    open: () =>
      setQueryParams({
        modalId: dialogId,
      }),
    dismiss: () =>
      setQueryParams({
        modalId: undefined,
        code: undefined,
      }),
  };
};
