import React, { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ShipIcon } from "lucide-react";
import { ContainerReleaseTracking } from "@/polymet/components/container-release-tracking";

interface ImportMonitoringFormProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ImportMonitoringForm({
  booking,
  isOpen,
  onClose,
  onSave,
}: ImportMonitoringFormProps) {
  const [formData, setFormData] = useState({
    // Basic booking info (read-only)
    bookingId: booking?.id || "",
    blNumber: booking?.blNumber || "",
    consignee: booking?.consignee || "",
    vessel: booking?.vessel || "",
    voyage: booking?.voyage || "",

    // Status
    status: booking?.status || "pending",

    // Date fields from reference image
    eta: booking?.eta || "",
    ata: booking?.ata || "",
    storageStart: booking?.storageStart || "",
    demurrageStart: booking?.demurrageStart || "",
    origDocsReceived: booking?.origDocsReceived || "",
    bocEntry: booking?.bocEntry || "",
    assessment: booking?.assessment || "",
    dtDelivery: booking?.dtDelivery || "",

    // Additional fields
    remarks: booking?.remarks || "",
    lastUpdate: new Date().toISOString().split("T")[0],
    updatedBy: "Current User", // This would come from auth context
  });

  // Container data - loaded from booking or mock data
  const [containers, setContainers] = useState<any[]>([]);

  // Load container data when booking changes
  useEffect(() => {
    if (booking?.containers) {
      // If booking has containers, use them
      setContainers(
        booking.containers.map((container: any) => ({
          id: container.id || `container_${Date.now()}_${Math.random()}`,
          containerNumber:
            container.containerNumber || container.containerNo || "",
          containerSize: container.containerSize || container.size || "40ft",
          status: container.status || "pending",
          doReleased: container.doReleased || "",
          pulloutReport: container.pulloutFromPort || "",
          deliveryToWarehouse: container.deliverToWarehouse || "",
          gating: container.unloading || "",
          emptyPullout: container.emptyPullout || "",
          billed: container.billed || "",
          remarks: container.remarks || "",
        }))
      );
    } else {
      // Mock container data based on booking info
      const mockContainers = [
        {
          id: "container_001",
          containerNumber: booking?.containerNo || "MSKU1234567",
          containerSize: "40ft",
          status: "pending",
          doReleased: booking?.doReleased || "",
          pulloutReport: booking?.pulloutFromPort || "",
          deliveryToWarehouse: booking?.deliverToWarehouse || "",
          gating: booking?.unloading || "",
          emptyPullout: booking?.emptyPullout || "",
          billed: booking?.billed || "",
          remarks: "",
        },
      ];

      setContainers(mockContainers);
    }
  }, [booking]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      lastUpdate: new Date().toISOString().split("T")[0],
    }));
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      containers: containers,
    };
    onSave(saveData);
    onClose();
  };

  const handleContainersChange = (updatedContainers: any[]) => {
    setContainers(updatedContainers);
  };

  const handleCancel = () => {
    onClose();
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_transit", label: "In Transit" },
    { value: "arrived", label: "Arrived" },
    { value: "customs_clearance", label: "Customs Clearance" },
    { value: "documents_ready", label: "Documents Ready" },
    { value: "ready_for_pickup", label: "Ready for Pickup" },
    { value: "delivered", label: "Delivered" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "delayed", label: "Delayed" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center space-x-3 text-2xl font-bold">
            <ShipIcon className="h-7 w-7 text-blue-600" />

            <span>Import Monitoring - Update Status & Dates</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Booking Information (Read-only) */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Booking ID
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                    {formData.bookingId}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    BL Number
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                    {formData.blNumber}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Consignee
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                    {formData.consignee}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Vessel
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                    {formData.vessel}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Voyage
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                    {formData.voyage}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Fields - Based on Reference Image */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Timeline & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="eta"
                    className="text-sm font-semibold text-gray-700"
                  >
                    ETA
                  </Label>
                  <Input
                    id="eta"
                    type="date"
                    value={formData.eta}
                    onChange={(e) => handleInputChange("eta", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="ata"
                    className="text-sm font-semibold text-gray-700"
                  >
                    ATA
                  </Label>
                  <Input
                    id="ata"
                    type="date"
                    value={formData.ata}
                    onChange={(e) => handleInputChange("ata", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="storageStart"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Storage Start
                  </Label>
                  <Input
                    id="storageStart"
                    type="date"
                    value={formData.storageStart}
                    onChange={(e) =>
                      handleInputChange("storageStart", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="demurrageStart"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Demurrage Start
                  </Label>
                  <Input
                    id="demurrageStart"
                    type="date"
                    value={formData.demurrageStart}
                    onChange={(e) =>
                      handleInputChange("demurrageStart", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="origDocsReceived"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Orig Docs Received
                  </Label>
                  <Input
                    id="origDocsReceived"
                    type="date"
                    value={formData.origDocsReceived}
                    onChange={(e) =>
                      handleInputChange("origDocsReceived", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bocEntry"
                    className="text-sm font-semibold text-gray-700"
                  >
                    BOC Entry
                  </Label>
                  <Input
                    id="bocEntry"
                    type="date"
                    value={formData.bocEntry}
                    onChange={(e) =>
                      handleInputChange("bocEntry", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="assessment"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Assessment
                  </Label>
                  <Input
                    id="assessment"
                    type="date"
                    value={formData.assessment}
                    onChange={(e) =>
                      handleInputChange("assessment", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="dtDelivery"
                    className="text-sm font-semibold text-gray-700"
                  >
                    DT Delivery
                  </Label>
                  <Input
                    id="dtDelivery"
                    type="date"
                    value={formData.dtDelivery}
                    onChange={(e) =>
                      handleInputChange("dtDelivery", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="doReleased"
                    className="text-sm font-semibold text-gray-700"
                  >
                    DO Released
                  </Label>
                  <Input
                    id="doReleased"
                    type="date"
                    value={formData.doReleased}
                    onChange={(e) =>
                      handleInputChange("doReleased", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="pulloutFromPort"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Pullout from Port
                  </Label>
                  <Input
                    id="pulloutFromPort"
                    type="date"
                    value={formData.pulloutFromPort}
                    onChange={(e) =>
                      handleInputChange("pulloutFromPort", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="deliverToWarehouse"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Deliver to Warehouse
                  </Label>
                  <Input
                    id="deliverToWarehouse"
                    type="date"
                    value={formData.deliverToWarehouse}
                    onChange={(e) =>
                      handleInputChange("deliverToWarehouse", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="unloading"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Unloading
                  </Label>
                  <Input
                    id="unloading"
                    type="date"
                    value={formData.unloading}
                    onChange={(e) =>
                      handleInputChange("unloading", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="emptyPullout"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Empty Pullout
                  </Label>
                  <Input
                    id="emptyPullout"
                    type="date"
                    value={formData.emptyPullout}
                    onChange={(e) =>
                      handleInputChange("emptyPullout", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="billed"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Billed
                  </Label>
                  <Input
                    id="billed"
                    type="date"
                    value={formData.billed}
                    onChange={(e) =>
                      handleInputChange("billed", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Container Release & Delivery Tracking */}
          <ContainerReleaseTracking
            containers={containers}
            onContainersChange={handleContainersChange}
          />

          {/* Additional Information */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="remarks"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) =>
                      handleInputChange("remarks", e.target.value)
                    }
                    placeholder="Enter any additional remarks or notes..."
                    rows={4}
                    className="text-base resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Last Update
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                      {formData.lastUpdate}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Updated By
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border text-base font-medium">
                      {formData.updatedBy}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-end space-x-4 pt-6 mt-8 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-12 px-8 text-base font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base font-medium"
          >
            Save Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
