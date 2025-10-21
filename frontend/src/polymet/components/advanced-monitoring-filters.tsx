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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FilterIcon,
  CalendarIcon,
  SaveIcon,
  TrashIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import { format } from "date-fns";

interface FilterPreset {
  id: string;
  name: string;
  filters: any;
  createdAt: string;
}

interface AdvancedMonitoringFiltersProps {
  type: "import" | "domestic";
  onFiltersChange?: (filters: any) => void;
  onSavePreset?: (preset: FilterPreset) => void;
  onLoadPreset?: (preset: FilterPreset) => void;
  className?: string;
}

export function AdvancedMonitoringFilters({
  type,
  onFiltersChange,
  onSavePreset,
  onLoadPreset,
  className = "",
}: AdvancedMonitoringFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);

  // Mock saved presets
  const [savedPresets] = useState<FilterPreset[]>([
    {
      id: "preset_001",
      name: "Delayed Shipments",
      filters: { status: ["delayed"], priority: ["high"] },
      createdAt: "2024-01-20",
    },
    {
      id: "preset_002",
      name: "This Week's Arrivals",
      filters: { dateRange: "week", status: ["in_transit", "arrived"] },
      createdAt: "2024-01-18",
    },
    {
      id: "preset_003",
      name: "Pending Documentation",
      filters: { documentStatus: ["missing", "pending"] },
      createdAt: "2024-01-15",
    },
  ]);

  const statusOptions =
    type === "import"
      ? [
          { value: "pending", label: "Pending" },
          { value: "in_transit", label: "In Transit" },
          { value: "arrived", label: "Arrived" },
          { value: "customs_clearance", label: "Customs Clearance" },
          { value: "released", label: "Released" },
          { value: "delivered", label: "Delivered" },
          { value: "delayed", label: "Delayed" },
          { value: "completed", label: "Completed" },
        ]
      : [
          { value: "pending", label: "Pending" },
          { value: "dispatched", label: "Dispatched" },
          { value: "in_transit", label: "In Transit" },
          { value: "delivered", label: "Delivered" },
          { value: "delayed", label: "Delayed" },
          { value: "completed", label: "Completed" },
        ];

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ];

  const documentStatusOptions = [
    { value: "complete", label: "Complete" },
    { value: "missing", label: "Missing Documents" },
    { value: "pending", label: "Pending Review" },
    { value: "rejected", label: "Rejected" },
  ];

  const shippingLines = [
    "Maersk Line",
    "Evergreen",
    "COSCO Shipping",
    "MSC Mediterranean",
    "CMA CGM",
    "OOCL",
    "Yang Ming",
    "Hapag-Lloyd",
  ];

  const ports = [
    "Port of Manila",
    "Port of Cebu",
    "Port of Davao",
    "Port of Iloilo",
    "Port of Cagayan de Oro",
    "Port of Batangas",
    "Port of Subic",
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleMultiSelectChange = (
    key: string,
    value: string,
    checked: boolean
  ) => {
    const currentValues = activeFilters[key] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);

    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    if (range.from && range.to) {
      handleFilterChange("dateRange", {
        from: format(range.from, "yyyy-MM-dd"),
        to: format(range.to, "yyyy-MM-dd"),
      });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setDateRange({});
    onFiltersChange?.({});
  };

  const savePreset = () => {
    if (!presetName.trim()) return;

    const preset: FilterPreset = {
      id: `preset_${Date.now()}`,
      name: presetName,
      filters: activeFilters,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onSavePreset?.(preset);
    setPresetName("");
    setShowSavePreset(false);
    alert(`Filter preset "${preset.name}" saved successfully!`);
  };

  const loadPreset = (preset: FilterPreset) => {
    setActiveFilters(preset.filters);
    onLoadPreset?.(preset);
    onFiltersChange?.(preset.filters);
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter((key) => activeFilters[key])
      .length;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <FilterIcon className="h-4 w-4 mr-2" />
                Advanced Filters
                {getActiveFilterCount() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-6" align="start">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Advanced Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                {/* Quick Search */}
                <div className="space-y-2">
                  <Label>Quick Search</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                    <Input
                      placeholder="Search by any field..."
                      value={activeFilters.search || ""}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />

                        {dateRange.from && dateRange.to
                          ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                          : "Select date range"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {statusOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`status-${option.value}`}
                          checked={(activeFilters.status || []).includes(
                            option.value
                          )}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange(
                              "status",
                              option.value,
                              checked as boolean
                            )
                          }
                        />

                        <Label
                          htmlFor={`status-${option.value}`}
                          className="text-sm"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {priorityOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`priority-${option.value}`}
                          checked={(activeFilters.priority || []).includes(
                            option.value
                          )}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange(
                              "priority",
                              option.value,
                              checked as boolean
                            )
                          }
                        />

                        <Label
                          htmlFor={`priority-${option.value}`}
                          className="text-sm"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Import-specific filters */}
                {type === "import" && (
                  <>
                    <div className="space-y-2">
                      <Label>Shipping Lines</Label>
                      <Select
                        value={activeFilters.shippingLine || ""}
                        onValueChange={(value) =>
                          handleFilterChange("shippingLine", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping line" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Shipping Lines</SelectItem>
                          {shippingLines.map((line) => (
                            <SelectItem key={line} value={line}>
                              {line}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Port of Discharge</Label>
                      <Select
                        value={activeFilters.port || ""}
                        onValueChange={(value) =>
                          handleFilterChange("port", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select port" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Ports</SelectItem>
                          {ports.map((port) => (
                            <SelectItem key={port} value={port}>
                              {port}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Container Size</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["20ft", "40ft", "40ft_hc"].map((size) => (
                          <div
                            key={size}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`size-${size}`}
                              checked={(
                                activeFilters.containerSize || []
                              ).includes(size)}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange(
                                  "containerSize",
                                  size,
                                  checked as boolean
                                )
                              }
                            />

                            <Label htmlFor={`size-${size}`} className="text-sm">
                              {size}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Document Status */}
                <div className="space-y-2">
                  <Label>Document Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {documentStatusOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`doc-${option.value}`}
                          checked={(
                            activeFilters.documentStatus || []
                          ).includes(option.value)}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange(
                              "documentStatus",
                              option.value,
                              checked as boolean
                            )
                          }
                        />

                        <Label
                          htmlFor={`doc-${option.value}`}
                          className="text-sm"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Preset */}
                <div className="space-y-2 pt-4 border-t">
                  {!showSavePreset ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowSavePreset(true)}
                      className="w-full"
                      disabled={getActiveFilterCount() === 0}
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save as Preset
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="Preset name"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                      />

                      <div className="flex space-x-2">
                        <Button
                          onClick={savePreset}
                          size="sm"
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowSavePreset(false)}
                          size="sm"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              <RefreshCwIcon className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Saved Presets */}
        {savedPresets.length > 0 && (
          <div className="flex items-center space-x-2">
            <Label className="text-sm text-gray-600">Quick Presets:</Label>
            {savedPresets.slice(0, 3).map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => loadPreset(preset)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0))
              return null;

            const displayValue = Array.isArray(value)
              ? value.join(", ")
              : typeof value === "object"
                ? `${value.from} to ${value.to}`
                : value;

            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span className="text-xs">
                  {key}: {displayValue}
                </span>
                <button
                  onClick={() => handleFilterChange(key, undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
