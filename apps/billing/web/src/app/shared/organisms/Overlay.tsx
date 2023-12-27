import { OverlayDrawer } from '@fluentui/react-components';

const Overlay = () => {
  return (
    <div>
      <OverlayDrawer
        size="medium"
        position="start"
        open={false}
      ></OverlayDrawer>
    </div>
  );
};

export default Overlay;
