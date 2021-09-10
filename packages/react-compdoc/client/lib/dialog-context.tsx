import { parseQueryString, stringifyQueryString } from '@compdoc/core';
import { useId } from '@radix-ui/react-id';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type DialogContextType = {
  openedDialogId: string;
  setOpenedDialogId: (id: string) => void;
};

const DialogContext = React.createContext<DialogContextType>({
  openedDialogId: '',
  setOpenedDialogId: function noop() {},
});

export const DialogContextProvider = (props: { children: React.ReactNode }) => {
  const location = useLocation();
  const history = useHistory();
  const params = React.useMemo(
    () => parseQueryString(location.search),
    [location.search]
  );

  const [openedDialogId, setOpenedDialogId] = React.useState(
    () => (params.modalId as string) || ''
  );

  return (
    <DialogContext.Provider
      value={React.useMemo(
        () => ({
          openedDialogId,
          setOpenedDialogId: (id) => {
            setOpenedDialogId(id);
            history.push({
              search: stringifyQueryString({
                modalId: id,
              }),
            });
          },
        }),
        [openedDialogId, history]
      )}
    >
      {props.children}
    </DialogContext.Provider>
  );
};

export const useDialog = (fixedId?: string) => {
  const dialogId = useId(fixedId);

  const { openedDialogId, setOpenedDialogId } = React.useContext(DialogContext);

  return {
    isOpen: openedDialogId === dialogId,
    open: () => setOpenedDialogId(dialogId),
    dismiss: () => setOpenedDialogId(''),
  };
};
