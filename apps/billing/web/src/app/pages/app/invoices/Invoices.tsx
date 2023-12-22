import { useCallback, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import InvoiceForm from './InvoiceForm';
import Modal from '../../../shared/organisms/Modal';
import { Button, Input } from '@fluentui/react-components';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';
import moment from 'moment';
import Table from '../../../shared/organisms/Table';
import { APP_ROUNDOFF_SETTING, IInvoice } from '@billinglib';

const Invoices = () => {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyViewing, setCurrentlyViewing] = useState<IInvoice>();

  const [currentlyEditing, setCurrentlyEditing] = useState<IInvoice>();

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const { invoiceList } = useContext(InvoiceContext);

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const onViewData = useCallback((_: IInvoice, index: number) => {
    if (invoiceList) {
      setCurrentlyViewing(invoiceList[index]);
    }
  }, []);

  const onEditingData = useCallback((_: IInvoice, index: number) => {
    if (invoiceList) {
      setCurrentlyEditing(invoiceList[index]);
    }
  }, []);

  const clearCurrentlyViewing = useCallback(() => {
    setCurrentlyViewing(undefined);
  }, []);

  const clearCurrentlyEdting = useCallback(() => {
    setCurrentlyEditing(undefined);
  }, []);

  const onUpdateSuppler = useCallback(() => {}, []);

  const getFilteredData = useCallback(() => {
    if (invoiceList) {
      return invoiceList
        .map((invoice) => ({
          'Invoice Number': invoice.invoiceNumber,
          Company: invoice.Supplier?.name,
          Date: moment(invoice.invoiceDate).format('DD/MM/YYYY'),
          'Booking Driver': invoice.bookingDriver,
          Total: (invoice?.total ?? 0).toFixed(APP_ROUNDOFF_SETTING),
        }))
        ?.filter(
          (data) =>
            data['Invoice Number']
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            data?.Company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data?.Date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data?.['Booking Driver']
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            data.Total?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  }, [searchQuery]);

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
      <Modal isOpen={!!currentlyViewing} onClosePressed={clearCurrentlyViewing}>
        {!!currentlyViewing && <div>{JSON.stringify(currentlyViewing)}</div>}
      </Modal>
      <Modal isOpen={!!currentlyEditing} onClosePressed={clearCurrentlyEdting}>
        {!!currentlyEditing && (
          <div>
            {JSON.stringify(currentlyEditing)}
            <div className="flex flex-row justify-end mt-4">
              <Button onClick={onUpdateSuppler}>Editing</Button>
            </div>
          </div>
        )}
      </Modal>
      <div className="flex flex-row justify-end">
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div>
        {invoiceList && invoiceList?.length > 0 && (
          <Table
            data={getFilteredData() as unknown as []}
            onViewData={onViewData}
            onEdit={onEditingData}
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;
