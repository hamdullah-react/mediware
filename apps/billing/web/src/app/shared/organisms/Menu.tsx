import {
  MenuTrigger,
  Menu as FUIMenu,
  MenuPopover,
  PositioningShorthand,
} from '@fluentui/react-components';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode | ReactNode[];
  button?: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >;
  positioning?: PositioningShorthand;
}

const Menu = ({ children, button, positioning = 'below-end' }: Props) => {
  return (
    <FUIMenu positioning={positioning}>
      <MenuTrigger disableButtonEnhancement>{button}</MenuTrigger>
      <MenuPopover className="max-h-[200pt] min-w-[400pt] overscroll-auto">
        {children}
      </MenuPopover>
    </FUIMenu>
  );
};

export default Menu;
