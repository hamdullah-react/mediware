import Invoices from '../pages/app/invoices/Invoices';
import Medicines from '../pages/app/medicines/Medicines';
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
  {
    path: '/medicines',
    component: Medicines,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Medicines',
  },
  {
    path: '/invoice',
    component: Invoices,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Invoice',
  },
];

export { routes };
