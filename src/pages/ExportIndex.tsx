import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { OfferCreationForm } from "@/components/OfferCreationForm";
import { Offer } from "@/components/offer/types";

const preloadedOffers: Offer[] = [
  {
    id: "offer-1",
    name: "Promo Offer",
    description: "Special promo for bulk export.",
    type: "PROMO",
    productId: "PRD-001",
    eipProductId: "EIP-001",
    rules: [],
    priceConfiguration: {
      erPricepoint: "100",
      endDateKnown: true,
      duration: "month",
      promoType: "Discount",
      description: "10% off",
      priceModifier: {
        type: "percentage",
        value: 10,
        start: 0,
        end: 0,
        amount: 0
      }
    },
    isSelected: false,
    update_status: "ready",
    status: "Draft"
  },
  {
    id: "offer-2",
    name: "Base Offer",
    description: "Base offer for export.",
    type: "BASE",
    productId: "PRD-002",
    eipProductId: "EIP-002",
    rules: [],
    priceConfiguration: {
      erPricepoint: "200",
      endDateKnown: false,
      duration: "month",
      promoType: "",
      description: "",
      priceModifier: {
        type: "fixed",
        value: 0,
        start: 0,
        end: 0,
        amount: 20
      }
    },
    isSelected: false,
    update_status: "ready",
    status: "Active"
  },
  {
    id: "offer-3",
    name: "Voucher Offer",
    description: "Voucher for bulk export.",
    type: "VOUCHER",
    productId: "PRD-003",
    eipProductId: "EIP-003",
    rules: [],
    priceConfiguration: {
      erPricepoint: "300",
      endDateKnown: true,
      duration: "week",
      promoType: "Voucher",
      description: "Voucher code",
      priceModifier: {
        type: "fixed",
        value: 0,
        start: 0,
        end: 0,
        amount: 5
      }
    },
    isSelected: false,
    update_status: "ready",
    status: "Inactive"
  },
  {
    id: "offer-4",
    name: "Live Offer",
    description: "Live offer for export.",
    type: "PROMO",
    productId: "PRD-004",
    eipProductId: "EIP-004",
    rules: [],
    priceConfiguration: {
      erPricepoint: "400",
      endDateKnown: true,
      duration: "month",
      promoType: "Live",
      description: "Live offer",
      priceModifier: {
        type: "percentage",
        value: 15,
        start: 0,
        end: 0,
        amount: 0
      }
    },
    isSelected: false,
    update_status: "ready",
    status: "Live"
  },
  {
    id: "offer-5",
    name: "Reviewed Offer",
    description: "Reviewed offer for export.",
    type: "BASE",
    productId: "PRD-005",
    eipProductId: "EIP-005",
    rules: [],
    priceConfiguration: {
      erPricepoint: "500",
      endDateKnown: true,
      duration: "month",
      promoType: "Reviewed",
      description: "Reviewed offer",
      priceModifier: {
        type: "fixed",
        value: 0,
        start: 0,
        end: 0,
        amount: 50
      }
    },
    isSelected: false,
    update_status: "ready",
    status: "Reviewed"
  }
];



import { useState } from "react";

const statusOptions = ["Draft", "Inactive", "Active", "Live", "Reviewed"];

const ExportIndex = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  return (
    <div>
      <OfferCreationForm
        initialOffers={preloadedOffers}
        mode="export"
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
};

export default ExportIndex;

