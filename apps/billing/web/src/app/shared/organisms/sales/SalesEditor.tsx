import { ISaleInvoice } from '@billinglib';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  invoice: ISaleInvoice;
  setInvoice: Dispatch<SetStateAction<ISaleInvoice | undefined>>;
}
const SalesEditor = ({ invoice, setInvoice }: Props) => {
  return <div>SalesEditor</div>;
};

export default SalesEditor;
