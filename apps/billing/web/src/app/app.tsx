import { IconContext } from 'react-icons';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import SidebarLayout from './shared/layouts/SidebarLayout';
import { useLocation } from 'react-router-dom';
import HomeRouter from './router/HomeRouter';
import { routes } from './router/routes';
import SidebarItem from './shared/molecules/SidebarItem';

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
          sidebar={routes.map((route, index) => (
            <SidebarItem
              key={`${route.label}_${index}`}
              isActive={route.path === location.pathname}
              slug={route.path}
              label={route.label}
            />
          ))}
        >
          <HomeRouter />
        </SidebarLayout>
      </IconContext.Provider>
    </FluentProvider>
  );
};

export default App;
