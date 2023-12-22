export function billingLibs(): string {
  return 'billing-libs';
}

export const APP_ROUNDOFF_SETTING = 2;

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
}

export interface IMedicine {
  id?: number;
  name: string;
  formula?: string;
  brand?: string;
  type?: MedicineTypes;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  InvoiceMedicine?: IInvoiceMedicine[];
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
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IInvoiceMedicine {
  id?: number;
  batchIdentifier: string;
  quantity: number;
  packing: string;
  expirey: Date;
  unitTakePrice: number;
  unitSalePrice: number;
  discountPercentage: number;
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
