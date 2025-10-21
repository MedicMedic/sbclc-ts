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
import { TruckIcon } from "lucide-react";

interface TruckingMonitoringFormProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function TruckingMonitoringForm({
  booking,
  isOpen,
  onClose,
  onSave,
}: TruckingMonitoringFormProps) {
  const [formData, setFormData] = useState({
    dateLoaded: booking?.dateLoaded || "",
    estimatedArrival: booking?.estimatedArrival || "",
    rdd: booking?.rdd || "",
    dateReceived: booking?.dateReceived || "",
    status: booking?.status || "pending",
    billingsStatus: booking?.billingsStatus || "pending",
    chopsignStatus: booking?.chopsignStatus || "pending",
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
      dateLoaded: booking?.dateLoaded || "",
      estimatedArrival: booking?.estimatedArrival || "",
      rdd: booking?.rdd || "",
      dateReceived: booking?.dateReceived || "",
      status: booking?.status || "pending",
      billingsStatus: booking?.billingsStatus || "pending",
      chopsignStatus: booking?.chopsignStatus || "pending",
      remarks: booking?.remarks || "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold">
            <TruckIcon className="h-5 w-5" />

            <span>Trucking Status Update - {booking?.id}</span>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {booking?.client} | {booking?.pickup} → {booking?.delivery}
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
                  <span className="font-medium">Truck Number:</span>{" "}
                  {booking?.truckNumber}
                </div>
                <div>
                  <span className="font-medium">Driver:</span>{" "}
                  {booking?.driverName}
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
                  <Label htmlFor="dateLoaded" className="text-sm font-medium">
                    Date Loaded
                  </Label>
                  <Input
                    id="dateLoaded"
                    type="date"
                    value={formData.dateLoaded}
                    onChange={(e) =>
                      handleInputChange("dateLoaded", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="estimatedArrival"
                    className="text-sm font-medium"
                  >
                    Estimated Arrival
                  </Label>
                  <Input
                    id="estimatedArrival"
                    type="date"
                    value={formData.estimatedArrival}
                    onChange={(e) =>
                      handleInputChange("estimatedArrival", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rdd" className="text-sm font-medium">
                    RDD (Required Delivery Date)
                  </Label>
                  <Input
                    id="rdd"
                    type="date"
                    value={formData.rdd}
                    onChange={(e) => handleInputChange("rdd", e.target.value)}
                    className="mt-1"
                  />
                </div>
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
              </div>

              {/* Status Dropdowns */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="loaded">Loaded</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
