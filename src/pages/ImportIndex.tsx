import { useEffect, useState } from "react";
import { OfferCreationForm } from "@/components/OfferCreationForm";
import { Offer } from "@/components/offer/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mocked fetch function simulating BE call with pagination
const TOTAL_OFFERS = 53;
const logicalTypes: Offer["type"][] = ["PROMO", "BASE", "VOUCHER", "PRODUCT"];
const logicalStatuses: Offer["status"][] = ["Active", "Draft", "Inactive", "Live", "Reviewed"];
const logicalNames = [
  "Promo Discount", "Base Subscription", "Voucher Reward", "Product Launch",
  "Seasonal Promo", "Annual Base", "Gift Voucher", "New Product",
  "Flash Sale", "Monthly Base", "Referral Voucher", "Limited Edition"
];

export const generateMockOffers = (start: number, count: number): Offer[] => {
  return Array.from({ length: count }, (_, i) => {
    const idx = start + i;
    const type = logicalTypes[idx % logicalTypes.length];
    const status = logicalStatuses[idx % logicalStatuses.length];
    const name = logicalNames[idx % logicalNames.length] + ` #${idx + 1}`;
    const endDateKnown = idx % 2 === 0;
    const basePriceConfig: Offer["priceConfiguration"] = {
      erPricepoint: `${100 + idx * 5}`,
      endDateKnown,
      duration: ["year", "month", "week", "day"][idx % 4] as "year" | "month" | "week" | "day",
      durationValue: (idx % 4) + 1,
      promoType: type === "PROMO" ? "Discount" : type === "VOUCHER" ? "Voucher" : "",
      description: type === "PROMO" ? "10% off" : type === "VOUCHER" ? "Get 1 free" : "Standard pricing",
      priceModifier: {
        type: idx % 3 === 0 ? "percentage" : idx % 3 === 1 ? "fixed" : "points",
        value: 10 + idx,
        start: 0,
        end: 12,
        amount: 5 + idx
      }
    };
    return {
      id: `offer-${idx + 1}`,
      name,
      description: `This is a ${type.toLowerCase()} offer for ${name}.`,
      type,
      productId: `PRD-${1000 + idx}`,
      eipProductId: `EIP-${2000 + idx}`,
      rules: [
        {
          id: `rule-${idx + 1}`,
          type: "device_type",
          label: "Device Type Rule",
          config: {
            deviceTypes: { MO: true, SW: true, TA: true }
          },
          isRequired: true
        }
      ],
      priceConfiguration: basePriceConfig,
      pricingFrames: endDateKnown ? [basePriceConfig] : undefined,
      isSelected: false,
      update_status: "ready",
      status,
    };
  });
};

const fetchOffersFromBE = async (page: number, pageSize: number): Promise<{ offers: Offer[]; total: number }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const count = Math.min(pageSize, TOTAL_OFFERS - start);
      resolve({ offers: generateMockOffers(start, count), total: TOTAL_OFFERS });
    }, 500);
  });
};

const countryOptions = ["DE", "ES", "IE", "IT", "PT", "RO", "GB", "CZ", "GR"];

const ImportIndex = () => {
  const [offers, setOffers] = useState<Offer[]>(generateMockOffers(0, TOTAL_OFFERS));

  return (
    <div className="space-y-6">
  {/* Country selection removed as requested */}
  <OfferCreationForm initialOffers={offers} mode="import" />
    </div>
  );
};

export default ImportIndex;
