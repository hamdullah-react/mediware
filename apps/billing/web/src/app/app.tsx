import { IconContext } from 'react-icons';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import SidebarLayout from './shared/layouts/SidebarLayout';
import { HashRouter } from 'react-router-dom';
import HomeRouter from './router/HomeRouter';
import { routes } from './router/routes';
import SidebarItem from './shared/molecules/SidebarItem';
import AppProvider from './state/providers/AppProvider';

const App = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <IconContext.Provider value={{ color: '#0078D3' }}>
        <HashRouter>
          <SidebarLayout
            sidebar={routes.map((route, index) => (
              <SidebarItem
                key={`${route.label}_${index}`}
                slug={route.path}
                label={route.label}
              />
            ))}
          >
            <AppProvider>
              <HomeRouter />
            </AppProvider>
          </SidebarLayout>
        </HashRouter>
      </IconContext.Provider>
    </FluentProvider>
  );
};

export default App;
