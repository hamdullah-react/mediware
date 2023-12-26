import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { useCallback, useContext, useState } from 'react';
import { Button, Input } from '@fluentui/react-components';
import { getLastRouteItem } from '../../../utils/common';
import SupplierForm from '../../../shared/organisms/supplier/SupplierForm';
import Table from '../../../shared/organisms/Table';
import { ISaleInvoice } from '@billinglib';
import LoaderWrapper from '../../../shared/molecules/LoaderWrapper';
import { SalesContext } from '../../../state/contexts/SalesContext';

const Sales = () => {
  const location = useLocation();

  const { saleInvoiceList, isLoading, getSaleInvoices, deleteSaleInvoice } =
    useContext(SalesContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyViewing, setCurrentlyViewing] = useState<ISaleInvoice>();

  const [currentlyEditing, setCurrentlyEditing] = useState<ISaleInvoice>();

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const onViewData = useCallback(
    (_: ISaleInvoice, index: number) => {
      if (saleInvoiceList) {
        setCurrentlyViewing(saleInvoiceList[index]);
      }
    },
    [currentlyViewing, saleInvoiceList]
  );

  const onEditingData = useCallback(
    (_: ISaleInvoice, index: number) => {
      if (saleInvoiceList) {
        setCurrentlyEditing(saleInvoiceList[index]);
      }
    },
    [currentlyEditing, saleInvoiceList]
  );

  const onDeletingData = async (_: ISaleInvoice, index: number) => {
    if (saleInvoiceList) {
      if (deleteSaleInvoice && saleInvoiceList[index]) {
        await deleteSaleInvoice(saleInvoiceList[index]);
      }
    }
  };

  const closeModals = useCallback(() => {
    setCurrentlyViewing(undefined);
    setCurrentlyEditing(undefined);
  }, [currentlyEditing, currentlyViewing]);

  const getFilteredData = useCallback(() => {
    if (saleInvoiceList)
      return saleInvoiceList
        .map((supplier) => ({
          Invoice: supplier.saleInvoiceId,
          Customer: supplier.customerName,
          'Phone No.': supplier.telephone,
          Whatsapp: supplier.whatsapp,
        }))
        ?.filter(
          (data) =>
            data?.Invoice?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            data?.Customer?.toLowerCase().includes(
              searchQuery?.toLowerCase()
            ) ||
            (data?.['Phone No.'] ?? '')
              ?.toLowerCase()
              .includes(searchQuery?.toLowerCase()) ||
            (data?.Whatsapp ?? '')
              ?.toLowerCase()
              .includes(searchQuery?.toLowerCase())
        );
    return [];
  }, [searchQuery, saleInvoiceList]);

  return (
    <div>
      <Modal
        isOpen={!!currentlyViewing}
        onClosePressed={closeModals}
        title={`Customer #${currentlyViewing?.saleInvoiceId} - ${currentlyViewing?.customerName}`}
      >
        {/* {!!closeModals && <SupplierViewer supplier={currentlyViewing} />} */}
      </Modal>
      <Modal isOpen={!!currentlyEditing} onClosePressed={closeModals}>
        {!!currentlyEditing && (
          <>hello</>
          // <SupplierEditor
          //   supplier={currentlyEditing}
          //   setSupplier={setCurrentlyEditing}
          // />
        )}
      </Modal>
      <div className="flex flex-row justify-end gap-2 py-5">
        <Input
          disabled={
            !!currentlyEditing || !!currentlyViewing || isCreatingRecord
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          size="medium"
        />
        <Button size="medium" onClick={getSaleInvoices}>
          Refresh
        </Button>
        <Modal
          isOpen={isCreatingRecord}
          hideClose={false}
          setIsOpen={setIsCreatingRecord}
          title="Add Supplier"
          triggerButton={
            <Button size="medium" onClick={toggleModel}>
              Add New
            </Button>
          }
        >
          <SupplierForm formStateSetter={setIsCreatingRecord} />
        </Modal>
      </div>
      <div>
        <LoaderWrapper isLoading={isLoading}>
          {saleInvoiceList && saleInvoiceList?.length > 0 && (
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

export default Sales;
