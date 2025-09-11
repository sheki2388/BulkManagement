import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Offer } from "./types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PricingFrameProps {
  offer: Offer;
  updatePriceConfig: (updates: Partial<Offer["priceConfiguration"]>) => void;
  onAddFrame?: () => void;
  onDeleteFrame?: () => void;
  frameCount?: number;
  disabled?: boolean;
}

export function PricingFrame({ offer, updatePriceConfig, onAddFrame, onDeleteFrame, frameCount, isSaved, setIsSaved, isEditing, setIsEditing, disabled = false }: PricingFrameProps & { onAddFrame?: () => void; onDeleteFrame?: () => void; frameCount?: number; isSaved: boolean; setIsSaved: (v: boolean) => void; isEditing: boolean; setIsEditing: (v: boolean) => void; disabled?: boolean; }) {
  const canAddFrame = offer.priceConfiguration.endDateKnown;
  const canDeleteFrame = (frameCount ?? 1) > 1;
  const onlyOneCard = (frameCount ?? 1) === 1;

  // Button logic
  let buttons = [];
  if (!canAddFrame) {
    // Date unknown
    if (!isSaved && onlyOneCard && !isEditing) {
      buttons.push(<Button key="add" size="sm" variant="outline" onClick={() => { setIsSaved(true); setIsEditing(false); }} disabled={disabled}>Add</Button>);
    } else if (isSaved && onlyOneCard && !isEditing) {
      buttons.push(<Button key="edit" size="sm" variant="outline" onClick={() => { setIsEditing(true); setIsSaved(false); }} disabled={disabled}>Edit</Button>);
    } else if (isEditing && onlyOneCard) {
      buttons.push(<Button key="save" size="sm" variant="default" onClick={() => { setIsSaved(true); setIsEditing(false); }} disabled={disabled}>Save</Button>);
    }
  } else {
    // Date known
    if (!isSaved && onlyOneCard && !isEditing) {
      buttons.push(<Button key="add" size="sm" variant="outline" onClick={() => { setIsSaved(true); setIsEditing(false); if (onAddFrame) onAddFrame(); }} disabled={disabled}>Add</Button>);
    } else if (isSaved && onlyOneCard && !isEditing) {
      buttons.push(<Button key="edit" size="sm" variant="outline" onClick={() => { setIsEditing(true); setIsSaved(false); }} disabled={disabled}>Edit</Button>);
    } else if (isEditing && onlyOneCard) {
      buttons.push(<Button key="save" size="sm" variant="default" onClick={() => { setIsSaved(true); setIsEditing(false); }} disabled={disabled}>Save</Button>);
    } else if (!isSaved && !onlyOneCard && !isEditing) {
      buttons.push(<Button key="add" size="sm" variant="outline" onClick={() => { setIsSaved(true); setIsEditing(false); if (onAddFrame) onAddFrame(); }} disabled={disabled}>Add</Button>);
      buttons.push(<Button key="delete" size="sm" variant="destructive" onClick={onDeleteFrame} disabled={disabled}>Delete</Button>);
    } else if (isSaved && !onlyOneCard && !isEditing) {
      buttons.push(<Button key="edit" size="sm" variant="outline" onClick={() => { setIsEditing(true); setIsSaved(false); }} disabled={disabled}>Edit</Button>);
      buttons.push(<Button key="delete" size="sm" variant="destructive" onClick={onDeleteFrame} disabled={disabled}>Delete</Button>);
    } else if (isEditing && !onlyOneCard) {
      buttons.push(<Button key="save" size="sm" variant="default" onClick={() => { setIsSaved(true); setIsEditing(false); }} disabled={disabled}>Save</Button>);
      buttons.push(<Button key="delete" size="sm" variant="destructive" onClick={onDeleteFrame} disabled={disabled}>Delete</Button>);
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base cursor-pointer flex items-center">
            <span>Pricing Summary: {offer.priceConfiguration.erPricepoint}
              {" | "}{offer.priceConfiguration.duration}
              {" | "}{offer.priceConfiguration.priceModifier.type}
              {" | Amount: "}{offer.priceConfiguration.priceModifier.amount}
              {offer.priceConfiguration.description ? ` | ${offer.priceConfiguration.description}` : ""}
            </span>
          </CardTitle>
          <div className="flex gap-2">{buttons}</div>
        </div>
      </CardHeader>
      {(!isSaved || isEditing) && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enddate known?</Label>
            <Switch
              checked={offer.priceConfiguration.endDateKnown}
              onCheckedChange={(checked) => updatePriceConfig({ endDateKnown: checked })}
              disabled={isSaved || disabled}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select
                value={offer.priceConfiguration.duration}
                onValueChange={(value: any) => updatePriceConfig({ duration: value })}
                disabled={isSaved || disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                {offer.priceConfiguration.duration === 'year' ? 'Number of years' :
                  offer.priceConfiguration.duration === 'month' ? 'Number of months' :
                  offer.priceConfiguration.duration === 'week' ? 'Number of weeks' :
                  offer.priceConfiguration.duration === 'day' ? 'Number of days' :
                  'Number of units'}
              </Label>
              <Input
                type="number"
                value={offer.priceConfiguration.durationValue || ''}
                onChange={(e) => updatePriceConfig({ durationValue: parseInt(e.target.value) || 0 })}
                placeholder={
                  offer.priceConfiguration.duration === 'year' ? 'Number of years' :
                  offer.priceConfiguration.duration === 'month' ? 'Number of months' :
                  offer.priceConfiguration.duration === 'week' ? 'Number of weeks' :
                  offer.priceConfiguration.duration === 'day' ? 'Number of days' :
                  'Number of units'
                }
                disabled={!offer.priceConfiguration.endDateKnown || isSaved || disabled}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={offer.priceConfiguration.priceModifier.type}
                onValueChange={(value: any) => updatePriceConfig({
                  priceModifier: { ...offer.priceConfiguration.priceModifier, type: value }
                })}
                disabled={isSaved || disabled}
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
                disabled={isSaved || disabled}
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor={`price-description-${offer.id}`}>Description</Label>
            <Input
              id={`price-description-${offer.id}`}
              value={offer.priceConfiguration.description}
              onChange={(e) => updatePriceConfig({ description: e.target.value })}
              placeholder="Promo Description"
              disabled={isSaved || disabled}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
