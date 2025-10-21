import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FilterIcon,
  DownloadIcon,
  RefreshCwIcon,
  BellIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  TruckIcon,
  ShipIcon,
  CalendarIcon,
  SearchIcon,
} from "lucide-react";

interface MonitoringQuickActionsProps {
  type: "import" | "domestic";
  onFilter?: (filters: any) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onBulkUpdate?: (updates: any) => void;
  className?: string;
}

export function MonitoringQuickActions({
  type,
  onFilter,
  onExport,
  onRefresh,
  onBulkUpdate,
  className = "",
}: MonitoringQuickActionsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
    client: "",
    urgent: false,
  });
  const [bulkUpdateData, setBulkUpdateData] = useState({
    action: "",
    status: "",
    notes: "",
  });

  const quickFilters =
    type === "import"
      ? [
          {
            label: "Arriving Today",
            value: "arriving_today",
            count: 3,
            color: "bg-blue-500",
          },
          {
            label: "Customs Pending",
            value: "customs_pending",
            count: 8,
            color: "bg-orange-500",
          },
          {
            label: "Ready for Pickup",
            value: "ready_pickup",
            count: 5,
            color: "bg-green-500",
          },
          { label: "Overdue", value: "overdue", count: 2, color: "bg-red-500" },
        ]
      : [
          {
            label: "In Transit",
            value: "in_transit",
            count: 12,
            color: "bg-blue-500",
          },
          { label: "Delayed", value: "delayed", count: 3, color: "bg-red-500" },
          {
            label: "Delivered Today",
            value: "delivered_today",
            count: 7,
            color: "bg-green-500",
          },
          {
            label: "Pending Dispatch",
            value: "pending_dispatch",
            count: 4,
            color: "bg-orange-500",
          },
        ];

  const handleQuickFilter = (filterValue: string) => {
    onFilter?.({ quickFilter: filterValue });
  };

  const handleAdvancedFilter = () => {
    onFilter?.(filters);
    setShowFilters(false);
  };

  const handleBulkUpdate = () => {
    onBulkUpdate?.(bulkUpdateData);
    setShowBulkUpdate(false);
    setBulkUpdateData({ action: "", status: "", notes: "" });
  };

  const handleExportData = () => {
    // Simple export functionality
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${type}_monitoring_${timestamp}.csv`;

    // Create a simple CSV export
    const csvContent =
      type === "import"
        ? "Booking ID,BL Number,Consignee,Vessel,ETA,Customs Status,Delivery Status\n"
        : "Booking ID,Client,Service Type,Origin,Destination,Status,ETA\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    onExport?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickFilters.map((filter) => (
          <Card
            key={filter.value}
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
            style={{ borderLeftColor: filter.color.replace("bg-", "#") }}
            onClick={() => handleQuickFilter(filter.value)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {filter.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filter.count}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${filter.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            {type === "import" ? (
              <ShipIcon className="h-5 w-5" />
            ) : (
              <TruckIcon className="h-5 w-5" />
            )}
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2"
            >
              <FilterIcon className="h-4 w-4" />

              <span>Advanced Filters</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center space-x-2"
            >
              <DownloadIcon className="h-4 w-4" />

              <span>Export Data</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCwIcon className="h-4 w-4" />

              <span>Refresh</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkUpdate(true)}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-4 w-4" />

              <span>Bulk Update</span>
            </Button>

            {/* Auto-refresh indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 ml-auto">
              <ClockIcon className="h-4 w-4" />

              <span>Auto-refresh: 5 min</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {type === "import" ? (
                    <>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="lodged">Lodged</SelectItem>
                      <SelectItem value="examined">Examined</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  setFilters({ ...filters, dateRange: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client-search">Client Search</Label>
              <Input
                id="client-search"
                placeholder="Search by client name..."
                value={filters.client}
                onChange={(e) =>
                  setFilters({ ...filters, client: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent-only"
                checked={filters.urgent}
                onChange={(e) =>
                  setFilters({ ...filters, urgent: e.target.checked })
                }
                className="rounded border-gray-300"
              />

              <Label htmlFor="urgent-only" className="text-sm">
                Show urgent items only
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    status: "",
                    dateRange: "",
                    client: "",
                    urgent: false,
                  });
                  setShowFilters(false);
                }}
              >
                Clear
              </Button>
              <Button onClick={handleAdvancedFilter}>Apply Filters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={showBulkUpdate} onOpenChange={setShowBulkUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Update Selected Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-action">Action</Label>
              <Select
                value={bulkUpdateData.action}
                onValueChange={(value) =>
                  setBulkUpdateData({ ...bulkUpdateData, action: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update_status">Update Status</SelectItem>
                  <SelectItem value="add_notes">Add Notes</SelectItem>
                  <SelectItem value="mark_urgent">Mark as Urgent</SelectItem>
                  <SelectItem value="send_notification">
                    Send Notification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkUpdateData.action === "update_status" && (
              <div>
                <Label htmlFor="bulk-status">New Status</Label>
                <Select
                  value={bulkUpdateData.status}
                  onValueChange={(value) =>
                    setBulkUpdateData({ ...bulkUpdateData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {type === "import" ? (
                      <>
                        <SelectItem value="lodged">Lodged</SelectItem>
                        <SelectItem value="examined">Examined</SelectItem>
                        <SelectItem value="released">Released</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="bulk-notes">Notes</Label>
              <Textarea
                id="bulk-notes"
                placeholder="Add notes for this bulk update..."
                value={bulkUpdateData.notes}
                onChange={(e) =>
                  setBulkUpdateData({
                    ...bulkUpdateData,
                    notes: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />

                <p className="text-sm text-yellow-800">
                  This action will affect all selected items. Please confirm
                  before proceeding.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowBulkUpdate(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkUpdate}
                disabled={!bulkUpdateData.action}
              >
                Apply to Selected
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
