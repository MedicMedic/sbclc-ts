import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipIcon } from "lucide-react";

interface ForwardingMonitoringFormProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ForwardingMonitoringForm({
  booking,
  isOpen,
  onClose,
  onSave,
}: ForwardingMonitoringFormProps) {
  const [formData, setFormData] = useState({
    pickupDate: booking?.pickupDate || "",
    estimatedTimeDeparture: booking?.estimatedTimeDeparture || "",
    actualTimeDeparture: booking?.actualTimeDeparture || "",
    estimatedTimeArrival: booking?.estimatedTimeArrival || "",
    actualTimeArrival: booking?.actualTimeArrival || "",
    estimatedDeliveryDate: booking?.estimatedDeliveryDate || "",
    dateReceived: booking?.dateReceived || "",
    podDate: booking?.podDate || "",
    chopsignStatus: booking?.chopsignStatus || "pending",
    billingsStatus: booking?.billingsStatus || "pending",
    remarks: booking?.remarks || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...booking,
      ...formData,
      lastUpdate: new Date().toLocaleString(),
      updatedBy: "Current User",
    };
    onSave(updatedData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      pickupDate: booking?.pickupDate || "",
      estimatedTimeDeparture: booking?.estimatedTimeDeparture || "",
      actualTimeDeparture: booking?.actualTimeDeparture || "",
      estimatedTimeArrival: booking?.estimatedTimeArrival || "",
      actualTimeArrival: booking?.actualTimeArrival || "",
      estimatedDeliveryDate: booking?.estimatedDeliveryDate || "",
      dateReceived: booking?.dateReceived || "",
      podDate: booking?.podDate || "",
      chopsignStatus: booking?.chopsignStatus || "pending",
      billingsStatus: booking?.billingsStatus || "pending",
      remarks: booking?.remarks || "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold">
            <ShipIcon className="h-5 w-5" />

            <span>Forwarding Status Update - {booking?.id}</span>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {booking?.client} | {booking?.origin} → {booking?.destination}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Booking ID:</span> {booking?.id}
                </div>
                <div>
                  <span className="font-medium">Client:</span> {booking?.client}
                </div>
                <div>
                  <span className="font-medium">Origin:</span> {booking?.origin}
                </div>
                <div>
                  <span className="font-medium">Destination:</span>{" "}
                  {booking?.destination}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">
                Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pickup and Departure */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate" className="text-sm font-medium">
                    Pickup Date
                  </Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) =>
                      handleInputChange("pickupDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="estimatedTimeDeparture"
                    className="text-sm font-medium"
                  >
                    Estimated Time Departure
                  </Label>
                  <Input
                    id="estimatedTimeDeparture"
                    type="date"
                    value={formData.estimatedTimeDeparture}
                    onChange={(e) =>
                      handleInputChange(
                        "estimatedTimeDeparture",
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="actualTimeDeparture"
                    className="text-sm font-medium"
                  >
                    Actual Time Departure
                  </Label>
                  <Input
                    id="actualTimeDeparture"
                    type="date"
                    value={formData.actualTimeDeparture}
                    onChange={(e) =>
                      handleInputChange("actualTimeDeparture", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="estimatedTimeArrival"
                    className="text-sm font-medium"
                  >
                    Estimated Time Arrival
                  </Label>
                  <Input
                    id="estimatedTimeArrival"
                    type="date"
                    value={formData.estimatedTimeArrival}
                    onChange={(e) =>
                      handleInputChange("estimatedTimeArrival", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="actualTimeArrival"
                    className="text-sm font-medium"
                  >
                    Actual Time Arrival
                  </Label>
                  <Input
                    id="actualTimeArrival"
                    type="date"
                    value={formData.actualTimeArrival}
                    onChange={(e) =>
                      handleInputChange("actualTimeArrival", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="estimatedDeliveryDate"
                    className="text-sm font-medium"
                  >
                    Estimated Delivery Date
                  </Label>
                  <Input
                    id="estimatedDeliveryDate"
                    type="date"
                    value={formData.estimatedDeliveryDate}
                    onChange={(e) =>
                      handleInputChange("estimatedDeliveryDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Updates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">
                Status Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateReceived" className="text-sm font-medium">
                    Date Received
                  </Label>
                  <Input
                    id="dateReceived"
                    type="date"
                    value={formData.dateReceived}
                    onChange={(e) =>
                      handleInputChange("dateReceived", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="podDate" className="text-sm font-medium">
                    POD Date
                  </Label>
                  <Input
                    id="podDate"
                    type="date"
                    value={formData.podDate}
                    onChange={(e) =>
                      handleInputChange("podDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Status Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="chopsignStatus"
                    className="text-sm font-medium"
                  >
                    Chopsign Status
                  </Label>
                  <Select
                    value={formData.chopsignStatus}
                    onValueChange={(value) =>
                      handleInputChange("chopsignStatus", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select chopsign status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="signed">Signed</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="billingsStatus"
                    className="text-sm font-medium"
                  >
                    Billings Status
                  </Label>
                  <Select
                    value={formData.billingsStatus}
                    onValueChange={(value) =>
                      handleInputChange("billingsStatus", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select billing status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="billed">Billed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <Label htmlFor="remarks" className="text-sm font-medium">
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Add notes about status updates, issues, or additional information..."
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Last updated: {booking?.lastUpdate} by {booking?.updatedBy}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary">
                Save Update
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
