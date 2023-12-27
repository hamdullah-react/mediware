import { ISaleInvoice } from '@billinglib';

interface Props {
  supplier?: ISaleInvoice;
}
const SalesViewer = ({ supplier }: Props) => {
  return <div>SalesViewer</div>;
};

export default SalesViewer;
