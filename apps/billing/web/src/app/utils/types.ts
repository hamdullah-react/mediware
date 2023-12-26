export interface IRoute {
  path: string;
  component: () => JSX.Element;
  hasInsertForm?: boolean;
  nestRoutes?: IRoute[];
  label: string;
  showInSidebar?: boolean;
}

export const STATAUS = ['Posted', 'Unposted'];
