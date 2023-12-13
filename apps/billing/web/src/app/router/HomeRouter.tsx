import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import MedicinesList from '../pages/home/medicines/MedicinesList';
import Capsules from '../pages/home/medicines/categories/Capsules';
import Syrups from '../pages/home/medicines/categories/Syrups';
import Inhalers from '../pages/home/medicines/categories/Inhalers';
import Drops from '../pages/home/medicines/categories/Drops';
import Topicals from '../pages/home/medicines/categories/Topicals';
import Suppositories from '../pages/home/medicines/categories/Suppositories';
import Injections from '../pages/home/medicines/categories/Injections';
import Brands from '../pages/home/Brands';

const HomeRouter = () => {
  return (
    <Routes>
      <Route Component={Home} path="/" />
      <Route path="/brands">
        <Route Component={Brands} path="" index />
        <Route Component={Brands} path="insert" index />
      </Route>
      <Route path="/medicines">
        <Route path="" Component={MedicinesList} index />
        <Route path="capsules">
          <Route Component={Capsules} path="" index />
          <Route Component={Capsules} path="insert" />
        </Route>
        <Route path="syrups">
          <Route Component={Syrups} path="" index />
          <Route Component={Syrups} path="insert" />
        </Route>
        <Route path="inhalers">
          <Route Component={Inhalers} path="" index />
          <Route Component={Inhalers} path="insert" />
        </Route>
        <Route path="injections">
          <Route Component={Injections} path="" index />
          <Route Component={Injections} path="insert" />
        </Route>
        <Route path="drops">
          <Route Component={Drops} path="" index />
          <Route Component={Drops} path="insert" />
        </Route>
        <Route path="topicals">
          <Route Component={Topicals} path="" index />
          <Route Component={Topicals} path="insert" />
        </Route>
        <Route path="suppositories">
          <Route Component={Suppositories} path="" index />
          <Route Component={Suppositories} path="insert" />
        </Route>
      </Route>
    </Routes>
  );
};

export default HomeRouter;
