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
    Invoices?: number;
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
  InvoiceMedicines?: IInvoiceMedicine[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  quantityInStock?: number;
  _count?: {
    InvoiceMedicine?: number;
  };
}

export interface IInvoice {
  id?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  salesTax?: number;
  deliveredBy?: string;
  bookingDriver?: string;
  status?: string;
  advTax: number;
  total: number;
  received?: number;
  balance?: number;
  Supplier?: ISupplier;
  supplierId?: number;
  InvoiceMedicines?: IInvoiceMedicine[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IInvoiceMedicine {
  id?: number;
  batchIdentifier: string;
  expirey: Date;
  unitSalePrice: number;
  discountPercentage: number;
  gst?: number;
  discountedAmount: number;
  advTax: number;
  quantity: number;
  medicineId?: number;
  Medicine?: IMedicine;
  invoiceId?: number;
  Invoice?: IInvoice;
  netAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  telephone?: string;
  addressLine1?: string;
  addressLine2?: string;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  token?: string;
}
