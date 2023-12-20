export interface IRoute {
  path: string;
  component: () => JSX.Element;
  hasInsertForm?: boolean;
  nestRoutes?: IRoute[];
  label: string;
}
