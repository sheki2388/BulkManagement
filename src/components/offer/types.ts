export interface DeviceType {
  MO: boolean;
  SW: boolean;
  TA: boolean;
}

export interface FlowType {
  OTT: boolean;
  TMF: boolean;
  STANDALONE: boolean;
  MVA: boolean;
}

export interface Rule {
  id: string;
  type: 'device_range' | 'device_type' | 'flow' | 'price_range' | 'loyalty_points' | 'custom';
  label: string;
  config: {
    fromDate?: Date;
    toDate?: Date;
    deviceTypes?: DeviceType;
    flowTypes?: FlowType;
    priceMin?: number;
    priceMax?: number;
    customField?: string;
    customValue?: string;
    customOperator?: 'equals' | 'contains' | 'greater_than' | 'less_than';
  };
  isRequired: boolean;
}

export interface PriceConfiguration {
  erPricepoint: string;
  endDateKnown: boolean;
  duration: 'month' | 'week' | 'day';
  promoType: string;
  description: string;
  priceModifier: {
    type: 'percentage' | 'fixed' | 'points';
    value: number;
    start: number;
    end: number;
    amount: number;
  };
}

export interface Offer {
  update_status: string;
  status?: 'Draft' | 'Inactive' | 'Active' | 'Live' | 'Reviewed';
  id: string;
  name: string;
  description: string;
  type: 'PROMO' | 'BASE' | 'VOUCHER' | 'PRODUCT';
  productId: string;
  startDate?: Date;
  endDate?: Date;
  testingStartDate?: Date;
  eipProductId: string;
  rules: Rule[];
  priceConfiguration: PriceConfiguration;
  isSelected: boolean;
}

export interface BulkOperation {
  type: 'copy' | 'delete' | 'edit' | 'activate' | 'deactivate';
  targetIds: string[];
}