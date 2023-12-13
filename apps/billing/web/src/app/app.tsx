import { IconContext } from 'react-icons';
import {
  Divider,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import HomeRouter from './router/HomeRouter';
import SidebarLayout from './shared/layouts/SidebarLayout';
import SidebarItem from './shared/molecules/SidebarItem';
import { useLocation } from 'react-router-dom';
import BrandProvider from './state/providers/BrandProvider';

const App = () => {
  const location = useLocation();
  return (
    <FluentProvider theme={webLightTheme}>
      <IconContext.Provider value={{ color: '#0078D3' }}>
        <SidebarLayout
          pageTitle={
            location.pathname === '/'
              ? 'Welcome'
              : location.pathname.split('/').reverse()?.[0].replace(/\//g, '')
          }
          sidebar={
            <>
              <SidebarItem
                isActive={'/' === location.pathname}
                slug="/"
                label="Home"
              />
              <SidebarItem
                isActive={'/medicines' === location.pathname}
                slug="/medicines"
                label="All Medicines"
              />
              <Divider className="py-5" />
              <SidebarItem
                isActive={'/brands' === location.pathname}
                slug="/brands"
                label="Brands"
              />
              <Divider className="py-5" />
              <SidebarItem
                isActive={'/medicines/capsules' === location.pathname}
                slug="/medicines/capsules"
                label="Capsules"
              />
              <SidebarItem
                isActive={'/medicines/syrups' === location.pathname}
                slug="/medicines/syrups"
                label="Syrups"
              />
              <SidebarItem
                isActive={'/medicines/inhalers' === location.pathname}
                slug="/medicines/inhalers"
                label="Inhalers"
              />
              <SidebarItem
                isActive={'/medicines/injections' === location.pathname}
                slug="/medicines/injections"
                label="Injections"
              />
              <SidebarItem
                isActive={'/medicines/drops' === location.pathname}
                slug="/medicines/drops"
                label="Drops"
              />
              <SidebarItem
                isActive={'/medicines/topicals' === location.pathname}
                slug="/medicines/topicals"
                label="Topicals"
              />
              <SidebarItem
                isActive={'/medicines/suppositories' === location.pathname}
                slug="/medicines/suppositories"
                label="Suppositories"
              />
            </>
          }
        >
          <BrandProvider>
            <HomeRouter />
          </BrandProvider>
        </SidebarLayout>
      </IconContext.Provider>
    </FluentProvider>
  );
};

export default App;
