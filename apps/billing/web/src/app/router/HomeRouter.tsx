import { Route, Routes } from 'react-router-dom';
import Home from '../pages/app/Home';
import { routes } from './routes';

const HomeRouter = () => {
  return (
    <Routes>
      <Route Component={Home} path="/" />
      {routes?.map((route, index) => (
        <Route key={`${index}_${route.path}`} path={route.path}>
          <Route Component={route.component} path="" index />
          {route.hasInsertForm && (
            <Route Component={route.component} path="new" index />
          )}
          {route.nestRoutes &&
            route.nestRoutes?.length > 0 &&
            route.nestRoutes?.map((route, index) => (
              <Route key={`${index}_${route.path}`} path={route.path}>
                <Route Component={route.component} path="" index />
                {route.hasInsertForm && (
                  <Route Component={route.component} path="new" index />
                )}
              </Route>
            ))}
        </Route>
      ))}
    </Routes>
  );
};

export default HomeRouter;
