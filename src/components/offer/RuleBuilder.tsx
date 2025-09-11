import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Rule, DeviceType, FlowType } from "./types";

interface RuleBuilderProps {
  rules: Rule[];
  onRulesChange: (rules: Rule[]) => void;
  disabled?: boolean;
}

const ruleTypes = [
  { value: 'device_type', label: 'Device Type' },
  { value: 'flow', label: 'Flow Type' },
  { value: 'price_range', label: 'Price Range' },
  { value: 'loyalty_points', label: 'Loyalty Points' },
  { value: 'manufacture_name', label: 'Manufacture Name' },
  { value: 'store_id', label: 'Store ID' }
];

export function RuleBuilder({ rules, onRulesChange, disabled = false }: RuleBuilderProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const addRule = () => {
    if (disabled) return;
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      type: 'device_type',
      config: { deviceTypes: { MO: false, SW: false, TA: false } }
    };
    onRulesChange([...rules, newRule]);
    setExpandedRules(prev => new Set([...prev, newRule.id]));
  };

  const removeRule = (ruleId: string) => {
    if (disabled) return;
    onRulesChange(rules.filter(rule => rule.id !== ruleId));
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      newSet.delete(ruleId);
      return newSet;
    });
  };

  // Get default config for a rule type
  const getDefaultConfig = (type: Rule['type']) => {
    switch (type) {
      case 'device_type':
        return { deviceTypes: { MO: false, SW: false, TA: false } };
      case 'manufacture_name':
        return { manufactureNames: [] };
      case 'store_id':
        return { storeIds: '' };
      case 'flow':
        return { flowTypes: { OTT: false, STANDALONE: false, API: false, MVA: false } };
      case 'price_range':
        return { priceMin: 0, priceMax: 1000 };
  // ...removed custom rule config...
      case 'loyalty_points':
        return {};
      default:
        return {};
    }
  };

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    onRulesChange(rules.map(rule => {
      if (rule.id === ruleId) {
        // If type is changing, reset config
        if (updates.type && updates.type !== rule.type) {
          return { ...rule, ...updates, config: getDefaultConfig(updates.type as Rule['type']) };
        }
        return { ...rule, ...updates };
      }
      return rule;
    }));
  };

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const renderRuleConfig = (rule: Rule) => {
    const isExpanded = expandedRules.has(rule.id);
    if (!isExpanded) return null;

    switch (rule.type) {
      case 'loyalty_points':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Min Loyalty Points</Label>
              <Input
                type="number"
                value={rule.config.minPoints || ''}
                onChange={(e) => updateRule(rule.id, {
                  config: { ...rule.config, minPoints: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Loyalty Points</Label>
              <Input
                type="number"
                value={rule.config.maxPoints || ''}
                onChange={(e) => updateRule(rule.id, {
                  config: { ...rule.config, maxPoints: parseFloat(e.target.value) || 0 }
                })}
                placeholder="1000"
              />
            </div>
          </div>
        );
      // ...existing code...

      case 'device_type':
  const deviceTypes = rule.config.deviceTypes || { MO: false, SW: false, TA: false };
        return (
          <div className="mt-4">
            <Label className="text-sm font-medium">Device Types</Label>
            <div className="flex space-x-6 mt-2">
              {Object.entries(deviceTypes).map(([type, checked]) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${rule.id}-${type}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      if (disabled) return;
                      const newDeviceTypes = { ...deviceTypes, [type]: isChecked };
                      updateRule(rule.id, {
                        config: { ...rule.config, deviceTypes: newDeviceTypes }
                      });
                    }}
                    disabled={disabled}
                  />
                  <Label htmlFor={`${rule.id}-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'flow':
        const flowTypes = rule.config.flowTypes || { OTT: false, STANDALONE: false, API: false, MVA: false };
        return (
          <div className="mt-4">
            <Label className="text-sm font-medium">Flow Types</Label>
            <div className="flex space-x-6 mt-2">
              {Object.entries(flowTypes).map(([type, checked]) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${rule.id}-${type}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      if (disabled) return;
                      const newFlowTypes = { ...flowTypes, [type]: isChecked };
                      updateRule(rule.id, {
                        config: { ...rule.config, flowTypes: newFlowTypes }
                      });
                    }}
                    disabled={disabled}
                  />
                  <Label htmlFor={`${rule.id}-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'manufacture_name':
        const allManufacturers = ["Apple", "Samsung", "Xiaomi", "OnePlus", "Google", "Other"];
        const selectedManufacturers = rule.config.manufactureNames || [];
        return (
          <div className="mt-4">
            <Label className="text-sm font-medium">Device Mobile Manufacturer Name</Label>
            <div className="flex space-x-6 mt-2">
              {allManufacturers.map((name) => (
                <div key={name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${rule.id}-${name}`}
                    checked={selectedManufacturers.includes(name)}
                    onCheckedChange={(isChecked) => {
                      let updated = isChecked
                        ? [...selectedManufacturers, name]
                        : selectedManufacturers.filter((n) => n !== name);
                      updateRule(rule.id, {
                        config: { ...rule.config, manufactureNames: updated }
                      });
                    }}
                  />
                  <Label htmlFor={`${rule.id}-${name}`} className="text-sm">{name}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'store_id':
        return (
          <div className="mt-4">
            <Label className="text-sm font-medium">Store ID</Label>
            <textarea
              className="w-full border rounded p-2 text-sm"
              value={rule.config.storeIds || ''}
              onChange={(e) => updateRule(rule.id, { config: { ...rule.config, storeIds: e.target.value } })}
              placeholder="Enter Store IDs (newline or | separated)"
              rows={3}
            />
          </div>
        );

      case 'price_range':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Min Price</Label>
              <Input
                type="number"
                value={rule.config.priceMin || ''}
                onChange={(e) => updateRule(rule.id, {
                  config: { ...rule.config, priceMin: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Price</Label>
              <Input
                type="number"
                value={rule.config.priceMax || ''}
                onChange={(e) => updateRule(rule.id, {
                  config: { ...rule.config, priceMax: parseFloat(e.target.value) || 0 }
                })}
                placeholder="1000"
              />
            </div>
          </div>
        );

  // ...removed custom rule UI...

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Rules Configuration</CardTitle>
        <Button onClick={addRule} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No rules configured. Add a rule to get started.
          </div>
        ) : (
          rules.map((rule, index) => (
            <Card key={rule.id} className="border-l-4 border-l-primary">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Rule Type</Label>
                        <Select
                          value={rule.type}
                          onValueChange={(value: any) => updateRule(rule.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ruleTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Removed rule label input */}
                      {/* Removed required rule checkbox and label */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(rule.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {renderRuleConfig(rule)}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}