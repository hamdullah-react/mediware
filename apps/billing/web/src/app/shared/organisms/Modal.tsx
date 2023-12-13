import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  DialogTriggerChildProps,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import {
  Dispatch,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
} from 'react';

interface Props {
  title?: string;
  children?: ReactNode | ReactNode[];
  triggerButton?:
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ((props: DialogTriggerChildProps) => ReactElement<unknown> | null)
    | null
    | undefined;
  modalType?: 'modal' | 'non-modal' | 'alert';
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  hideClose?: boolean;
}

const Modal = ({
  children,
  title,
  triggerButton,
  modalType,
  isOpen = false,
  setIsOpen,
  hideClose = false,
}: Props) => {
  const onClose = useCallback(() => {
    if (setIsOpen) setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Dialog modalType={modalType} open={isOpen}>
      <DialogTrigger disableButtonEnhancement>{triggerButton}</DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  disabled={hideClose}
                  onClick={onClose}
                  appearance="subtle"
                  aria-label="close"
                  icon={<Dismiss24Regular />}
                />
              </DialogTrigger>
            }
          >
            {title}
          </DialogTitle>
          <DialogContent>{children}</DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default Modal;
