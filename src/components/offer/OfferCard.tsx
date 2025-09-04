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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Offer } from "./types";
import { RuleBuilder } from "./RuleBuilder";
import { Badge } from "@/components/ui/badge";

interface OfferCardProps {
  offer: Offer;
  onOfferChange: (offer: Offer) => void;
  onCopy: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
  onSelect: (offerId: string, selected: boolean) => void;
}

export function OfferCard({ offer, onOfferChange, onCopy, onDelete, onSelect }: OfferCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'rules' | 'pricing'>('basic');

  const updateOffer = (updates: Partial<Offer>) => {
    onOfferChange({ ...offer, ...updates });
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

  function saveAllOffers(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

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
            />
            <div className="flex items-center gap-2">
              <Badge variant={offer.type === 'PROMO' ? 'default' : 'secondary'}>
                {offer.type}
              </Badge>
              <CardTitle className="text-lg">{offer.name || 'Untitled Offer'}</CardTitle>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(offer)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Retry Save
            </Button>
            <Button variant="outline" size="sm" onClick={saveAllOffers}>
                <Save className="mr-2 h-4 w-4" />
                Save All
              </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(offer)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Clone
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(offer.id)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
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
            <span>Product ID: {offer.productId}</span>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`type-${offer.id}`}>Type</Label>
                  <Select
                    value={offer.type}
                    onValueChange={(value: 'PROMO' | 'BASE' | 'PROMO' | 'BASE') => updateOffer({ type: value })}
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
                  <Label htmlFor={`product-id-${offer.id}`}>Product ID</Label>
                  <Input
                    id={`product-id-${offer.id}`}
                    value={offer.productId}
                    onChange={(e) => updateOffer({ productId: e.target.value })}
                    placeholder="Enter product ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`eip-product-id-${offer.id}`}>EIP Product ID</Label>
                  <Input
                    id={`eip-product-id-${offer.id}`}
                    value={offer.eipProductId}
                    onChange={(e) => updateOffer({ eipProductId: e.target.value })}
                    placeholder="Enter EIP product ID"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <RuleBuilder
              rules={offer.rules}
              onRulesChange={(rules) => updateOffer({ rules })}
            />
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`er-pricepoint-${offer.id}`}>ER Pricepoint</Label>
                  <Input
                    id={`er-pricepoint-${offer.id}`}
                    value={offer.priceConfiguration.erPricepoint}
                    onChange={(e) => updatePriceConfig({ erPricepoint: e.target.value })}
                    placeholder="Long Pricepoint ID"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enddate known?</Label>
                  <Switch
                    checked={offer.priceConfiguration.endDateKnown}
                    onCheckedChange={(checked) => updatePriceConfig({ endDateKnown: checked })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select
                      value={offer.priceConfiguration.duration}
                      onValueChange={(value: any) => updatePriceConfig({ duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`promo-type-${offer.id}`}>Promo Type</Label>
                    <Input
                      id={`promo-type-${offer.id}`}
                      value={offer.priceConfiguration.promoType}
                      onChange={(e) => updatePriceConfig({ promoType: e.target.value })}
                      placeholder="Enter promo type"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`price-description-${offer.id}`}>Description</Label>
                  <Input
                    id={`price-description-${offer.id}`}
                    value={offer.priceConfiguration.description}
                    onChange={(e) => updatePriceConfig({ description: e.target.value })}
                    placeholder="Promo Description"
                  />
                </div>

                {/* Price Modifier Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Price Modifier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={offer.priceConfiguration.priceModifier.type}
                          onValueChange={(value: any) => updatePriceConfig({
                            priceModifier: { ...offer.priceConfiguration.priceModifier, type: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage Discount</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="points">Points</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={offer.priceConfiguration.priceModifier.value}
                          onChange={(e) => updatePriceConfig({
                            priceModifier: { 
                              ...offer.priceConfiguration.priceModifier, 
                              value: parseFloat(e.target.value) || 0 
                            }
                          })}
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Start</Label>
                        <Input
                          type="number"
                          value={offer.priceConfiguration.priceModifier.start}
                          onChange={(e) => updatePriceConfig({
                            priceModifier: { 
                              ...offer.priceConfiguration.priceModifier, 
                              start: parseFloat(e.target.value) || 0 
                            }
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End</Label>
                        <Input
                          type="number"
                          value={offer.priceConfiguration.priceModifier.end}
                          onChange={(e) => updatePriceConfig({
                            priceModifier: { 
                              ...offer.priceConfiguration.priceModifier, 
                              end: parseFloat(e.target.value) || 0 
                            }
                          })}
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={offer.priceConfiguration.priceModifier.amount}
                          onChange={(e) => updatePriceConfig({
                            priceModifier: { 
                              ...offer.priceConfiguration.priceModifier, 
                              amount: parseFloat(e.target.value) || 0 
                            }
                          })}
                          placeholder="5"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}