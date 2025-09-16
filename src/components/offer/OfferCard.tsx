import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp, Copy, Trash2, Settings, Save } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Offer } from "./types";
import { PricingFrame } from "./PricingFrame";
import { RuleBuilder } from "./RuleBuilder";
import { Badge } from "@/components/ui/badge";

interface OfferCardProps {
  offer: Offer;
  onOfferChange: (offer: Offer) => void;
  onCopy: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
  onSelect: (offerId: string, selected: boolean) => void;
  disabled?: boolean;
}

export function OfferCard({ offer, onOfferChange, onCopy, onDelete, onSelect, disabled = false }: OfferCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'rules' | 'pricing'>('basic');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'failed' | 'success'>('idle');

  // Helper to get default rules for each type
  const getDefaultRules = (type: Offer['type']): Offer['rules'] => {
    if (type === 'PROMO' || type === 'BASE') {
      return [
        {
          id: `rule-price-range-${offer.id}`,
          type: 'price_range',
          config: { priceMin: 0, priceMax: 1000 }
        },
        {
          id: `rule-manufacture-name-${offer.id}`,
          type: 'manufacture_name',
          config: { manufactureNames: [] }
        },
        {
          id: `rule-store-id-${offer.id}`,
          type: 'store_id',
          config: { storeIds: '' }
        },
        {
          id: `rule-flow-${offer.id}`,
          type: 'flow',
          config: { flowTypes: { OTT: false, STANDALONE: false, API: false, MVA: false } }
        }
      ];
    } else if (type === 'VOUCHER') {
      return [
        {
          id: `rule-voucher-code-${offer.id}`,
          type: 'store_id',
          config: { storeIds: '' }
        }
      ];
    }
    return [];
  };

  // Ensure default rules on create page
  React.useEffect(() => {
    if (window.location.pathname.includes('/bulk/create')) {
      if (!offer.rules || offer.rules.length === 0) {
        updateOffer({ rules: getDefaultRules(offer.type) });
      }
    }
  }, []);

  // Update rules when type changes on create page
  const updateOffer = (updates: Partial<Offer>) => {
    if (window.location.pathname.includes('/bulk/create') && updates.type && updates.type !== offer.type) {
      onOfferChange({ ...offer, ...updates, rules: getDefaultRules(updates.type as Offer['type']) });
    } else {
      onOfferChange({ ...offer, ...updates });
    }
  };

  const updatePriceConfig = (updates: Partial<Offer['priceConfiguration']>) => {
    onOfferChange({
      ...offer,
      priceConfiguration: { ...offer.priceConfiguration, ...updates }
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'rules', label: `Rules (${offer.rules.length})` },
    { id: 'pricing', label: 'Pricing' }
  ];

  // Simulate save logic
  function handleSave() {
    // Simulate save success/failure randomly for demo
    const success = Math.random() > 0.3;
    setSaveStatus(success ? 'success' : 'failed');
    // You can replace with real save logic
  }

  // Pricing frame logic
  const pricingFrames = offer.priceConfiguration.endDateKnown
    ? offer.pricingFrames || [offer.priceConfiguration]
    : [offer.priceConfiguration];

  // State for each frame
  const [frameStates, setFrameStates] = useState(pricingFrames.map(() => ({ isSaved: false, isEditing: false })));

  const setIsSaved = (idx: number, value: boolean) => {
    setFrameStates(states => states.map((s, i) => i === idx ? { ...s, isSaved: value } : s));
  };
  const setIsEditing = (idx: number, value: boolean) => {
    setFrameStates(states => states.map((s, i) => i === idx ? { ...s, isEditing: value } : s));
  };

  const handleAddFrame = () => {
    if (!offer.priceConfiguration.endDateKnown) return;
    const newFrame = { ...offer.priceConfiguration, durationValue: 1 };
    const updatedFrames = [...(offer.pricingFrames || [offer.priceConfiguration]), newFrame];
    onOfferChange({
      ...offer,
      pricingFrames: updatedFrames
    });
  };

  const handleDeleteFrame = (idx: number) => {
    if (pricingFrames.length <= 1) return;
    const updatedFrames = pricingFrames.filter((_, i) => i !== idx);
    onOfferChange({
      ...offer,
      pricingFrames: updatedFrames
    });
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      offer.isSelected && "ring-2 ring-primary",
      isExpanded && "shadow-lg"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={offer.isSelected}
              onCheckedChange={(checked) => onSelect(offer.id, !!checked)}
              disabled={disabled}
            />
            <div className="flex items-center gap-2">
              {typeof window !== 'undefined' && window.location.pathname.includes('/bulk/create') ? (
                <Select value={offer.type} onValueChange={type => {
                  // Adjust fields based on type
                  let updates: Partial<Offer> = { type: type as Offer['type'] };
                  if (type === 'PROMO') {
                    updates.priceConfiguration = {
                      ...offer.priceConfiguration,
                      promoType: 'Discount',
                      priceModifier: { ...offer.priceConfiguration.priceModifier, type: 'percentage' }
                    };
                  } else if (type === 'BASE') {
                    updates.priceConfiguration = {
                      ...offer.priceConfiguration,
                      promoType: '',
                      priceModifier: { ...offer.priceConfiguration.priceModifier, type: 'fixed' }
                    };
                  } else if (type === 'VOUCHER') {
                    updates.priceConfiguration = {
                      ...offer.priceConfiguration,
                      promoType: 'Voucher',
                      priceModifier: { ...offer.priceConfiguration.priceModifier, type: 'fixed' }
                    };
                  } else if (type === 'PRODUCT') {
                    updates.priceConfiguration = {
                      ...offer.priceConfiguration,
                      promoType: '',
                      priceModifier: { ...offer.priceConfiguration.priceModifier, type: 'fixed' }
                    };
                  }
                  updateOffer(updates);
                }}>
                  <SelectTrigger className="w-20 bg-red-500 text-white rounded-full px-2 py-0.5 border-none shadow-none focus:ring-0 text-xs min-h-0 h-6">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROMO">PROMO</SelectItem>
                    <SelectItem value="BASE">BASE</SelectItem>
                    <SelectItem value="VOUCHER">VOUCHER</SelectItem>
                    <SelectItem value="PRODUCT">PRODUCT</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className="bg-red-500 text-white">{offer.type}</Badge>
              )}
              {offer.status && (
                <Badge
                  className={
                    offer.status === 'Active' ? 'bg-green-500 text-white' :
                    offer.status === 'Inactive' ? 'bg-gray-400 text-white' :
                    offer.status === 'Draft' ? 'bg-yellow-400 text-black' :
                    offer.status === 'Live' ? 'bg-blue-500 text-white' :
                    offer.status === 'Reviewed' ? 'bg-purple-500 text-white' :
                    'bg-muted text-foreground'
                  }
                >
                  {offer.status}
                </Badge>
              )}
              <CardTitle className="text-lg">{offer.name || 'Untitled Offer'}</CardTitle>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!(typeof window !== 'undefined' && window.location.pathname.includes('/bulk/export')) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className={saveStatus === 'failed' ? 'border-red-500 text-red-500' : ''}
                  disabled={disabled}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saveStatus === 'failed' ? 'Retry Save' : 'Save'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(offer)}
                  className="gap-2"
                  disabled={disabled}
                >
                  <Copy className="h-4 w-4" />
                  Clone
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(offer.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
              disabled={disabled}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
        
        {!isExpanded && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span>Offer ID: {offer.productId}</span>
            <span>Rules: {offer.rules.length}</span>
            {offer.startDate && (
              <span>Starts: {format(offer.startDate, "MMM dd, yyyy")}</span>
            )}
            {offer.endDate && (
              <span>Ends: {format(offer.endDate, "MMM dd, yyyy")}</span>
            )}
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${offer.id}`}>Name</Label>
                  <Input
                    id={`name-${offer.id}`}
                    value={offer.name}
                    onChange={(e) => updateOffer({ name: e.target.value })}
                    placeholder="Enter offer name"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`type-${offer.id}`}>Type</Label>
                  <Select
                    value={offer.type}
                    onValueChange={(value: 'PROMO' | 'BASE' | 'PROMO' | 'BASE') => updateOffer({ type: value })}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROMO">PROMO</SelectItem>
                      <SelectItem value="BASE">BASE</SelectItem>
                      <SelectItem value="VOUCHER">VOUCHER</SelectItem>
                      <SelectItem value="PRODUCT">PRODUCT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${offer.id}`}>Description</Label>
                <Textarea
                  id={`description-${offer.id}`}
                  value={offer.description}
                  onChange={(e) => updateOffer({ description: e.target.value })}
                  placeholder="Enter offer description"
                  rows={3}
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !offer.startDate && "text-muted-foreground"
                        )}
                        disabled={disabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {offer.startDate ? format(offer.startDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={offer.startDate}
                        onSelect={(date) => updateOffer({ startDate: date })}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !offer.endDate && "text-muted-foreground"
                        )}
                        disabled={disabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {offer.endDate ? format(offer.endDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={offer.endDate}
                        onSelect={(date) => updateOffer({ endDate: date })}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Testing Start</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !offer.testingStartDate && "text-muted-foreground"
                        )}
                        disabled={disabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {offer.testingStartDate ? format(offer.testingStartDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={offer.testingStartDate}
                        onSelect={(date) => updateOffer({ testingStartDate: date })}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`product-id-${offer.id}`}>Offer ID</Label>
                  <Input
                    id={`product-id-${offer.id}`}
                    value={offer.productId}
                    onChange={(e) => updateOffer({ productId: e.target.value })}
                    placeholder="Enter offer ID"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`eip-product-id-${offer.id}`}>EIP Product ID</Label>
                  <Input
                    id={`eip-product-id-${offer.id}`}
                    value={offer.eipProductId}
                    onChange={(e) => updateOffer({ eipProductId: e.target.value })}
                    placeholder="Enter EIP product ID"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <RuleBuilder
              rules={offer.rules}
              onRulesChange={(rules) => updateOffer({ rules })}
              disabled={disabled}
            />
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`er-pricepoint-${offer.id}`}>ER Pricepoint <span className="text-red-500">*</span></Label>
                  <Input
                    id={`er-pricepoint-${offer.id}`}
                    value={offer.priceConfiguration.erPricepoint}
                    onChange={(e) => updatePriceConfig({ erPricepoint: e.target.value })}
                    placeholder="Long Pricepoint ID"
                    required
                  />
                </div>
                {/* Pricing frames logic */}
                {pricingFrames.map((frame, idx) => (
                  <PricingFrame
                    key={idx}
                    offer={{ ...offer, priceConfiguration: frame }}
                    updatePriceConfig={(updates) => {
                      const updatedFrames = pricingFrames.map((f, i) =>
                        i === idx ? { ...f, ...updates } : f
                      );
                      onOfferChange({ ...offer, pricingFrames: updatedFrames });
                    }}
                    onAddFrame={handleAddFrame}
                    onDeleteFrame={pricingFrames.length > 1 ? () => handleDeleteFrame(idx) : undefined}
                    frameCount={pricingFrames.length}
                    isSaved={frameStates[idx]?.isSaved ?? false}
                    setIsSaved={(v) => setIsSaved(idx, v)}
                    isEditing={frameStates[idx]?.isEditing ?? false}
                    setIsEditing={(v) => setIsEditing(idx, v)}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}