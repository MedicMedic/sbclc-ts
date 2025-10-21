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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveIcon, CheckIcon, FileTextIcon } from "lucide-react";
import { SimpleDocumentUpload } from "@/polymet/components/simple-document-upload";
import { ports } from "@/polymet/data/logistics-data";

interface ForwardingBookingFormProps {
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  initialData?: any;
  className?: string;
}

export function ForwardingBookingForm({
  onSubmit,
  onSave,
  initialData,
  className = "",
}: ForwardingBookingFormProps) {
  const [formData, setFormData] = useState({
    // Auto-generated fields
    bookingNo: initialData?.bookingNo || "",

    // Client Information
    accountName: initialData?.accountName || "",
    address: initialData?.address || "",
    contactPerson: initialData?.contactPerson || "",
    position: initialData?.position || "",
    contactNo: initialData?.contactNo || "",

    // Shipment Information
    shipmentLine: initialData?.shipmentLine || "",
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    containerNo: initialData?.containerNo || "",
    sealNo: initialData?.sealNo || "",
    quantity: initialData?.quantity || "",

    // Additional Information
    remarks: initialData?.remarks || "",

    ...initialData,
  });

  const [documents, setDocuments] = useState<any[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      documents,
      type: "forwarding",
      status: "submitted",
      submittedAt: new Date().toISOString(),
    };
    onSubmit?.(submissionData);
  };

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      documents,
      type: "forwarding",
      status: "draft",
      savedAt: new Date().toISOString(),
    };
    onSave?.(draftData);
  };

  const handleFilesChange = (files: any[]) => {
    setDocuments(files);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Forwarding Booking Form
            </h2>
            <p className="text-muted-foreground">
              Create a new domestic forwarding booking
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center gap-2"
            >
              <SaveIcon className="h-4 w-4" />
              Save Draft
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4" />
              Create Booking
            </Button>
          </div>
        </div>

        {/* Auto-Generated Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookingNo">Booking No. *</Label>
              <Input
                id="bookingNo"
                value={formData.bookingNo}
                onChange={(e) => handleInputChange("bookingNo", e.target.value)}
                placeholder="Auto-generated"
                className="bg-muted"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Contact details and company information
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) =>
                  handleInputChange("accountName", e.target.value)
                }
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) =>
                  handleInputChange("contactPerson", e.target.value)
                }
                placeholder="Enter contact person name"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete address"
                rows={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Enter position/title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact No. *</Label>
              <Input
                id="contactNo"
                value={formData.contactNo}
                onChange={(e) => handleInputChange("contactNo", e.target.value)}
                placeholder="Enter contact number"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Transportation and cargo details
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipmentLine">Shipment Line</Label>
              <Input
                id="shipmentLine"
                value={formData.shipmentLine}
                onChange={(e) =>
                  handleInputChange("shipmentLine", e.target.value)
                }
                placeholder="Enter shipping line"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="containerNo">Container No.</Label>
              <Input
                id="containerNo"
                value={formData.containerNo}
                onChange={(e) =>
                  handleInputChange("containerNo", e.target.value)
                }
                placeholder="Enter container number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Select
                value={formData.origin}
                onValueChange={(value) => handleInputChange("origin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select origin port" />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={port.name}>
                      {port.name} ({port.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Select
                value={formData.destination}
                onValueChange={(value) =>
                  handleInputChange("destination", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination port" />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={port.name}>
                      {port.name} ({port.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sealNo">Seal No.</Label>
              <Input
                id="sealNo"
                value={formData.sealNo}
                onChange={(e) => handleInputChange("sealNo", e.target.value)}
                placeholder="Enter seal number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
          </CardContent>
        </Card>

        {/* Remarks */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder="Enter any additional notes or special instructions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload documents related to this forwarding booking
            </p>
          </CardHeader>
          <CardContent>
            <SimpleDocumentUpload
              files={documents}
              onFilesChange={handleFilesChange}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Save Draft
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4" />
            Create Booking
          </Button>
        </div>
      </form>
    </div>
  );
}
