import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Save, Edit, Trash2, Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Offer } from "./offer/types";
import { OfferCard } from "./offer/OfferCard";

const sampleOffers: Offer[] = [
  {
    id: `offer-1`,
    name: 'Super Promo Offer',
    description: 'Get 20% off on all products for a limited time.',
    type: 'PROMO',
    productId: 'PROD-12345',
    eipProductId: 'EIP-67890',
    status: 'Active',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2025-09-30'),
    testingStartDate: new Date('2025-08-25'),
    rules: [
      {
        id: 'rule-1',
        type: 'device_type',
        config: { deviceTypes: { MO: true, SW: false, TA: true } }
      },
      {
        id: 'rule-2',
        type: 'price_range',
        config: { priceMin: 100, priceMax: 500 }
      },
      {
        id: 'rule-3',
        type: 'loyalty_points',
        config: { minPoints: 50, maxPoints: 200 }
      }
    ],
    priceConfiguration: {
      erPricepoint: 'ER-2025',
      endDateKnown: true,
      duration: 'month',
      durationValue: 1,
      promoType: 'Seasonal',
      description: 'September promo pricing',
      priceModifier: {
        type: 'percentage',
        value: 20,
        start: 100,
        end: 500,
        amount: 80
      }
    },
    pricingFrames: [
      {
        erPricepoint: 'ER-2025-A',
        endDateKnown: false,
        duration: 'week',
        durationValue: 2,
        promoType: 'Flash',
        description: 'Flash sale pricing',
        priceModifier: {
          type: 'fixed',
          value: 50,
          start: 0,
          end: 100,
          amount: 50
        }
      }
    ],
    isSelected: false,
    update_status: "success"
  },
  {
    id: `offer-2`,
    name: 'Base Product Offer',
    description: 'Base offer for new product launch.',
    type: 'BASE',
    productId: 'PROD-54321',
    eipProductId: 'EIP-09876',
    status: 'Draft',
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-10-31'),
    testingStartDate: new Date('2025-09-25'),
    rules: [
      {
        id: 'rule-4',
        type: 'manufacture_name',
        config: { manufactureNames: ['BrandX', 'BrandY'] }
      },
      {
        id: 'rule-5',
        type: 'flow',
        config: { flowTypes: { OTT: true, STANDALONE: false, API: true, MVA: false } }
      }
    ],
    priceConfiguration: {
      erPricepoint: 'ER-BASE',
      endDateKnown: true,
      duration: 'year',
      durationValue: 1,
      promoType: 'Launch',
      description: 'Base product pricing',
      priceModifier: {
        type: 'fixed',
        value: 100,
        start: 0,
        end: 1000,
        amount: 100
      }
    },
    pricingFrames: [
      {
        erPricepoint: 'ER-BASE-A',
        endDateKnown: true,
        duration: 'month',
        durationValue: 6,
        promoType: 'Intro',
        description: 'Introductory pricing',
        priceModifier: {
          type: 'points',
          value: 500,
          start: 0,
          end: 500,
          amount: 500
        }
      }
    ],
    isSelected: false,
    update_status: "draft"
  },
  {
    id: `offer-3`,
    name: 'Voucher Special',
    description: 'Voucher offer for loyal customers.',
    type: 'VOUCHER',
    productId: 'PROD-22222',
    eipProductId: 'EIP-33333',
    status: 'Live',
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-15'),
    testingStartDate: new Date('2025-10-20'),
    rules: [
      {
        id: 'rule-6',
        type: 'store_id',
        config: { storeIds: 'STORE-001' }
      }
    ],
    priceConfiguration: {
      erPricepoint: 'ER-VOUCHER',
      endDateKnown: false,
      duration: 'day',
      durationValue: 7,
      promoType: 'Loyalty',
      description: 'Voucher pricing',
      priceModifier: {
        type: 'points',
        value: 200,
        start: 0,
        end: 200,
        amount: 200
      }
    },
    pricingFrames: [],
    isSelected: false,
    update_status: "live"
  }
];

const createEmptyOffer = (): Offer => {
  // Return a random sample offer for demonstration
  const idx = Math.floor(Math.random() * sampleOffers.length);
  // Deep clone to avoid state mutation
  return JSON.parse(JSON.stringify(sampleOffers[idx]));
};

