import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VodafoneLogo } from "./VodafoneLogo";
import { OfferCreationForm } from "./OfferCreationForm";

export default function NestedTabsDemo() {
  const [mainTab, setMainTab] = useState("offers");
  const [offerTab, setOfferTab] = useState("search");
  const [bulkTab, setBulkTab] = useState("create");
  return (
    <div className="max-w-3xl mx-auto px-2 py-4">
      <div className="flex items-center gap-3 mb-4">
        <VodafoneLogo className="h-8 w-8" />
        <h1 className="text-2xl font-bold text-[#e60000]">VF Demo: Nested Tabs</h1>
      </div>
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="mb-2 bg-gray-100 rounded p-0.5 flex gap-1 border border-gray-200">
          <TabsTrigger value="offers" className="rounded px-3 py-1 text-sm font-semibold data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Offers</TabsTrigger>
          <TabsTrigger value="product" className="rounded px-3 py-1 text-sm font-semibold data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Product</TabsTrigger>
        </TabsList>
        <TabsContent value="offers">
          <Tabs value={offerTab} onValueChange={setOfferTab} className="w-full">
            <TabsList className="mb-2 bg-gray-50 rounded p-0.5 flex gap-1 border border-gray-200">
              <TabsTrigger value="search" className="rounded px-3 py-1 text-sm font-medium data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Search</TabsTrigger>
              <TabsTrigger value="create" className="rounded px-3 py-1 text-sm font-medium data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Create</TabsTrigger>
              <TabsTrigger value="bulk" className="rounded px-3 py-1 text-sm font-medium data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Bulk</TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <div className="p-3 text-sm text-gray-700">Search Offer UI goes here</div>
            </TabsContent>
            <TabsContent value="create">
              <div className="p-3 text-sm text-gray-700">Create Offer UI goes here</div>
            </TabsContent>
            <TabsContent value="bulk">
              <Tabs value={bulkTab} onValueChange={setBulkTab} className="w-full">
                <TabsList className="mb-2 bg-gray-100 rounded p-0.5 flex gap-1 border border-gray-200">
                  <TabsTrigger value="create" className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Create</TabsTrigger>
                  <TabsTrigger value="import" className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Import</TabsTrigger>
                  <TabsTrigger value="export" className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-[#e60000] data-[state=active]:text-white">Export</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                  <OfferCreationForm mode="create" />
                </TabsContent>
                <TabsContent value="import">
                  <OfferCreationForm mode="import" />
                </TabsContent>
                <TabsContent value="export">
                  <OfferCreationForm mode="export" />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="product">
          <div className="p-3 text-sm text-gray-700">Product UI goes here</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
