import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogSurface,
  Divider,
} from '@fluentui/react-components';

interface Alert {
  error: 'Error' | 'Alert' | 'Success';
  message: string;
  shown: boolean;
}

interface Props {
  children: ReactNode | ReactNode[];
}

export const AlertContext = createContext<{
  alert?: Alert;
  setAlert?: Dispatch<SetStateAction<Alert>>;
}>({});

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }: Props) => {
  const [alert, setAlert] = useState<Alert>({
    error: 'Alert',
    message: '',
    shown: false,
  });

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <Dialog open={alert && alert.shown}>
        <DialogSurface>
          <DialogContent>
            <div className="text-lg font-semibold capitalize">
              {alert?.error}
            </div>
            <Divider className="my-4" />
            <div className="text-lg">{alert?.message}</div>
          </DialogContent>
          <DialogActions>
            <div className="flex flex-row justify-end w-full">
              <Button
                size="large"
                onClick={() =>
                  setAlert({
                    error: alert.error,
                    message: alert.message,
                    shown: false,
                  })
                }
              >
                Close
              </Button>
            </div>
          </DialogActions>
        </DialogSurface>
      </Dialog>
      {children}
    </AlertContext.Provider>
  );
};
