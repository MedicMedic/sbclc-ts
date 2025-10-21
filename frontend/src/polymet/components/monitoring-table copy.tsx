import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EditIcon,
  TruckIcon,
  ShipIcon,
  EyeIcon,
  AlertTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { bookings } from "@/polymet/data/logistics-data";
import { ImportMonitoringForm } from "@/polymet/components/import-monitoring-form";
import { TruckingMonitoringForm } from "@/polymet/components/trucking-monitoring-form";
import { ForwardingMonitoringForm } from "@/polymet/components/forwarding-monitoring-form";
import { DomesticStatusIndicators } from "@/polymet/components/domestic-status-indicators";

interface MonitoringTableProps {
  type: "import" | "domestic";
  data?: any[];
  onItemsSelect?: (items: string[]) => void;
  onStatusTrack?: (bookingId: string) => void;
}

// Enhanced import monitoring data with realistic dates and status scenarios
const getImportMonitoringData = () => {
  const today = new Date();
  const getDateOffset = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  // Create realistic scenarios for monitoring
  const scenarios = [
    {
      bookingNo: "BK001",
      consignee: "ABC Trading Corp",
      serviceType: "Forwarding",
      containerNo: "MAEU1234567",
      containerSize: "40ft",
      eta: getDateOffset(-5),
      ata: getDateOffset(-5),
      demurrageStart: getDateOffset(-2), // Started demurrage 2 days ago - DELAYED
      assessment: getDateOffset(-1),
      deliverToWarehouse: "", // Not delivered yet
      billed: "",
      status: "in_progress",
    },
    {
      bookingNo: "BK002",
      consignee: "XYZ Logistics Inc",
      serviceType: "Brokerage",
      containerNo: "TCLU9876543",
      containerSize: "20ft",
      eta: getDateOffset(-3),
      ata: getDateOffset(-3),
      demurrageStart: getDateOffset(1), // Demurrage starts tomorrow - NEARLY DELAYED
      assessment: getDateOffset(-1),
      deliverToWarehouse: "",
      billed: "",
      status: "in_progress",
    },
    {
      bookingNo: "BK003",
      consignee: "Tech Solutions Inc",
      serviceType: "Brokerage",
      containerNo: "COSCO5555555",
      containerSize: "40ft HC",
      eta: getDateOffset(-7),
      ata: getDateOffset(-7),
      demurrageStart: getDateOffset(-5),
      assessment: getDateOffset(-3),
      deliverToWarehouse: getDateOffset(-1), // Delivered but not billed - READY FOR BILLING
      billed: "",
      status: "delivered",
    },
    {
      bookingNo: "BK004",
      consignee: "Fashion Retail Corp",
      serviceType: "Forwarding",
      containerNo: "MSCU7777777",
      containerSize: "20ft, 20ft",
      eta: getDateOffset(-10),
      ata: getDateOffset(-8), // Arrived 2 days late
      demurrageStart: getDateOffset(-6),
      assessment: getDateOffset(-4),
      deliverToWarehouse: getDateOffset(-2),
      billed: getDateOffset(-1), // Completed - BILLED
      status: "completed",
    },
    {
      bookingNo: "BK005",
      consignee: "Global Import Co",
      serviceType: "Brokerage",
      containerNo: "OOLU1111111",
      containerSize: "40ft",
      eta: getDateOffset(-15),
      ata: getDateOffset(-12), // Arrived 3 days late - ARRIVAL DELAYED
      demurrageStart: getDateOffset(-10),
      assessment: "", // Assessment pending
      deliverToWarehouse: "",
      billed: "",
      status: "delayed",
    },
  ];

  return scenarios.map((scenario, index) => ({
    ...scenario,
    blReferenceNo: `REF${String(index + 1).padStart(3, "0")}`,
    portOfDischarge: "Port of Manila",
    shippingLines: [
      "Maersk Line",
      "Evergreen",
      "COSCO Shipping",
      "MSC Mediterranean",
      "OOCL",
    ][index % 5],
    lastUpdate: `${today.toLocaleDateString()} ${today.toLocaleTimeString().slice(0, 5)}`,
    updatedBy: [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Chen",
      "Alex Wong",
    ][index % 5],
  }));
};

