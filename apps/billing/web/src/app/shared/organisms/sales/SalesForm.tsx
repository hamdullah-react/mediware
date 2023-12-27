import { ISaleInvoice } from '@billinglib';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  onCreateSupplier?: () => void;
  formStateSetter?: Dispatch<SetStateAction<boolean>>;
}

const SalesForm = ({ formStateSetter, onCreateSupplier }: Props) => {
  const [newSaleInvoice, setNewSaleInvoice] = useState<ISaleInvoice>({
    customerName: '',
    saleInvoiceId: '',
    dicountPrice: 0,
    totalRecieved: 0,
    address: '',
    telephone: '',
    whatsapp: '',
    Items: [],
  });

  return <div>SalesForm</div>;
};

export default SalesForm;
