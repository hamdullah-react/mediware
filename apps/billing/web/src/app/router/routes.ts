import Account from '../pages/app/Account';
import Settings from '../pages/app/Settings';
import Invoices from '../pages/app/invoices/Invoices';
import Medicines from '../pages/app/medicines/Medicines';
// import Sales from '../pages/app/sale/Sales';
import Suppliers from '../pages/app/suppliers/Suppliers';
import { IRoute } from '../utils/types';

const routes: IRoute[] = [
  {
    path: '/supplier',
    component: Suppliers,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Supplier',
    showInSidebar: true,
  },
  {
    path: '/medicines',
    component: Medicines,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Medicines',
    showInSidebar: true,
  },
  {
    path: '/invoice',
    component: Invoices,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Invoice',
    showInSidebar: true,
  },
  // {
  //   path: '/sales',
  //   component: Sales,
  //   hasInsertForm: true,
  //   nestRoutes: [],
  //   label: 'Sales',
  //   showInSidebar: true,
  // },
  {
    path: '/account',
    component: Account,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Account',
    showInSidebar: false,
  },
  {
    path: '/settings',
    component: Settings,
    hasInsertForm: true,
    nestRoutes: [],
    label: 'Settings',
    showInSidebar: false,
  },
];

export { routes };
