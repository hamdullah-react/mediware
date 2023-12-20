export function billingLibs(): string {
  return 'billing-libs';
}

export interface ISupplier {
  id?: string;
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
}
