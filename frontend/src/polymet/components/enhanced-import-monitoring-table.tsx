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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditIcon, ShipIcon } from "lucide-react";
import { bookings } from "@/polymet/data/logistics-data";

interface EnhancedImportMonitoringTableProps {
  data?: any[];
}

// Enhanced monitoring data structure matching the reference image
const getEnhancedImportMonitoringData = () => {
  return bookings
    .filter((booking) => booking.type.includes("import"))
    .map((booking, index) => ({
      id: booking.id,
      seq: (index + 1).toString().padStart(3, "0"),
      blReference:
        booking.billOfLading || `H${Math.random().toString().slice(2, 10)}`,
      portOfDischarge: booking.portOfDischarge || "DAVAO",
      shippingLines: booking.shippingLine || "YANG MING",
      containerQty: booking.containers?.length || 1,
      containerSize: booking.containers?.[0]?.containerSize || "20ft",
      sku:
        booking.containers?.[0]?.sku ||
        `WIZACT${Math.random().toString().slice(2, 4)}`,
      qty:
        booking.containers?.[0]?.quantity ||
        Math.floor(Math.random() * 9000) + 1000 ||
        0,
      eta: booking.eta || "2024-01-20",
      ata: booking.ata || "2024-01-21",
      storageStart: booking.storageStart || "2024-01-21",
      demurrageStart: booking.demurrageStart || "2024-01-22",
      origDocsReceived: booking.origDocsReceived || "2024-01-21",
      bocEntry: booking.bocEntry || "2024-01-21",
      assessment: booking.assessment || "2024-01-22",
      dtDebiting: booking.dtDebiting || "2024-01-22",
      doReleased: booking.doReleased || "2024-01-23",
      pulloutFromPort: booking.pulloutFromPort || "2024-01-23",
      deliveryWhse: booking.deliveryWhse || "2024-01-24",
      unloading: booking.unloading || "2024-01-24",
      emptyPullOut: booking.emptyPullOut || "2024-01-25",
      billed: booking.billed || "2024-01-25",
      status:
        booking.status ||
        "1-R-2 ENTRY AT BOC ENTRY UNDER ORANGE LANE WAITING FOR X-RAY IMAGE TO BE FORWARDED AT ASSESSMENT",
      consignee: booking.consignee,
      vessel: booking.vessel || "MAERSK SHANGHAI",
      voyage: booking.voyage || "024E",
      customsStatus: booking.customsStatus || "lodged",
      deliveryStatus: booking.deliveryStatus || "pending",
      lastUpdate: (() => {
        try {
          return booking.lastUpdate || new Date().toLocaleString();
        } catch (error) {
          return "N/A";
        }
      })(),
      updatedBy: booking.updatedBy || "System",
      containers: booking.containers || [],
    }));
};

