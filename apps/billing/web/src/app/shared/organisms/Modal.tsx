import { Button } from '@fluentui/react-components';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  DialogTriggerChildProps,
} from '@fluentui/react-dialog';
import { Dismiss24Regular } from '@fluentui/react-icons';
import {
  Dispatch,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  SetStateAction,
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
  onClosePressed?: () => void;
  hideClose?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
}

const Modal = ({
  children,
  title,
  triggerButton,
  modalType = 'non-modal',
  isOpen = false,
  setIsOpen,
  hideClose = false,
  maxWidth = '600pt',
  minWidth,
  width,
  onClosePressed,
}: Props) => {
  const onClose = () => {
    if (onClosePressed) onClosePressed();
    else if (setIsOpen) setIsOpen(false);
  };

  return (
    <Dialog modalType={modalType} open={isOpen}>
      <DialogTrigger disableButtonEnhancement>{triggerButton}</DialogTrigger>
      <DialogSurface style={{ maxWidth, minWidth, width }}>
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
