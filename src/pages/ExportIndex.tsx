import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { OfferCreationForm } from "@/components/OfferCreationForm";
import { Offer } from "@/components/offer/types";


// Use the same mock logic as import page for consistency
import { generateMockOffers } from "./ImportIndex";
const TOTAL_OFFERS = 53;




import { useState } from "react";

const statusOptions = ["Draft", "Inactive", "Active", "Live", "Reviewed"];


const ExportIndex = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const allOffers = generateMockOffers(0, TOTAL_OFFERS);
  const filteredOffers = statusFilter ? allOffers.filter(o => o.status === statusFilter) : allOffers;
  const totalPages = Math.ceil(filteredOffers.length / pageSize);
  const paginatedOffers = filteredOffers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <OfferCreationForm
        initialOffers={paginatedOffers}
        mode="export"
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ExportIndex;

