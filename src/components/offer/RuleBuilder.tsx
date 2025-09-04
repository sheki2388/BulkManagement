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
}

const ruleTypes = [
  { value: 'device_range', label: 'Device Range' },
  { value: 'device_type', label: 'Device Type' },
  { value: 'flow', label: 'Flow Type' },
  { value: 'price_range', label: 'Price Range' },
  { value: 'loyalty_points', label: 'Loyalty Points' },
  { value: 'custom', label: 'Custom Rule' }
];

export function RuleBuilder({ rules, onRulesChange }: RuleBuilderProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const addRule = () => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      type: 'device_range',
      label: 'New Rule',
      config: {},
      isRequired: false
    };
    onRulesChange([...rules, newRule]);
    setExpandedRules(prev => new Set([...prev, newRule.id]));
  };

  const removeRule = (ruleId: string) => {
    onRulesChange(rules.filter(rule => rule.id !== ruleId));
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      newSet.delete(ruleId);
      return newSet;
    });
  };

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    onRulesChange(rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
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
      case 'device_range':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !rule.config.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rule.config.fromDate ? format(rule.config.fromDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={rule.config.fromDate}
                    onSelect={(date) => updateRule(rule.id, {
                      config: { ...rule.config, fromDate: date }
                    })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !rule.config.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rule.config.toDate ? format(rule.config.toDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={rule.config.toDate}
                    onSelect={(date) => updateRule(rule.id, {
                      config: { ...rule.config, toDate: date }
                    })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

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
                      const newDeviceTypes = { ...deviceTypes, [type]: isChecked };
                      updateRule(rule.id, {
                        config: { ...rule.config, deviceTypes: newDeviceTypes }
                      });
                    }}
                  />
                  <Label htmlFor={`${rule.id}-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'flow':
        const flowTypes = rule.config.flowTypes || { OTT: false, TMF: false, STANDALONE: false, MVA: false };
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
                      const newFlowTypes = { ...flowTypes, [type]: isChecked };
                      updateRule(rule.id, {
                        config: { ...rule.config, flowTypes: newFlowTypes }
                      });
                    }}
                  />
                  <Label htmlFor={`${rule.id}-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
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

      case 'custom':
        return (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Field</Label>
                <Input
                  value={rule.config.customField || ''}
                  onChange={(e) => updateRule(rule.id, {
                    config: { ...rule.config, customField: e.target.value }
                  })}
                  placeholder="Field name"
                />
              </div>
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select
                  value={rule.config.customOperator || 'equals'}
                  onValueChange={(value: any) => updateRule(rule.id, {
                    config: { ...rule.config, customOperator: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater_than">Greater than</SelectItem>
                    <SelectItem value="less_than">Less than</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={rule.config.customValue || ''}
                  onChange={(e) => updateRule(rule.id, {
                    config: { ...rule.config, customValue: e.target.value }
                  })}
                  placeholder="Value"
                />
              </div>
            </div>
          </div>
        );

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
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={rule.label}
                          onChange={(e) => updateRule(rule.id, { label: e.target.value })}
                          placeholder="Rule label"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Required</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id={`required-${rule.id}`}
                            checked={rule.isRequired}
                            onCheckedChange={(checked) => updateRule(rule.id, { isRequired: !!checked })}
                          />
                          <Label htmlFor={`required-${rule.id}`} className="text-sm">
                            Required rule
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRuleExpansion(rule.id)}
                    >
                      {expandedRules.has(rule.id) ? 'Collapse' : 'Configure'}
                    </Button>
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