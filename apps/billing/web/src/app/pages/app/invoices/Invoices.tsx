import { useCallback, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import InvoiceForm from '../../../shared/organisms/invoice/InvoiceForm';
import Modal from '../../../shared/organisms/Modal';
import { Button, Input } from '@fluentui/react-components';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';
import moment from 'moment';
import Table from '../../../shared/organisms/Table';
import { APP_ROUNDOFF_SETTING, APP_TIME_FORMAT, IInvoice } from '@billinglib';
import InvoiceViewer from '../../../shared/organisms/invoice/InvoiceViewer';
import LoaderWrapper from '../../../shared/molecules/LoaderWrapper';
import InvoiceEditor from '../../../shared/organisms/invoice/InvoiceEditor';

const Invoices = () => {
  const location = useLocation();

  const { invoiceList, isLoading, deleteInvoice, getInvoices } =
    useContext(InvoiceContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyViewing, setCurrentlyViewing] = useState<IInvoice>();

  const [currentlyEditing, setCurrentlyEditing] = useState<IInvoice>();

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const onViewData = useCallback(
    (_: IInvoice, index: number) => {
      if (invoiceList) {
        setCurrentlyViewing(invoiceList[index]);
      }
    },
    [invoiceList, currentlyViewing]
  );

  const onEditingData = useCallback(
    (_: IInvoice, index: number) => {
      if (invoiceList) {
        setCurrentlyEditing(invoiceList[index]);
      }
    },
    [invoiceList, currentlyEditing]
  );

  const onDeletingData = async (_: IInvoice, index: number) => {
    if (invoiceList && invoiceList[index] && deleteInvoice) {
      await deleteInvoice(invoiceList[index]);
    }
  };

  const closeModals = useCallback(() => {
    setCurrentlyViewing(undefined);
    setCurrentlyEditing(undefined);
  }, [currentlyEditing, currentlyViewing]);

  const getFilteredData = useCallback(() => {
    if (invoiceList) {
      return invoiceList
        .map((invoice) => ({
          'Invoice Number': invoice.invoiceNumber,
          Company: invoice.Supplier?.name,
          Date: moment(invoice.invoiceDate).format(APP_TIME_FORMAT),
          'Adv Tax': String(invoice.advTax),
          Total: (invoice?.total ?? 0).toFixed(APP_ROUNDOFF_SETTING),
        }))
        ?.filter(
          (data) =>
            data['Invoice Number']
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            data?.Company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data?.Date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data?.['Adv Tax']?.includes(searchQuery.toLowerCase()) ||
            data.Total?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  }, [searchQuery, invoiceList]);

  return (
    <div>
      <Modal
        isOpen={!!currentlyViewing}
        onClosePressed={closeModals}
        width={'80vw'}
        maxWidth={'80vw'}
        title={`Invoice #${currentlyViewing?.id} from ${
          currentlyViewing?.Supplier?.name ?? ''
        }`}
      >
        {!!currentlyViewing && <InvoiceViewer invoice={currentlyViewing} />}
      </Modal>
      <Modal
        isOpen={!!currentlyEditing}
        onClosePressed={closeModals}
        width={'80vw'}
        maxWidth={'80vw'}
      >
        {!!currentlyEditing && (
          <InvoiceEditor
            invoice={currentlyEditing}
            setInvoice={setCurrentlyEditing}
          />
        )}
      </Modal>
      <div className="flex flex-row justify-end gap-2 py-5">
        <Input
          disabled={
            isCreatingRecord || !!currentlyEditing || !!currentlyViewing
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          size="medium"
        />
        <Button size="medium" onClick={getInvoices}>
          Refresh
        </Button>
        <Modal
          isOpen={isCreatingRecord}
          hideClose={false}
          setIsOpen={setIsCreatingRecord}
          title="Add Invoice"
          triggerButton={
            <Button size="medium" onClick={toggleModel}>
              Add New
            </Button>
          }
        >
          <InvoiceForm formStateSetter={() => setIsCreatingRecord(false)} />
        </Modal>
      </div>
      <div>
        <LoaderWrapper isLoading={isLoading}>
          {invoiceList && invoiceList?.length > 0 && (
            <Table
              data={getFilteredData() as unknown as []}
              onViewData={onViewData}
              onEdit={onEditingData}
              onDelete={onDeletingData}
            />
          )}
        </LoaderWrapper>
      </div>
    </div>
  );
};

export default Invoices;
