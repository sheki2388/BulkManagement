export interface DeviceType {
  MO: boolean;
  SW: boolean;
  TA: boolean;
}

export interface FlowType {
  OTT: boolean;
  STANDALONE: boolean;
  API: boolean;
  MVA: boolean;
}

export interface Rule {
  id: string;
  type:
    | 'device_type'
    | 'manufacture_name'
    | 'store_id'
    | 'flow'
    | 'price_range'
    | 'loyalty_points';
  config: {
    // Device Type
    deviceTypes?: DeviceType;
    // Manufacture Name
    manufactureNames?: string[];
    // Store ID
    storeIds?: string;
    // Flow
    flowTypes?: FlowType;
    // Price Range
    priceMin?: number;
    priceMax?: number;
    // Loyalty Points
    minPoints?: number;
    maxPoints?: number;
  // ...removed custom rule fields...
  };
}

export interface PriceConfiguration {
  erPricepoint: string;
  endDateKnown: boolean;
  duration: 'year' | 'month' | 'week' | 'day';
  durationValue?: number;
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
  pricingFrames?: PriceConfiguration[];
  isSelected: boolean;
}

export interface BulkOperation {
  type: 'copy' | 'delete' | 'edit' | 'activate' | 'deactivate';
  targetIds: string[];
}