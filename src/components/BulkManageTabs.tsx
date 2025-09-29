import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OfferCreationForm } from "./OfferCreationForm";
import { VodafoneLogo } from "./VodafoneLogo";
import React, { useState } from "react";

export default function BulkManageTabs() {
  const [tab, setTab] = useState("create");
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="rounded-lg shadow-lg bg-white mb-8">
        <div className="bg-white rounded-t-lg px-8 py-6 flex items-center gap-4 border-b-4 border-[#e60000]">
          <VodafoneLogo className="h-12 w-12" />
          <h1 className="text-4xl font-extrabold tracking-tight text-[#e60000] drop-shadow-lg">Bulk Manage</h1>
        </div>
        <div className="px-8 pt-6 pb-2 bg-white rounded-b-lg">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6 bg-gray-100 rounded-full p-1 flex gap-2 shadow-sm">
              <TabsTrigger value="create" className="rounded-full px-6 py-2 text-base font-semibold data-[state=active]:bg-[#e60000] data-[state=active]:text-white data-[state=active]:shadow-md">Create</TabsTrigger>
              <TabsTrigger value="import" className="rounded-full px-6 py-2 text-base font-semibold data-[state=active]:bg-[#e60000] data-[state=active]:text-white data-[state=active]:shadow-md">Import</TabsTrigger>
              <TabsTrigger value="export" className="rounded-full px-6 py-2 text-base font-semibold data-[state=active]:bg-[#e60000] data-[state=active]:text-white data-[state=active]:shadow-md">Export</TabsTrigger>
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
        </div>
      </div>
    </div>
  );
}