const getDomesticMonitoringData = () => {
  return bookings
    .filter((booking) => booking.type && booking.type.includes("domestic"))
    .slice(0, 10) // Limit to 10 items for simplicity
    .map((booking) => ({
      id: booking.id || "N/A",
      clientName: booking.client || booking.consignee || "N/A",
      serviceType: booking.type
        ? booking.type.replace("domestic_", "").replace("_", " ")
        : "unknown",
      origin: booking.pickup || booking.origin || "N/A",
      destination: booking.delivery || booking.destination || "N/A",
      truckNumber: booking.truckNumber || "TBD",
      driverName: booking.driverName || "TBD",
      status: booking.status || "pending",
      lastUpdate: booking.lastUpdate || "2024-01-20 10:30",
      updatedBy: booking.updatedBy || "System",
      // Include the full booking data for form access
      ...booking,
    }));
};

export function MonitoringTable({
  type,
  data,
  onItemsSelect,
  onStatusTrack,
}: MonitoringTableProps) {
  const [monitoringData] = useState(
    data ||
      (type === "import"
        ? getImportMonitoringData()
        : getDomesticMonitoringData())
  );
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<
    "import" | "trucking" | "forwarding"
  >("import");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "secondary" as const,
      in_progress: "default" as const,
      completed: "default" as const,
      delivered: "default" as const,
      cancelled: "destructive" as const,
      delayed: "destructive" as const,
    };

    const variant =
      statusColors[status as keyof typeof statusColors] || "secondary";

    return (
      <Badge variant={variant}>{status.replace("_", " ").toUpperCase()}</Badge>
    );
  };

  const handleUpdateRecord = (record: any) => {
    if (type === "import") {
      setSelectedRecord(record);
      setFormType("import");
      setIsFormOpen(true);
    } else if (type === "domestic") {
      // Determine if it's trucking or forwarding based on service type
      if (record.type === "domestic_trucking") {
        setSelectedRecord(record);
        setFormType("trucking");
        setIsFormOpen(true);
      } else if (record.type === "domestic_forwarding") {
        setSelectedRecord(record);
        setFormType("forwarding");
        setIsFormOpen(true);
      } else {
        alert(`Unknown domestic service type for ${record.id}`);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  };

  const handleFormSave = (updatedData: any) => {
    console.log("Updated monitoring data:", updatedData);
    // Here you would typically update the data in your state management or API
    alert(`Booking ${updatedData.bookingId} updated successfully!`);
    setIsFormOpen(false);
    setSelectedRecord(null);
  };

  const handleItemSelect = (bookingId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedItems, bookingId]
      : selectedItems.filter((id) => id !== bookingId);

    setSelectedItems(newSelection);
    onItemsSelect?.(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked
      ? monitoringData.map((item) => item.bookingNo || item.id)
      : [];
    setSelectedItems(newSelection);
    onItemsSelect?.(newSelection);
  };

  const handleStatusTrack = (bookingId: string) => {
    onStatusTrack?.(bookingId);
  };

  // Helper function to determine delay status
  const getDelayStatus = (record: any) => {
    const today = new Date();
    const eta = record.eta ? new Date(record.eta) : null;
    const ata = record.ata ? new Date(record.ata) : null;
    const demurrageStart = record.demurrageStart
      ? new Date(record.demurrageStart)
      : null;

    // If delivered and billed, ready for billing
    if (record.deliverToWarehouse && record.billed) {
      return {
        status: "billed",
        priority: "low",
        color: "bg-green-100 text-green-800",
      };
    }

    // If delivered but not billed, ready for billing
    if (record.deliverToWarehouse && !record.billed) {
      return {
        status: "ready_billing",
        priority: "medium",
        color: "bg-blue-100 text-blue-800",
      };
    }

    // Check for demurrage delays
    if (
      demurrageStart &&
      demurrageStart <= today &&
      !record.deliverToWarehouse
    ) {
      const daysSinceDemurrage = Math.floor(
        (today.getTime() - demurrageStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceDemurrage > 5) {
        return {
          status: "delayed",
          priority: "high",
          color: "bg-red-100 text-red-800",
          days: daysSinceDemurrage,
        };
      } else if (daysSinceDemurrage > 2) {
        return {
          status: "nearly_delayed",
          priority: "medium",
          color: "bg-orange-100 text-orange-800",
          days: daysSinceDemurrage,
        };
      }
    }

    // Check ETA vs ATA delays
    if (eta && ata && ata > eta) {
      const delayDays = Math.floor(
        (ata.getTime() - eta.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (delayDays > 3) {
        return {
          status: "arrival_delayed",
          priority: "high",
          color: "bg-red-100 text-red-800",
          days: delayDays,
        };
      }
    }

    // Check if approaching demurrage
    if (demurrageStart) {
      const daysUntilDemurrage = Math.floor(
        (demurrageStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDemurrage <= 2 && daysUntilDemurrage >= 0) {
        return {
          status: "approaching_demurrage",
          priority: "medium",
          color: "bg-yellow-100 text-yellow-800",
          days: daysUntilDemurrage,
        };
      }
    }

    return {
      status: "on_track",
      priority: "low",
      color: "bg-gray-100 text-gray-800",
    };
  };

  const renderImportTable = () => (
    <div className="overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-gray-50">
            {/* Selection Checkbox */}
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedItems.length === monitoringData.length &&
                  monitoringData.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {/* Essential Information */}
            <TableHead className="min-w-[100px] font-semibold">
              Booking No
            </TableHead>
            <TableHead className="min-w-[150px] font-semibold">
              Consignee
            </TableHead>
            <TableHead className="min-w-[120px] font-semibold">
              Container Info
            </TableHead>

            {/* Critical Timeline - Simplified */}
            <TableHead className="min-w-[90px] font-semibold">
              ETA / ATA
            </TableHead>
            <TableHead className="min-w-[110px] font-semibold">
              Demurrage Start
            </TableHead>
            <TableHead className="min-w-[100px] font-semibold">
              Delivery Status
            </TableHead>

            {/* Status Indicators */}
            <TableHead className="min-w-[140px] font-semibold">
              Priority Alert
            </TableHead>
            <TableHead className="min-w-[80px] font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monitoringData.map((record) => {
            const delayInfo = getDelayStatus(record);
            return (
              <TableRow
                key={record.bookingNo}
                className={`hover:bg-gray-50 ${
                  delayInfo.priority === "high"
                    ? "border-l-4 border-red-500"
                    : delayInfo.priority === "medium"
                      ? "border-l-4 border-orange-500"
                      : "border-l-4 border-transparent"
                }`}
              >
                {/* Selection Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(record.bookingNo)}
                    onCheckedChange={(checked) =>
                      handleItemSelect(record.bookingNo, checked as boolean)
                    }
                  />
                </TableCell>

                {/* Essential Information */}
                <TableCell className="font-medium text-blue-600">
                  {record.bookingNo}
                </TableCell>
                <TableCell className="font-medium">
                  <div>{record.consignee}</div>
                  <Badge variant="outline" className="capitalize text-xs mt-1">
                    {record.serviceType}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <div
                    className="max-w-[120px] truncate font-medium"
                    title={record.containerNo}
                  >
                    {record.containerNo}
                  </div>
                  <div className="text-xs text-gray-500">
                    {record.containerSize}
                  </div>
                </TableCell>

                {/* Critical Timeline - Simplified */}
                <TableCell className="text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">ETA:</div>
                    <div>
                      {record.eta
                        ? new Date(record.eta).toLocaleDateString()
                        : "-"}
                    </div>
                    {record.ata && (
                      <>
                        <div className="text-xs text-gray-500">ATA:</div>
                        <div
                          className={
                            record.eta &&
                            new Date(record.ata) > new Date(record.eta)
                              ? "text-red-600 font-medium"
                              : "text-green-600"
                          }
                        >
                          {new Date(record.ata).toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {record.demurrageStart ? (
                    <div className="space-y-1">
                      <div
                        className={
                          new Date(record.demurrageStart) <= new Date()
                            ? "text-red-600 font-medium"
                            : "text-orange-600"
                        }
                      >
                        {new Date(record.demurrageStart).toLocaleDateString()}
                      </div>
                      <div className="text-xs">
                        {new Date(record.demurrageStart) <= new Date()
                          ? "Active"
                          : "Upcoming"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">TBD</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="space-y-1">
                    {record.deliverToWarehouse ? (
                      <>
                        <div className="text-green-600 font-medium">
                          ✓ Delivered
                        </div>
                        <div className="text-xs">
                          {new Date(
                            record.deliverToWarehouse
                          ).toLocaleDateString()}
                        </div>
                        {record.billed ? (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-600"
                          >
                            Billed
                          </Badge>
                        ) : (
                          <Badge
                            variant="default"
                            className="text-xs bg-blue-600"
                          >
                            Ready to Bill
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-gray-400">Pending Delivery</div>
                        {record.assessment ? (
                          <div className="text-xs text-green-600">
                            Assessed:{" "}
                            {new Date(record.assessment).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-xs text-orange-600">
                            Assessment Pending
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>

                {/* Status Indicators */}
                <TableCell>
                  <div className="space-y-1">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${delayInfo.color} text-center`}
                    >
                      {delayInfo.status === "delayed" &&
                        `🚨 DELAYED ${delayInfo.days}d`}
                      {delayInfo.status === "nearly_delayed" &&
                        `⚠️ DEMURRAGE ${delayInfo.days}d`}
                      {delayInfo.status === "approaching_demurrage" &&
                        `⏰ ${delayInfo.days}d to Demurrage`}
                      {delayInfo.status === "arrival_delayed" &&
                        `📅 Late ${delayInfo.days}d`}
                      {delayInfo.status === "ready_billing" &&
                        "💰 READY TO BILL"}
                      {delayInfo.status === "billed" && "✅ COMPLETED"}
                      {delayInfo.status === "on_track" && "✅ ON TRACK"}
                    </div>
                    {(delayInfo.priority === "high" ||
                      delayInfo.priority === "medium") && (
                      <div className="text-xs text-center font-medium">
                        {delayInfo.priority === "high"
                          ? "HIGH PRIORITY"
                          : "ATTENTION NEEDED"}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateRecord(record)}
                      className="h-8 w-8 p-0"
                      title="Edit booking"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusTrack(record.bookingNo)}
                      className="h-8 w-8 p-0"
                      title="Track status"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  // Helper function to get domestic delivery status
  const getDomesticDelayStatus = (record: any) => {
    const today = new Date();
    const eta =
      record.eta || record.estimatedDeliveryDate
        ? new Date(record.eta || record.estimatedDeliveryDate)
        : null;
    const delivered = record.dateReceived || record.deliverToWarehouse;
    const billed = record.billed || record.billingsStatus === "completed";

    // If delivered and billed
    if (delivered && billed) {
      return {
        status: "completed",
        priority: "low",
        color: "bg-green-100 text-green-800",
        label: "✅ COMPLETED",
      };
    }

    // If delivered but not billed
    if (delivered && !billed) {
      return {
        status: "ready_billing",
        priority: "medium",
        color: "bg-blue-100 text-blue-800",
        label: "💰 READY TO BILL",
      };
    }

    // Check for delays
    if (eta && eta < today && !delivered) {
      const delayDays = Math.floor(
        (today.getTime() - eta.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (delayDays > 2) {
        return {
          status: "delayed",
          priority: "high",
          color: "bg-red-100 text-red-800",
          label: `🚨 DELAYED ${delayDays}d`,
          days: delayDays,
        };
      } else if (delayDays > 0) {
        return {
          status: "nearly_delayed",
          priority: "medium",
          color: "bg-orange-100 text-orange-800",
          label: `⚠️ LATE ${delayDays}d`,
          days: delayDays,
        };
      }
    }

    // Check if approaching deadline
    if (eta) {
      const daysUntilEta = Math.floor(
        (eta.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilEta <= 1 && daysUntilEta >= 0) {
        return {
          status: "approaching_deadline",
          priority: "medium",
          color: "bg-yellow-100 text-yellow-800",
          label: daysUntilEta === 0 ? "⏰ DUE TODAY" : "⏰ DUE TOMORROW",
        };
      }
    }

    return {
      status: "on_track",
      priority: "low",
      color: "bg-gray-100 text-gray-800",
      label: "✅ ON TRACK",
    };
  };

  const renderDomesticTable = () => (
    <div className="overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedItems.length === monitoringData.length &&
                  monitoringData.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="min-w-[100px] font-semibold">
              Booking ID
            </TableHead>
            <TableHead className="min-w-[150px] font-semibold">
              Client & Service
            </TableHead>
            <TableHead className="min-w-[200px] font-semibold">
              Route & Transport
            </TableHead>
            <TableHead className="min-w-[180px] font-semibold">
              Status Progress
            </TableHead>
            <TableHead className="min-w-[140px] font-semibold">
              Priority Alert
            </TableHead>
            <TableHead className="min-w-[80px] font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monitoringData.map((record) => {
            const delayInfo = getDomesticDelayStatus(record);
            return (
              <TableRow
                key={record.id}
                className={`hover:bg-gray-50 ${
                  delayInfo.priority === "high"
                    ? "border-l-4 border-red-500"
                    : delayInfo.priority === "medium"
                      ? "border-l-4 border-orange-500"
                      : "border-l-4 border-transparent"
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(record.id)}
                    onCheckedChange={(checked) =>
                      handleItemSelect(record.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {record.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{record.clientName}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {record.serviceType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {record.origin} → {record.destination}
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <TruckIcon className="h-3 w-3" />

                      <span>{record.truckNumber || "TBD"}</span>
                      <span className="text-gray-400">•</span>
                      <span>{record.driverName || "TBD"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DomesticStatusIndicators record={record} />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${delayInfo.color} text-center`}
                    >
                      {delayInfo.label}
                    </div>
                    {(delayInfo.priority === "high" ||
                      delayInfo.priority === "medium") && (
                      <div className="text-xs text-center font-medium">
                        {delayInfo.priority === "high"
                          ? "HIGH PRIORITY"
                          : "ATTENTION NEEDED"}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateRecord(record)}
                      className="h-8 w-8 p-0"
                      title="Edit booking"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusTrack(record.id)}
                      className="h-8 w-8 p-0"
                      title="Track status"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {type === "import" ? (
              <ShipIcon className="h-5 w-5" />
            ) : (
              <TruckIcon className="h-5 w-5" />
            )}
            <span>{type === "import" ? "Import" : "Domestic"} Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {type === "import" ? renderImportTable() : renderDomesticTable()}
        </CardContent>
      </Card>

      {/* Import Monitoring Form */}
      {formType === "import" && selectedRecord && (
        <ImportMonitoringForm
          booking={selectedRecord}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {/* Trucking Monitoring Form */}
      {formType === "trucking" && selectedRecord && (
        <TruckingMonitoringForm
          booking={selectedRecord}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {/* Forwarding Monitoring Form */}
      {formType === "forwarding" && selectedRecord && (
        <ForwardingMonitoringForm
          booking={selectedRecord}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}
