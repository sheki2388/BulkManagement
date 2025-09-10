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

const createEmptyOffer = (): Offer => ({
  id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  description: '',
  type: 'PROMO',
  productId: '',
  eipProductId: '',
  rules: [],
  priceConfiguration: {
    erPricepoint: '',
    endDateKnown: true,
    duration: 'month',
    promoType: '',
    description: '',
    priceModifier: {
      type: 'percentage',
      value: 0,
      start: 0,
      end: 0,
      amount: 0
    }
  },
  isSelected: false,
  update_status: ""
});

export function OfferCreationForm({ initialOffers, mode, statusFilter, setStatusFilter }: { initialOffers?: Offer[], mode?: 'create' | 'export' | 'import', statusFilter?: string | null, setStatusFilter?: (value: string | null) => void }) {
  // Session storage persistence for create page
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
      description: `"${originalOffer.name}" has been copied successfully.`,
    });
  };

  const deleteOffer = (offerId: string) => {
    if (offers.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one offer.",
        variant: "destructive"
      });
      return;
    }
    
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
    toast({
      title: "Offer Deleted",
      description: "The offer has been removed from your list.",
    });
  };

  const updateOffer = (updatedOffer: Offer) => {
    setOffers(prev => prev.map(offer => 
      offer.id === updatedOffer.id ? updatedOffer : offer
    ));
  };

  const selectOffer = (offerId: string, selected: boolean) => {
    setOffers(prev => prev.map(offer =>
      offer.id === offerId ? { ...offer, isSelected: selected } : offer
    ));
  };

  const selectAllOffers = (selected: boolean) => {
    setOffers(prev => prev.map(offer => ({ ...offer, isSelected: selected })));
  };

  const bulkDelete = () => {
    if (selectedOffers.length === offers.length) {
      toast({
        title: "Cannot Delete All",
        description: "You must have at least one offer.",
        variant: "destructive"
      });
      return;
    }
    
    setOffers(prev => prev.filter(offer => !offer.isSelected));
    toast({
      title: "Offers Deleted",
      description: `${selectedOffers.length} offer(s) have been deleted.`,
    });
  };

  const bulkCopy = () => {
    const newOffers = selectedOffers.map(offer => ({
      ...offer,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${offer.name} (Copy)`,
      isSelected: false
    }));
    setOffers(prev => [...prev, ...newOffers]);
    toast({
      title: "Offers Copied",
      description: `${selectedOffers.length} offer(s) have been copied.`,
    });
  };

  const saveAllOffers = () => {
    // Here you would typically send the offers to your backend
    console.log('Saving offers:', offers);
    toast({
      title: "Offers Saved",
      description: `${offers.length} offer(s) have been saved successfully.`,
    });
    setShowSummary(true);
  };

  const exportOffers = () => {
    const dataStr = JSON.stringify(offers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'offers-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: "Offers have been exported successfully.",
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
              {mode === 'create' && (
                <Button onClick={addOffer} className="bg-primary hover:bg-primary-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Offer
                </Button>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              

              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
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
                <Select value={statusFilter ?? undefined} onValueChange={value => setStatusFilter(value === 'all' ? null : value)}>
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

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={offers.length > 0 && selectedOffers.length === offers.length}
                  onCheckedChange={selectAllOffers}
                />
                <Label className="text-sm">
                  Select All ({selectedOffers.length}/{offers.length})
                </Label>
              </div>
            </div>

            {/* Removed Clone Selected and Delete Selected buttons for export page */}
          </div>
        </div>
      </div>

      {/* Offer Cards */}
      <div className="container mx-auto px-6 py-6">
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No offers found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Create your first offer to get started.'}
                  </p>
                  {!searchTerm && filterType === 'all' && (
                    <Button onClick={addOffer}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Offer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onOfferChange={updateOffer}
                onCopy={copyOffer}
                onDelete={deleteOffer}
                onSelect={selectOffer}
              />
            ))
          )}
        </div>


{showSummary && offers.length > 0 && (
  <Card className="mt-6 bg-muted/30">
<CardHeader>
  <div className="flex justify-between items-center w-full">
    <span className="text-base font-medium text-muted-foreground">Summary</span>
    <span className="text-sm text-muted-foreground">
      Total Offers: <span className="text-xl font-bold">{offers.length}</span>
    </span>
  </div>
</CardHeader>


  
    <CardContent>
      <div className="grid grid-cols-3 gap-5 text-sm">
        {['PROMO', 'BASE', 'VOUCHER'].map(type => {
          const filtered = offers.filter(o => o.type === type);
          const successCount = filtered.filter(o => o.update_status === 'success').length;
          const failCount = filtered.filter(o => o.update_status === 'fail').length;
          return (
            <div key={type}>
              <div className="font-medium text-muted-foreground justify-between items-center">{type}</div>
              <div className="text-sm">
                <div className="text-success font-bold">✔ Applied: {successCount}</div>
                <div className="text-destructive font-bold">✖ Skipped: {failCount}</div>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
)}


      </div>
    </div>
  );
}