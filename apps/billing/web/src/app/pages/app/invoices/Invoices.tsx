import { useCallback, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import InvoiceForm from './InvoiceForm';
import Modal from '../../../shared/organisms/Modal';
import { Button } from '@fluentui/react-components';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';
import moment from 'moment';
import Table from '../../../shared/organisms/Table';
import { APP_ROUNDOFF_SETTING } from '@billinglib';

const Invoices = () => {
  const location = useLocation();

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const { invoiceList } = useContext(InvoiceContext);

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const getFilteredData = useCallback(() => {
    if (invoiceList) {
      return invoiceList.map((invoice) => ({
        'Invoice Number': invoice.invoiceNumber,
        Company: invoice.Supplier?.name,
        Date: moment(invoice.invoiceDate).format('DD/MM/YYYY'),
        'Booking Driver': invoice.bookingDriver,
        Total: (invoice?.total ?? 0).toFixed(APP_ROUNDOFF_SETTING),
      }));
    }
  }, []);

  return (
    <div>
      <div className="p-2 text-gray-400">{location.pathname}</div>
      <Modal
        isOpen={isCreatingRecord}
        hideClose={false}
        modalType="modal"
        setIsOpen={setIsCreatingRecord}
        title="Add Invoice"
        triggerButton={<Button onClick={toggleModel}>Add Invoice</Button>}
      >
        <InvoiceForm />
      </Modal>
      <div>
        {invoiceList && invoiceList?.length > 0 && (
          <Table
            data={getFilteredData() as unknown as []}
            // onDelete={deleteInvoice}
            // onEdit={updateInvoice}
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;
