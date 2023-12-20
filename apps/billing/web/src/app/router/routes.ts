import Suppliers from '../pages/app/suppliers/Suppliers';
import { IRoute } from '../utils/types';

const routes: IRoute[] = [
  {
    path: '/supplier',
    component: Suppliers,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Supplier',
  },
];

export { routes };
