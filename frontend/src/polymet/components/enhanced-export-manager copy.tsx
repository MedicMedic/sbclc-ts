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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DownloadIcon,
  FileTextIcon,
  TableIcon,
  FileSpreadsheetIcon,
  FileIcon,
  CalendarIcon,
  SettingsIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react";

interface ExportTemplate {
  id: string;
  name: string;
  format: string;
  columns: string[];
  filters?: any;
  createdAt: string;
}

interface ScheduledExport {
  id: string;
  name: string;
  template: string;
  frequency: string;
  nextRun: string;
  status: "active" | "paused" | "completed";
}

interface EnhancedExportManagerProps {
  type: "import" | "domestic";
  data?: any[];
  onExport?: (config: any) => void;
  className?: string;
}

export function EnhancedExportManager({
  type,
  data = [],
  onExport,
  className = "",
}: EnhancedExportManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Available columns based on type
  const availableColumns =
    type === "import"
      ? [
          { id: "bookingNo", label: "Booking No", required: true },
          { id: "serviceType", label: "Service Type" },
          { id: "consignee", label: "Consignee" },
          { id: "blReferenceNo", label: "BL Reference No" },
          { id: "portOfDischarge", label: "Port of Discharge" },
          { id: "shippingLines", label: "Shipping Lines" },
          { id: "containerNo", label: "Container No" },
          { id: "containerSize", label: "Container Size" },
          { id: "eta", label: "ETA" },
          { id: "ata", label: "ATA" },
          { id: "storageStart", label: "Storage Start" },
          { id: "demurrageStart", label: "Demurrage Start" },
          { id: "origDocsReceived", label: "Orig Docs Received" },
          { id: "bocEntry", label: "BOC Entry" },
          { id: "assessment", label: "Assessment" },
          { id: "doReleased", label: "DO Released" },
          { id: "pulloutFromPort", label: "Pullout from Port" },
          { id: "deliverToWarehouse", label: "Deliver to Warehouse" },
          { id: "unloading", label: "Unloading" },
          { id: "emptyPullout", label: "Empty Pullout" },
          { id: "billed", label: "Billed" },
          { id: "status", label: "Status" },
        ]
      : [
          { id: "bookingNo", label: "Booking No", required: true },
          { id: "serviceType", label: "Service Type" },
          { id: "client", label: "Client" },
          { id: "origin", label: "Origin" },
          { id: "destination", label: "Destination" },
          { id: "dispatchDate", label: "Dispatch Date" },
          { id: "eta", label: "ETA" },
          { id: "actualArrival", label: "Actual Arrival" },
          { id: "deliveryDate", label: "Delivery Date" },
          { id: "podDate", label: "POD Date" },
          { id: "status", label: "Status" },
        ];

  // Mock saved templates
  const [savedTemplates] = useState<ExportTemplate[]>([
    {
      id: "template_001",
      name: "Weekly Status Report",
      format: "excel",
      columns: ["bookingNo", "consignee", "status", "eta", "ata"],
      createdAt: "2024-01-20",
    },
    {
      id: "template_002",
      name: "Container Tracking Export",
      format: "csv",
      columns: [
        "bookingNo",
        "containerNo",
        "containerSize",
        "doReleased",
        "pulloutFromPort",
      ],

      createdAt: "2024-01-18",
    },
    {
      id: "template_003",
      name: "Client Summary Report",
      format: "pdf",
      columns: ["bookingNo", "consignee", "serviceType", "status"],
      createdAt: "2024-01-15",
    },
  ]);

  // Mock scheduled exports
  const [scheduledExports] = useState<ScheduledExport[]>([
    {
      id: "schedule_001",
      name: "Daily Status Update",
      template: "Weekly Status Report",
      frequency: "daily",
      nextRun: "2024-01-21 09:00",
      status: "active",
    },
    {
      id: "schedule_002",
      name: "Weekly Container Report",
      template: "Container Tracking Export",
      frequency: "weekly",
      nextRun: "2024-01-22 08:00",
      status: "active",
    },
  ]);

  const exportFormats = [
    {
      value: "excel",
      label: "Excel (.xlsx)",
      icon: FileSpreadsheetIcon,
      description: "Full formatting with charts",
    },
    {
      value: "csv",
      label: "CSV (.csv)",
      icon: TableIcon,
      description: "Simple data format",
    },
    {
      value: "pdf",
      label: "PDF (.pdf)",
      icon: FileTextIcon,
      description: "Formatted report",
    },
    {
      value: "json",
      label: "JSON (.json)",
      icon: FileIcon,
      description: "Raw data format",
    },
  ];

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, columnId]);
    } else {
      setSelectedColumns(selectedColumns.filter((id) => id !== columnId));
    }
  };

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns.map((col) => col.id));
  };

  const selectRequiredColumns = () => {
    setSelectedColumns(
      availableColumns.filter((col) => col.required).map((col) => col.id)
    );
  };

  const loadTemplate = (template: ExportTemplate) => {
    setExportFormat(template.format);
    setSelectedColumns(template.columns);
    setTemplateName(template.name);
  };

  const saveTemplate = () => {
    if (!templateName.trim() || selectedColumns.length === 0) return;

    const template: ExportTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      format: exportFormat,
      columns: selectedColumns,
      createdAt: new Date().toISOString().split("T")[0],
    };

    alert(`Template "${template.name}" saved successfully!`);
    setTemplateName("");
  };

  const startExport = async () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column to export.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);

          // Generate filename
          const timestamp = new Date().toISOString().split("T")[0];
          const filename = `${type}_monitoring_${timestamp}.${exportFormat === "excel" ? "xlsx" : exportFormat}`;

          // Trigger actual export
          onExport?.({
            format: exportFormat,
            columns: selectedColumns,
            filename,
            data: data,
          });

          alert(`Export completed! File: ${filename}`);
          setIsOpen(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const scheduleExport = () => {
    if (!templateName.trim()) {
      alert("Please provide a name for the scheduled export.");
      return;
    }

    alert(`Scheduled export "${templateName}" created successfully!`);
    setShowScheduler(false);
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Enhanced Export
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enhanced Export Manager</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Export Progress */}
            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Exporting...</Label>
                  <span className="text-sm text-gray-600">
                    {exportProgress}%
                  </span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            {/* Quick Templates */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Quick Templates</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {savedTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    onClick={() => loadTemplate(template)}
                    className="p-4 h-auto flex flex-col items-start space-y-1"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">
                      {template.format.toUpperCase()} •{" "}
                      {template.columns.length} columns
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {template.createdAt}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Export Format</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {exportFormats.map((format) => {
                  const IconComponent = format.icon;
                  return (
                    <Button
                      key={format.value}
                      variant={
                        exportFormat === format.value ? "default" : "outline"
                      }
                      onClick={() => setExportFormat(format.value)}
                      className="p-4 h-auto flex flex-col items-center space-y-2"
                    >
                      <IconComponent className="h-6 w-6" />

                      <div className="text-center">
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-gray-500">
                          {format.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Column Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Select Columns
                </Label>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectRequiredColumns}
                  >
                    Required Only
                  </Button>
                  <Button variant="ghost" size="sm" onClick={selectAllColumns}>
                    Select All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                {availableColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={(checked) =>
                        handleColumnToggle(column.id, checked as boolean)
                      }
                      disabled={column.required}
                    />

                    <Label htmlFor={column.id} className="text-sm">
                      {column.label}
                      {column.required && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          Required
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                Selected: {selectedColumns.length} of {availableColumns.length}{" "}
                columns
              </div>
            </div>

            {/* Template Management */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Template Management
              </Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="flex-1"
                />

                <Button
                  variant="outline"
                  onClick={saveTemplate}
                  disabled={
                    !templateName.trim() || selectedColumns.length === 0
                  }
                >
                  Save Template
                </Button>
              </div>
            </div>

            {/* Scheduled Exports */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Scheduled Exports
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduler(!showScheduler)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Export
                </Button>
              </div>

              {showScheduler && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Export Name</Label>
                      <Input
                        placeholder="Scheduled export name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={scheduleExport} size="sm">
                      Create Schedule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowScheduler(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {scheduledExports.length > 0 && (
                <div className="space-y-2">
                  {scheduledExports.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{schedule.name}</div>
                        <div className="text-sm text-gray-600">
                          {schedule.template} • {schedule.frequency}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            schedule.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {schedule.status}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <ClockIcon className="h-3 w-3 inline mr-1" />

                          {schedule.nextRun}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Actions */}
            <div className="flex justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Ready to export {data.length} records with{" "}
                {selectedColumns.length} columns
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={startExport}
                  disabled={selectedColumns.length === 0 || isExporting}
                >
                  {isExporting ? (
                    <>
                      <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Start Export
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
