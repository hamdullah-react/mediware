export function billingLibs(): string {
  return 'billing-libs';
}

export const APP_ROUNDOFF_SETTING = 2;
export const APP_TIME_FORMAT = 'MMM Do, YYYY hh:mm:ss';
export const APP_DB_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
export const APP_UI_FORM_TIME_FORMAT = 'YYYY-MM-DDThh:mm';
export const APP_UI_FORM_DATE_FORMAT = 'YYYY-MM-DD';

export type MedicineTypes =
  | 'Capsule'
  | 'Tablets'
  | 'Syrups'
  | 'Ointments'
  | 'Suppositories'
  | 'Injections'
  | 'Drips'
  | 'Other'
  | '';

export const MedicineTypes: MedicineTypes[] = [
  'Capsule',
  'Tablets',
  'Syrups',
  'Ointments',
  'Suppositories',
  'Injections',
  'Drips',
  'Other',
];

export interface ISupplier {
  id?: number;
  emails: string;
  name: string;
  city: string;
  telephones: string;
  addressLine1: string;
  addressLine2: string;
  whatsapps: string;
  NTN: string;
  STN: string;
  licenseNumber: string;
  TNNumber: string;
  TRNNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  _count?: {
    Invoice?: number;
  };
}

export interface IMedicine {
  id?: number;
  name: string;
  code?: string;
  formula?: string;
  brand?: string;
  type?: MedicineTypes;
  packing: string;
  unitTakePrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  InvoiceMedicine?: IInvoiceMedicine[];
  _count?: {
    InvoiceMedicine?: number;
  };
}

export interface IInvoice {
  id?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  total: number;
  InvoiceMedicine?: IInvoiceMedicine[];
  salesTax?: number;
  supplierId?: number;
  Supplier?: ISupplier;
  deliveredBy?: string;
  bookingDriver?: string;
  status?: string;
  advTax: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IInvoiceMedicine {
  id?: number;
  batchIdentifier: string;
  quantity: number;
  expirey: Date;
  unitSalePrice: number;
  discountPercentage: number;
  gst?: number;
  advTax: number;
  discountedAmount: number;
  netAmount: number;
  medicineId?: number;
  Medicine?: IMedicine;
  invoiceId?: number;
  Invoice?: IInvoice;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
