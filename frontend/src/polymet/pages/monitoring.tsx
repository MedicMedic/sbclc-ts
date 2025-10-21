import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SearchIcon,
  RefreshCwIcon,
  DownloadIcon,
  FilterIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { MonitoringTable } from "@/polymet/components/monitoring-table";
import { AdvancedMonitoringFilters } from "@/polymet/components/advanced-monitoring-filters";
import { EnhancedExportManager } from "@/polymet/components/enhanced-export-manager";
import { DetailedStatusTracker } from "@/polymet/components/detailed-status-tracker";
import { MonitoringQuickActionsEnhanced } from "@/polymet/components/monitoring-quick-actions-enhanced";

function MonitoringPage() {
  const [activeTab, setActiveTab] = useState("import");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(
    new Date().toLocaleTimeString()
  );
  const [showEnhancedView, setShowEnhancedView] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showStatusTracker, setShowStatusTracker] = useState(false);
  const [selectedBookingForTracking, setSelectedBookingForTracking] =
    useState<string>("");

  const handleRefresh = () => {
    setLastRefresh(new Date().toLocaleTimeString());
    // In a real app, this would trigger data refresh
    alert("Data refreshed successfully!");
  };

  const handleExport = () => {
    // In a real app, this would export the filtered data
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${activeTab}_monitoring_${timestamp}.csv`;
    alert(`Exporting ${activeTab} monitoring data to ${filename}`);
  };

  const handleFilter = (filters: any) => {
    console.log("Applying filters:", filters);
    if (filters.quickFilter) {
      alert(`Quick filter applied: ${filters.quickFilter}`);
    } else {
      alert("Advanced filters applied successfully!");
    }
  };

  const handleBulkUpdateLegacy = (updates: any) => {
    console.log("Bulk update (legacy):", updates);
    alert(`Bulk update applied: ${updates.action} to selected items`);
  };

  const handleNotificationAction = (notification: any) => {
    console.log("Taking action on notification:", notification);
    alert(
      `Taking action on: ${notification.title} for booking ${notification.bookingId}`
    );
  };

  const handleAdvancedFilters = (filters: any) => {
    console.log("Advanced filters applied:", filters);
    alert("Advanced filters applied successfully!");
  };

  const handleEnhancedExport = (config: any) => {
    console.log("Enhanced export:", config);
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${activeTab}_monitoring_enhanced_${timestamp}.${config.format}`;
    alert(`Enhanced export completed! File: ${filename}`);
  };

  const handleBulkUpdate = (operation: string, data: any) => {
    console.log("Bulk update:", operation, data);
    alert(
      `Bulk operation "${operation}" completed for ${data.items?.length || 0} items`
    );
  };

  const handleAutomationToggle = (ruleId: string, enabled: boolean) => {
    console.log("Automation toggled:", ruleId, enabled);
    alert(`Automation rule ${enabled ? "enabled" : "disabled"}: ${ruleId}`);
  };

  const handleStatusUpdate = (milestone: string, status: any) => {
    console.log("Status update:", milestone, status);
    alert(`Milestone "${milestone}" updated successfully!`);
  };

  const handleItemSelection = (items: string[]) => {
    setSelectedItems(items);
  };

  const openStatusTracker = (bookingId: string) => {
    setSelectedBookingForTracking(bookingId);
    setShowStatusTracker(true);
  };

  // Mock statistics
  const importStats = {
    total: 45,
    pending: 12,
    inTransit: 18,
    delivered: 15,
    delayed: 3,
  };

  const domesticStats = {
    total: 32,
    pending: 8,
    inTransit: 14,
    delivered: 10,
    delayed: 2,
  };

  const currentStats = activeTab === "import" ? importStats : domesticStats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Shipment Monitoring
          </h1>
          <p className="text-gray-600">
            Real-time tracking of import and domestic shipments
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last refreshed: {lastRefresh}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant={showEnhancedView ? "default" : "outline"}
            onClick={() => setShowEnhancedView(!showEnhancedView)}
            className={
              showEnhancedView
                ? "bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
                : "border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10"
            }
          >
            {showEnhancedView ? (
              <EyeOffIcon className="h-4 w-4 mr-2" />
            ) : (
              <EyeIcon className="h-4 w-4 mr-2" />
            )}
            {showEnhancedView ? "Simple View" : "Enhanced View"}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <EnhancedExportManager
            type={activeTab as "import" | "domestic"}
            onExport={handleEnhancedExport}
          />

          {selectedItems.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              {selectedItems.length} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Enhanced Features */}
      {showEnhancedView && (
        <div className="space-y-6">
          {/* Advanced Filters */}
          <AdvancedMonitoringFilters
            type={activeTab as "import" | "domestic"}
            onFiltersChange={handleAdvancedFilters}
            onSavePreset={(preset) => alert(`Preset "${preset.name}" saved!`)}
            onLoadPreset={(preset) => alert(`Preset "${preset.name}" loaded!`)}
          />

          {/* Enhanced Quick Actions */}
          <MonitoringQuickActionsEnhanced
            type={activeTab as "import" | "domestic"}
            selectedItems={selectedItems}
            onFilter={handleAdvancedFilters}
            onExport={handleEnhancedExport}
            onRefresh={handleRefresh}
            onBulkUpdate={handleBulkUpdate}
            onAutomationToggle={handleAutomationToggle}
          />
        </div>
      )}

      {/* Statistics Overview - Simple View */}
      {!showEnhancedView && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {currentStats.total}
              </div>
              <div className="text-sm text-gray-600">Total Shipments</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#f97316]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[#f97316]">
                {currentStats.pending}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#1e40af]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[#1e40af]">
                {currentStats.inTransit}
              </div>
              <div className="text-sm text-gray-600">In Transit</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {currentStats.delivered}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {currentStats.delayed}
              </div>
              <div className="text-sm text-gray-600">Delayed</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Basic Filters - Only shown in simple view */}
      {!showEnhancedView && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                  <Input
                    placeholder="Search by booking ID, BL number, client name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Refresh Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Last refreshed: {lastRefresh}</span>
        <Badge
          variant="outline"
          className="text-[#1e40af] border-[#1e40af] bg-[#1e40af]/5"
        >
          Live Updates Active
        </Badge>
      </div>

      {/* Monitoring Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            Import Monitoring
          </TabsTrigger>
          <TabsTrigger
            value="domestic"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Domestic Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          {/* Import Monitoring Table */}
          <MonitoringTable
            type="import"
            onItemsSelect={handleItemSelection}
            onStatusTrack={openStatusTracker}
          />
        </TabsContent>

        <TabsContent value="domestic" className="space-y-4">
          {/* Domestic Monitoring Table */}
          <MonitoringTable
            type="domestic"
            onItemsSelect={handleItemSelection}
            onStatusTrack={openStatusTracker}
          />
        </TabsContent>
      </Tabs>

      {/* Simple Quick Actions - Only shown in simple view */}
      {!showEnhancedView && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  alert("Custom filter feature available in Enhanced View")
                }
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Create Custom Filter
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  alert("Report scheduling available in Enhanced View")
                }
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  alert("Auto-refresh settings available in Enhanced View")
                }
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Set Auto-Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Status Tracker Dialog */}
      <Dialog open={showStatusTracker} onOpenChange={setShowStatusTracker}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailed Status Tracking</DialogTitle>
          </DialogHeader>
          {selectedBookingForTracking && (
            <DetailedStatusTracker
              bookingId={selectedBookingForTracking}
              type={activeTab as "import" | "domestic"}
              currentStatus="in_progress"
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { MonitoringPage };
