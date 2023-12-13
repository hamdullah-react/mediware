import {
  MenuTrigger,
  Menu as FUIMenu,
  MenuPopover,
} from '@fluentui/react-components';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode | ReactNode[];
  button?: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >;
}

const Menu = ({ children, button }: Props) => {
  return (
    <FUIMenu>
      <MenuTrigger disableButtonEnhancement>{button}</MenuTrigger>
      <MenuPopover>{children}</MenuPopover>
    </FUIMenu>
  );
};

export default Menu;