export function EnhancedImportMonitoringTable({
  data,
}: EnhancedImportMonitoringTableProps) {
  const [monitoringData, setMonitoringData] = useState(
    data || getEnhancedImportMonitoringData()
  );
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState<any>({});

  const getStatusBadge = (status: string) => {
    if (status.includes("ORANGE LANE") || status.includes("WAITING")) {
      return (
        <Badge variant="default" className="bg-orange-600 text-white text-xs">
          Processing
        </Badge>
      );
    }
    if (status.includes("ENTRY") || status.includes("BOC")) {
      return (
        <Badge variant="default" className="bg-blue-600 text-white text-xs">
          Entry
        </Badge>
      );
    }
    if (status.includes("DELIVERED") || status.includes("COMPLETED")) {
      return (
        <Badge variant="default" className="bg-green-600 text-white text-xs">
          Completed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        Pending
      </Badge>
    );
  };

  const handleUpdateRecord = (record: any) => {
    setSelectedRecord(record);
    setUpdateForm({ ...record });
    setShowUpdateDialog(true);
  };

  const handleSaveUpdate = () => {
    let currentDateTime;
    try {
      currentDateTime = new Date().toLocaleString();
    } catch (error) {
      currentDateTime = "N/A";
    }

    const updatedRecord = {
      ...updateForm,
      lastUpdate: currentDateTime,
      updatedBy: "Current User",
    };

    setMonitoringData(
      monitoringData.map((record) =>
        record.id === selectedRecord.id ? updatedRecord : record
      )
    );

    alert(`Import shipment ${selectedRecord.id} updated successfully!`);
    setShowUpdateDialog(false);
    setSelectedRecord(null);
    setUpdateForm({});
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/,/g, "");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShipIcon className="h-5 w-5" />

            <span>Import Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-yellow-100">
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[40px]">
                    Seq
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[100px]">
                    BL Reference
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Port of Discharge
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[100px]">
                    Shipping Lines
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Container qty
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[60px]">
                    SKU
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[60px]">
                    Qty
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    ETA
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    ATA
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Storage Start
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Demurrage Start
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[100px]">
                    Orig Docs Received from GSPI
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    BOC Entry
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Assessment
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    DT Debiting
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    DO released
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Pull-out from Port
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Delivery whse
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Unloading
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Empty Pull Out
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[60px]">
                    Billed
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[200px]">
                    STATUS
                  </TableHead>
                  <TableHead className="text-center font-bold text-black border border-gray-300 p-1 min-w-[80px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monitoringData.map((record, index) => (
                  <TableRow
                    key={record.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className="text-center border border-gray-300 p-1 font-medium">
                      {record.seq}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      <div className="font-medium">{record.blReference}</div>
                      <div className="text-gray-500 text-xs">
                        INV NO. {record.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {record.portOfDischarge}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {record.shippingLines}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      <div className="font-medium">{record.containerQty}</div>
                      <div className="text-xs text-gray-500">
                        x{record.containerSize}
                      </div>
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {record.sku}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {record.qty ? record.qty.toLocaleString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.eta)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.ata)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.storageStart)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.demurrageStart)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.origDocsReceived)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.bocEntry)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.assessment)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.dtDebiting)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.doReleased)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.pulloutFromPort)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.deliveryWhse)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.unloading)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.emptyPullOut)}
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      {formatDate(record.billed)}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-1 max-w-[200px]">
                      <div className="text-xs break-words">{record.status}</div>
                      <div className="mt-1">
                        {getStatusBadge(record.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center border border-gray-300 p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateRecord(record)}
                        className="h-6 w-6 p-0"
                      >
                        <EditIcon className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Update Import Shipment - {selectedRecord?.id}
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              {selectedRecord?.consignee} | BL: {selectedRecord?.blReference} |
              Vessel: {selectedRecord?.vessel}
            </div>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-3 text-primary">
                Basic Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="blReference" className="text-sm font-medium">
                    BL Reference
                  </Label>
                  <Input
                    id="blReference"
                    value={updateForm.blReference || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        blReference: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="portOfDischarge"
                    className="text-sm font-medium"
                  >
                    Port of Discharge
                  </Label>
                  <Input
                    id="portOfDischarge"
                    value={updateForm.portOfDischarge || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        portOfDischarge: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="shippingLines"
                    className="text-sm font-medium"
                  >
                    Shipping Lines
                  </Label>
                  <Input
                    id="shippingLines"
                    value={updateForm.shippingLines || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        shippingLines: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Container & Cargo Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-3 text-primary">
                Container & Cargo Information
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="containerQty" className="text-sm font-medium">
                    Container Quantity
                  </Label>
                  <Input
                    id="containerQty"
                    type="number"
                    value={updateForm.containerQty || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        containerQty: parseInt(e.target.value),
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sku" className="text-sm font-medium">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={updateForm.sku || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, sku: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qty" className="text-sm font-medium">
                    Quantity
                  </Label>
                  <Input
                    id="qty"
                    type="number"
                    value={updateForm.qty || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        qty: parseInt(e.target.value),
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="containerSize"
                    className="text-sm font-medium"
                  >
                    Container Size
                  </Label>
                  <Select
                    value={updateForm.containerSize || ""}
                    onValueChange={(value) =>
                      setUpdateForm({ ...updateForm, containerSize: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20ft">20ft</SelectItem>
                      <SelectItem value="40ft">40ft</SelectItem>
                      <SelectItem value="40ft_hc">40ft HC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Schedule & Dates */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-3 text-primary">
                Schedule & Important Dates
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="eta" className="text-sm font-medium">
                    ETA
                  </Label>
                  <Input
                    id="eta"
                    type="date"
                    value={updateForm.eta || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, eta: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ata" className="text-sm font-medium">
                    ATA
                  </Label>
                  <Input
                    id="ata"
                    type="date"
                    value={updateForm.ata || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, ata: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="storageStart" className="text-sm font-medium">
                    Storage Start
                  </Label>
                  <Input
                    id="storageStart"
                    type="date"
                    value={updateForm.storageStart || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        storageStart: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="demurrageStart"
                    className="text-sm font-medium"
                  >
                    Demurrage Start
                  </Label>
                  <Input
                    id="demurrageStart"
                    type="date"
                    value={updateForm.demurrageStart || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        demurrageStart: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Documentation & Processing */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-3 text-primary">
                Documentation & Processing
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label
                    htmlFor="origDocsReceived"
                    className="text-sm font-medium"
                  >
                    Orig Docs Received
                  </Label>
                  <Input
                    id="origDocsReceived"
                    type="date"
                    value={updateForm.origDocsReceived || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        origDocsReceived: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bocEntry" className="text-sm font-medium">
                    BOC Entry
                  </Label>
                  <Input
                    id="bocEntry"
                    type="date"
                    value={updateForm.bocEntry || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, bocEntry: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="assessment" className="text-sm font-medium">
                    Assessment
                  </Label>
                  <Input
                    id="assessment"
                    type="date"
                    value={updateForm.assessment || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        assessment: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dtDebiting" className="text-sm font-medium">
                    DT Debiting
                  </Label>
                  <Input
                    id="dtDebiting"
                    type="date"
                    value={updateForm.dtDebiting || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        dtDebiting: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Delivery & Operations */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-3 text-primary">
                Delivery & Operations
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="doReleased" className="text-sm font-medium">
                    DO Released
                  </Label>
                  <Input
                    id="doReleased"
                    type="date"
                    value={updateForm.doReleased || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        doReleased: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="pulloutFromPort"
                    className="text-sm font-medium"
                  >
                    Pull-out from Port
                  </Label>
                  <Input
                    id="pulloutFromPort"
                    type="date"
                    value={updateForm.pulloutFromPort || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        pulloutFromPort: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryWhse" className="text-sm font-medium">
                    Delivery Warehouse
                  </Label>
                  <Input
                    id="deliveryWhse"
                    type="date"
                    value={updateForm.deliveryWhse || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        deliveryWhse: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="unloading" className="text-sm font-medium">
                    Unloading
                  </Label>
                  <Input
                    id="unloading"
                    type="date"
                    value={updateForm.unloading || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        unloading: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="emptyPullOut" className="text-sm font-medium">
                    Empty Pull Out
                  </Label>
                  <Input
                    id="emptyPullOut"
                    type="date"
                    value={updateForm.emptyPullOut || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        emptyPullOut: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="billed" className="text-sm font-medium">
                    Billed
                  </Label>
                  <Input
                    id="billed"
                    type="date"
                    value={updateForm.billed || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, billed: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-3 text-primary">
                Status Information
              </h3>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Current Status
                </Label>
                <Textarea
                  id="status"
                  placeholder="Enter detailed status information..."
                  rows={3}
                  value={updateForm.status || ""}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, status: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Last updated: {selectedRecord?.lastUpdate} by{" "}
                {selectedRecord?.updatedBy}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveUpdate} className="bg-primary">
                  Save Update
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
