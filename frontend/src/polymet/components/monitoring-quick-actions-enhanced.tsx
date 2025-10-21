import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FilterIcon,
  DownloadIcon,
  RefreshCwIcon,
  PlayIcon,
  PauseIcon,
  BellIcon,
  ZapIcon,
  CheckSquareIcon,
  ClockIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  SettingsIcon,
  BotIcon,
} from "lucide-react";

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "filter" | "export" | "bulk" | "automation" | "alert";
  enabled: boolean;
  shortcut?: string;
}

interface BulkOperation {
  id: string;
  name: string;
  description: string;
  applicableStatuses: string[];
  fields: BulkField[];
}

interface BulkField {
  id: string;
  name: string;
  type: "text" | "date" | "select" | "checkbox";
  options?: string[];
  required?: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
  conditions: any[];
}

interface MonitoringQuickActionsEnhancedProps {
  type: "import" | "domestic";
  selectedItems?: string[];
  onFilter?: (filters: any) => void;
  onExport?: (config: any) => void;
  onRefresh?: () => void;
  onBulkUpdate?: (operation: string, data: any) => void;
  onAutomationToggle?: (ruleId: string, enabled: boolean) => void;
  className?: string;
}

export function MonitoringQuickActionsEnhanced({
  type,
  selectedItems = [],
  onFilter,
  onExport,
  onRefresh,
  onBulkUpdate,
  onAutomationToggle,
  className = "",
}: MonitoringQuickActionsEnhancedProps) {
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [selectedBulkOperation, setSelectedBulkOperation] =
    useState<string>("");
  const [bulkOperationData, setBulkOperationData] = useState<any>({});
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: "smart_filter",
      name: "Smart Filter",
      description: "AI-powered filtering with suggestions",
      icon: FilterIcon,
      category: "filter",
      enabled: true,
      shortcut: "Ctrl+F",
    },
    {
      id: "bulk_export",
      name: "Bulk Export",
      description: "Export selected items with custom format",
      icon: DownloadIcon,
      category: "export",
      enabled: true,
      shortcut: "Ctrl+E",
    },
    {
      id: "bulk_update",
      name: "Bulk Update",
      description: "Update multiple items simultaneously",
      icon: CheckSquareIcon,
      category: "bulk",
      enabled: selectedItems.length > 0,
    },
    {
      id: "auto_refresh",
      name: "Auto Refresh",
      description: "Automatically refresh data at intervals",
      icon: RefreshCwIcon,
      category: "automation",
      enabled: true,
    },
    {
      id: "smart_alerts",
      name: "Smart Alerts",
      description: "Set up intelligent monitoring alerts",
      icon: BellIcon,
      category: "alert",
      enabled: true,
    },
    {
      id: "workflow_automation",
      name: "Workflow Automation",
      description: "Automate repetitive tasks and workflows",
      icon: BotIcon,
      category: "automation",
      enabled: true,
    },
  ];

  // Bulk operations based on type
  const bulkOperations: BulkOperation[] =
    type === "import"
      ? [
          {
            id: "update_status",
            name: "Update Status",
            description: "Change status for multiple bookings",
            applicableStatuses: ["pending", "in_transit", "arrived"],
            fields: [
              {
                id: "status",
                name: "New Status",
                type: "select",
                options: [
                  "pending",
                  "in_transit",
                  "arrived",
                  "customs_clearance",
                  "released",
                  "delivered",
                ],

                required: true,
              },
              {
                id: "notes",
                name: "Update Notes",
                type: "text",
              },
            ],
          },
          {
            id: "update_dates",
            name: "Update Key Dates",
            description: "Update ETA, ATA, or other important dates",
            applicableStatuses: ["in_transit", "arrived"],
            fields: [
              {
                id: "date_type",
                name: "Date Type",
                type: "select",
                options: ["eta", "ata", "storage_start", "demurrage_start"],
                required: true,
              },
              {
                id: "date_value",
                name: "Date",
                type: "date",
                required: true,
              },
            ],
          },
          {
            id: "assign_priority",
            name: "Assign Priority",
            description: "Set priority level for urgent shipments",
            applicableStatuses: ["pending", "in_transit", "delayed"],
            fields: [
              {
                id: "priority",
                name: "Priority Level",
                type: "select",
                options: ["low", "normal", "high", "urgent"],
                required: true,
              },
              {
                id: "reason",
                name: "Reason",
                type: "text",
              },
            ],
          },
        ]
      : [
          {
            id: "update_delivery_status",
            name: "Update Delivery Status",
            description: "Change delivery status for multiple bookings",
            applicableStatuses: ["dispatched", "in_transit"],
            fields: [
              {
                id: "status",
                name: "New Status",
                type: "select",
                options: ["dispatched", "in_transit", "delivered", "delayed"],
                required: true,
              },
              {
                id: "delivery_notes",
                name: "Delivery Notes",
                type: "text",
              },
            ],
          },
          {
            id: "update_eta",
            name: "Update ETA",
            description: "Update estimated arrival times",
            applicableStatuses: ["dispatched", "in_transit"],
            fields: [
              {
                id: "new_eta",
                name: "New ETA",
                type: "date",
                required: true,
              },
              {
                id: "reason",
                name: "Reason for Change",
                type: "text",
              },
            ],
          },
        ];

  // Automation rules
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: "auto_demurrage_alert",
      name: "Demurrage Alert",
      description: "Alert when free time is about to expire",
      trigger: "2 days before demurrage start",
      action: "Send notification to operations team",
      enabled: true,
      conditions: [{ field: "status", operator: "equals", value: "arrived" }],
    },
    {
      id: "auto_status_update",
      name: "Auto Status Update",
      description: "Automatically update status based on milestones",
      trigger: "When DO is released",
      action: "Update status to 'ready_for_pickup'",
      enabled: true,
      conditions: [
        { field: "do_released", operator: "not_empty", value: null },
      ],
    },
    {
      id: "auto_priority_escalation",
      name: "Priority Escalation",
      description: "Escalate priority for delayed shipments",
      trigger: "When shipment is delayed by 2+ days",
      action: "Set priority to 'high' and notify manager",
      enabled: false,
      conditions: [{ field: "delay_days", operator: "greater_than", value: 2 }],
    },
  ]);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "smart_filter":
        onFilter?.({ smart: true, suggestions: true });
        break;
      case "bulk_export":
        onExport?.({
          items: selectedItems,
          format: "excel",
          includeDetails: true,
        });
        break;
      case "bulk_update":
        setShowBulkOperations(true);
        break;
      case "auto_refresh":
        setAutoRefreshEnabled(!autoRefreshEnabled);
        break;
      case "smart_alerts":
        alert("Smart alerts configuration opened!");
        break;
      case "workflow_automation":
        setShowAutomation(true);
        break;
      default:
        console.log("Action not implemented:", actionId);
    }
  };

  const executeBulkOperation = () => {
    if (!selectedBulkOperation || selectedItems.length === 0) return;

    const operation = bulkOperations.find(
      (op) => op.id === selectedBulkOperation
    );
    if (!operation) return;

    onBulkUpdate?.(selectedBulkOperation, {
      items: selectedItems,
      data: bulkOperationData,
    });

    alert(
      `Bulk operation "${operation.name}" executed for ${selectedItems.length} items!`
    );
    setShowBulkOperations(false);
    setBulkOperationData({});
    setSelectedBulkOperation("");
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules((rules) =>
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );

    const rule = automationRules.find((r) => r.id === ruleId);
    if (rule) {
      onAutomationToggle?.(ruleId, !rule.enabled);
    }
  };

  const getActionsByCategory = (category: string) => {
    return quickActions.filter((action) => action.category === category);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ZapIcon className="h-5 w-5" />

            <span>Quick Actions</span>
            {selectedItems.length > 0 && (
              <Badge variant="secondary">{selectedItems.length} selected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  onClick={() => handleQuickAction(action.id)}
                  disabled={!action.enabled}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  title={
                    action.description +
                    (action.shortcut ? ` (${action.shortcut})` : "")
                  }
                >
                  <IconComponent className="h-5 w-5" />

                  <span className="text-xs text-center">{action.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Smart Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUpIcon className="h-5 w-5" />

            <span>Smart Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <AlertTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />

              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  3 shipments approaching demurrage
                </p>
                <p className="text-sm text-blue-700">
                  Consider expediting customs clearance for BK001, BK003, BK007
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Take Action
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckSquareIcon className="h-5 w-5 text-green-600 mt-0.5" />

              <div className="flex-1">
                <p className="font-medium text-green-900">
                  Bulk update opportunity
                </p>
                <p className="text-sm text-green-700">
                  5 containers ready for delivery - update status in bulk
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Bulk Update
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-orange-600 mt-0.5" />

              <div className="flex-1">
                <p className="font-medium text-orange-900">
                  Schedule optimization
                </p>
                <p className="text-sm text-orange-700">
                  Consolidate 3 deliveries to same area for cost savings
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Optimize
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Refresh Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCwIcon className="h-5 w-5" />

              <span>Auto Refresh</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              >
                {autoRefreshEnabled ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={autoRefreshEnabled}
              onCheckedChange={setAutoRefreshEnabled}
            />

            <Label>Enable auto refresh</Label>
            <Select
              value={refreshInterval.toString()}
              onValueChange={(value) => setRefreshInterval(parseInt(value))}
              disabled={!autoRefreshEnabled}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={!autoRefreshEnabled}
            >
              Refresh Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations Dialog */}
      <Dialog open={showBulkOperations} onOpenChange={setShowBulkOperations}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Operations</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Select Operation</Label>
              <Select
                value={selectedBulkOperation}
                onValueChange={setSelectedBulkOperation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose bulk operation" />
                </SelectTrigger>
                <SelectContent>
                  {bulkOperations.map((operation) => (
                    <SelectItem key={operation.id} value={operation.id}>
                      {operation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBulkOperation && (
                <p className="text-sm text-gray-600 mt-1">
                  {
                    bulkOperations.find((op) => op.id === selectedBulkOperation)
                      ?.description
                  }
                </p>
              )}
            </div>

            {selectedBulkOperation && (
              <div className="space-y-4">
                <h4 className="font-medium">Operation Details</h4>
                {bulkOperations
                  .find((op) => op.id === selectedBulkOperation)
                  ?.fields.map((field) => (
                    <div key={field.id}>
                      <Label>
                        {field.name} {field.required && "*"}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          value={bulkOperationData[field.id] || ""}
                          onValueChange={(value) =>
                            setBulkOperationData((prev) => ({
                              ...prev,
                              [field.id]: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={`Select ${field.name.toLowerCase()}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          value={bulkOperationData[field.id] || ""}
                          onChange={(e) =>
                            setBulkOperationData((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                This operation will affect {selectedItems.length} selected items
              </p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkOperations(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeBulkOperation}
                  disabled={
                    !selectedBulkOperation || selectedItems.length === 0
                  }
                >
                  Execute Operation
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Automation Dialog */}
      <Dialog open={showAutomation} onOpenChange={setShowAutomation}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Workflow Automation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <Checkbox
                    checked={rule.enabled}
                    onCheckedChange={() => toggleAutomationRule(rule.id)}
                  />

                  <div className="flex-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-medium">Trigger:</span>{" "}
                      {rule.trigger} →{" "}
                      <span className="font-medium">Action:</span> {rule.action}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline">Create New Rule</Button>
              <Button onClick={() => setShowAutomation(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