export function OfferCreationForm({ initialOffers, mode, statusFilter, setStatusFilter, disabled = false }: { initialOffers?: Offer[], mode?: 'create' | 'export' | 'import', statusFilter?: string | null, setStatusFilter?: (value: string | null) => void, disabled?: boolean }) {
  // State and handlers
  const isCreate = mode === 'create';
  const loadOffers = () => {
    if (isCreate) {
      const data = sessionStorage.getItem('offers');
      if (data) return JSON.parse(data);
    }
    return initialOffers && initialOffers.length > 0 ? initialOffers : [createEmptyOffer()];
  };
  const [offers, setOffers] = useState<Offer[]>(loadOffers());
  useEffect(() => {
    if (isCreate) {
      sessionStorage.setItem('offers', JSON.stringify(offers));
    }
  }, [offers, isCreate]);
  const [showSummary, setShowSummary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'PROMO' | 'BASE' | 'VOUCHER' | 'PRODUCT'>('all');
  const [country, setCountry] = useState<string>('');
  const isCountrySelected = !!country;
  const { toast } = useToast();
  const selectedOffers = offers.filter(offer => offer.isSelected);
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.productId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || offer.type === filterType;
    const matchesStatus = mode === 'export' && statusFilter ? offer.status === statusFilter : true;
    return matchesSearch && matchesType && matchesStatus;
  });
  const addOffer = () => {
    const newOffer = createEmptyOffer();
    setOffers(prev => [...prev, newOffer]);
    toast({
      title: "Offer Added",
      description: "A new offer has been added to your list.",
    });
  };
  const updateOffer = (updated: Offer) => {
    setOffers(prev => prev.map(o => o.id === updated.id ? updated : o));
  };
  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    toast({
      title: "Offer Deleted",
      description: "Offer has been removed.",
    });
  };
  const selectOffer = (id: string, selected: boolean) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, isSelected: selected } : o));
  };
  const selectAllOffers = (checked: boolean) => {
    setOffers(prev => prev.map(o => ({ ...o, isSelected: checked })));
  };
  const exportOffers = () => {
    const data = selectedOffers.length === 0 ? offers : selectedOffers;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'offers-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: `${data.length} offers exported.`,
    });
  };

  const copyOffer = (originalOffer: Offer) => {
    const copiedOffer: Offer = {
      ...originalOffer,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${originalOffer.name} (Copy)`,
      isSelected: false
    };
    setOffers(prev => [...prev, copiedOffer]);
    toast({
      title: "Offer Copied",
      description: "A copy of the offer has been added.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {mode === 'import'
                  ? 'Bulk Offer Import'
                  : mode === 'export'
                    ? 'Bulk Offer Export'
                    : 'Bulk Offer Create'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {mode === 'import'
                  ? 'Import offers from backend and review imported data.'
                  : mode === 'export'
                    ? 'Export multiple offers and manage your bulk export data.'
                    : 'Create and manage multiple promotional offers efficiently'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Create button logic for create page */}
              {mode === 'create' && (
                <>
                  <Button
                    className="bg-success hover:bg-success/80"
                    disabled={disabled || !isCountrySelected || selectedOffers.length === 0}
                    onClick={() => {
                      // Simulate create logic and show summary
                      setShowSummary(true);
                      toast({
                        title: selectedOffers.length === offers.length ? "All Offers Created" : "Selected Offers Created",
                        description: selectedOffers.length === offers.length
                          ? `${offers.length} offers created.`
                          : `${selectedOffers.length} selected offer(s) created.`
                      });
                    }}
                  >
                    {selectedOffers.length === 0
                      ? 'Create'
                      : selectedOffers.length === offers.length
                        ? 'Create All'
                        : 'Create Selected'}
                  </Button>
                  <Button onClick={addOffer} className="bg-primary hover:bg-primary-hover" disabled={disabled || !isCountrySelected}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Offer
                  </Button>
                </>
              )}
              {(mode === 'export' || mode === 'import') && (
                <>
                  {mode === 'import' ? (
                    <>
                      <input
                        type="file"
                        accept="application/json"
                        style={{ display: 'none' }}
                        id="import-offer-file"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const json = JSON.parse(event.target?.result as string);
                              if (Array.isArray(json)) {
                                setOffers(json);
                                toast({
                                  title: "Import Successful",
                                  description: `${json.length} offers loaded from file.`
                                });
                              } else {
                                toast({
                                  title: "Import Failed",
                                  description: "File does not contain a valid array of offers.",
                                  variant: "destructive"
                                });
                              }
                            } catch {
                              toast({
                                title: "Import Failed",
                                description: "Could not parse JSON file.",
                                variant: "destructive"
                              });
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                      <Button
                        className="bg-primary hover:bg-primary-hover"
                        onClick={() => document.getElementById('import-offer-file')?.click()}
                      >
                        Import Offer
                      </Button>
                    </>
                  ) : (
                    <Button onClick={exportOffers} className="bg-primary hover:bg-primary-hover">
                      {selectedOffers.length === 0
                        ? 'Export All'
                        : selectedOffers.length === offers.length
                          ? 'Export All'
                          : 'Export Selected'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {/* Country Selector */}
              <Select value={country} onValueChange={setCountry} disabled={disabled}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="IT">Italy</SelectItem>
                  <SelectItem value="ES">Spain</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                </SelectContent>
              </Select>
              {/* Search Offers */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  disabled={disabled || !isCountrySelected}
                />
              </div>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)} disabled={disabled || !isCountrySelected}>
                <SelectTrigger className="w-32">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PROMO">PROMO</SelectItem>
                  <SelectItem value="BASE">BASE</SelectItem>
                  <SelectItem value="VOUCHER">VOUCHER</SelectItem>
                  <SelectItem value="PRODUCT">PRODUCT</SelectItem>
                </SelectContent>
              </Select>
              {mode === 'export' && setStatusFilter && (
                <Select value={statusFilter ?? undefined} onValueChange={value => setStatusFilter(value === 'all' ? null : value)} disabled={disabled || !isCountrySelected}>
                  <SelectTrigger className="w-32">
                    <Badge className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center gap-2 w-full">
                <Checkbox
                  checked={offers.length > 0 && selectedOffers.length === offers.length}
                  onCheckedChange={selectAllOffers}
                  disabled={disabled || !isCountrySelected}
                />
                <Label className="text-sm">
                  Select All ({selectedOffers.length}/{offers.length})
                </Label>
                <div className="flex-1" />
                {/* Clone and Delete Selected buttons (only on create page, if any selected) */}
                {mode === 'create' && selectedOffers.length > 0 && (
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Clone all selected offers
                        const clones = selectedOffers.map(offer => ({
                          ...offer,
                          id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                          name: `${offer.name} (Clone)`,
                          isSelected: false
                        }));
                        setOffers(prev => [...prev, ...clones]);
                        toast({
                          title: "Offers Cloned",
                          description: `${clones.length} offer(s) cloned.`,
                        });
                      }}
                      disabled={disabled || !isCountrySelected}
                    >
                      Clone Selected
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setOffers(prev => prev.filter(o => !o.isSelected));
                        toast({
                          title: "Offers Deleted",
                          description: `${selectedOffers.length} offer(s) deleted.`,
                        });
                      }}
                      disabled={disabled || !isCountrySelected}
                    >
                      Delete Selected
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Cards */}
      <div className="container mx-auto px-6 py-6">
        <div className="space-y-4">
          {(!isCountrySelected || filteredOffers.length === 0) ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {!isCountrySelected ? 'Please select a country to continue' : 'No offers found'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {!isCountrySelected
                      ? 'All actions are disabled until a country is selected.'
                      : (searchTerm || filterType !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Create your first offer to get started.')}
                  </p>
                  {!isCountrySelected ? null : (!searchTerm && filterType === 'all' && (
                    <Button onClick={addOffer} disabled={disabled || !isCountrySelected}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Offer
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onOfferChange={updateOffer}
                  onCopy={copyOffer}
                  onDelete={deleteOffer}
                  onSelect={selectOffer}
                  disabled={disabled || !isCountrySelected}
                />
              ))}
            </>
          )}
        </div>
        {showSummary && offers.length > 0 && (
          <div className="container mx-auto px-0 mt-2">
            <Card className="w-full rounded bg-card shadow-lg flex flex-col justify-center">
              <CardContent className="py-0 flex items-center justify-center h-full min-h-[40px]">
                <div className="flex flex-wrap gap-2 items-center justify-between w-full">
                  {['PROMO', 'BASE', 'VOUCHER', 'PRODUCT'].map(type => {
                    const filtered = offers.filter(o => o.type === type);
                    const successCount = filtered.filter(o => o.update_status === 'success').length;
                    const failCount = filtered.filter(o => o.update_status === 'fail').length;
                    return (
                      <span key={type} className="flex gap-1 items-center">
                        <span className="font-semibold text-muted-foreground">{type}:</span>
                        <span className="text-success">{successCount}✔</span>
                        <span className="text-destructive">{failCount}✖</span>
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
