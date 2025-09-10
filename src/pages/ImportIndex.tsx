import { useEffect, useState } from "react";
import { OfferCreationForm } from "@/components/OfferCreationForm";
import { Offer } from "@/components/offer/types";
import { Button } from "@/components/ui/button";


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
            deviceTypes: { MO: idx % 2 === 0, SW: idx % 3 === 0, TA: idx % 4 === 0 }
          },
          isRequired: idx % 2 === 0
        }
      ],
      priceConfiguration: {
        erPricepoint: `${100 + idx * 5}`,
        endDateKnown: idx % 2 === 0,
        duration: ["month", "week", "day"][idx % 3] as "month" | "week" | "day",
        promoType: type === "PROMO" ? "Discount" : type === "VOUCHER" ? "Voucher" : "",
        description: type === "PROMO" ? "10% off" : type === "VOUCHER" ? "Get 1 free" : "",
        priceModifier: {
          type: idx % 2 === 0 ? "percentage" : "fixed",
          value: idx % 2 === 0 ? 10 : 0,
          start: 0,
          end: 0,
          amount: idx % 2 === 0 ? 0 : 10
        }
      },
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



const ImportIndex = () => {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Load all offers at once (no pagination)
    const allOffers = generateMockOffers(0, TOTAL_OFFERS);
    setOffers(allOffers);
  }, []);

  return (
    <OfferCreationForm initialOffers={offers} mode="import" />
  );
};

export default ImportIndex;
