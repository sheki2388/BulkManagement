import { useState } from "react";
import { OfferCreationForm } from "@/components/OfferCreationForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const countryOptions = ["DE", "ES", "IE", "IT", "PT", "RO", "GB", "CZ", "GR"];

const Index = () => {
  const [country, setCountry] = useState<string>("");
  return (
    <div className="space-y-6">
  <OfferCreationForm mode="create" />
    </div>
  );
};

export default Index;
