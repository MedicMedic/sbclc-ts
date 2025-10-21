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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SimpleDocumentUpload } from "@/polymet/components/simple-document-upload";
import {
  SaveIcon,
  SendIcon,
  TruckIcon,
  UserIcon,
  MapPinIcon,
  PackageIcon,
  FileTextIcon,
} from "lucide-react";
import { ports } from "@/polymet/data/logistics-data";

// Additional data for trucking form
const truckTypes = [
  { id: "6w", name: "6-Wheeler" },
  { id: "10w", name: "10-Wheeler" },
  { id: "12w", name: "12-Wheeler" },
  { id: "trailer", name: "Trailer Truck" },
  { id: "container", name: "Container Van" },
];

const suppliers = [
  { id: "s1", name: "SBCLC Internal Fleet" },
  { id: "s2", name: "FastTrack Logistics" },
  { id: "s3", name: "Metro Trucking Services" },
  { id: "s4", name: "Global Transport Solutions" },
  { id: "s5", name: "City Express Trucking" },
];

const clients = [
  { id: "c1", name: "ABC Trading Corp" },
  { id: "c2", name: "XYZ Manufacturing" },
  { id: "c3", name: "Global Freight Solutions" },
  { id: "c4", name: "Metro Industrial Supply" },
  { id: "c5", name: "Pacific Logistics Inc" },
];

const uomOptions = [
  { id: "pcs", name: "Pieces" },
  { id: "kg", name: "Kilograms" },
  { id: "cbm", name: "Cubic Meters" },
  { id: "tons", name: "Tons" },
  { id: "pallets", name: "Pallets" },
];

const skuOptions = [
  { id: "sku1", name: "PROD-001 - Electronics" },
  { id: "sku2", name: "PROD-002 - Textiles" },
  { id: "sku3", name: "PROD-003 - Machinery" },
  { id: "sku4", name: "PROD-004 - Food Products" },
  { id: "sku5", name: "PROD-005 - Raw Materials" },
];

interface TruckingBookingFormProps {
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  initialData?: any;
  className?: string;
}

export function TruckingBookingForm({
  onSubmit,
  onSave,
  initialData,
  className,
}: TruckingBookingFormProps) {
  const [formData, setFormData] = useState({
    bookingNo: initialData?.bookingNo || "",
    accountName: initialData?.accountName || "",
    address: initialData?.address || "",
    contactPerson: initialData?.contactPerson || "",
    position: initialData?.position || "",
    contactNo: initialData?.contactNo || "",
    supplierName: initialData?.supplierName || "",
    truckType: initialData?.truckType || "",
    plateNo: initialData?.plateNo || "",
    subTruckerName: initialData?.subTruckerName || "",
    driverHelper: initialData?.driverHelper || "",
    contactNoDriver: initialData?.contactNoDriver || "",
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    sku: initialData?.sku || "",
    uom: initialData?.uom || "",
    quantity: initialData?.quantity || "",
    remarks: initialData?.remarks || "",
    ...initialData,
  });

  const [documents, setDocuments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        documents,
        type: "domestic_trucking",
        submittedAt: new Date().toISOString(),
      };

      await onSubmit?.(submissionData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);

    try {
      const draftData = {
        ...formData,
        documents,
        type: "domestic_trucking",
        status: "draft",
        savedAt: new Date().toISOString(),
      };

      await onSave?.(draftData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilesChange = (files: any[]) => {
    setDocuments(files);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TruckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Trucking Booking Form</CardTitle>
                <CardDescription>
                  Create a new domestic trucking booking with complete details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />

              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingNo">Booking No.</Label>
                <Input
                  id="bookingNo"
                  value={formData.bookingNo}
                  onChange={(e) =>
                    handleInputChange("bookingNo", e.target.value)
                  }
                  placeholder="Auto-generated"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Select
                  value={formData.accountName}
                  onValueChange={(value) =>
                    handleInputChange("accountName", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Load approved quotation"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                  placeholder="Load approved quotation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="Load approved quotation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact No.</Label>
                <Input
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={(e) =>
                    handleInputChange("contactNo", e.target.value)
                  }
                  placeholder="Load approved quotation"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Truck & Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TruckIcon className="w-5 h-5" />

              <span>Truck & Driver Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name *</Label>
                <Select
                  value={formData.supplierName}
                  onValueChange={(value) =>
                    handleInputChange("supplierName", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="truckType">Truck Type *</Label>
                <Select
                  value={formData.truckType}
                  onValueChange={(value) =>
                    handleInputChange("truckType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select truck type" />
                  </SelectTrigger>
                  <SelectContent>
                    {truckTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNo">Plate No. *</Label>
                <Input
                  id="plateNo"
                  value={formData.plateNo}
                  onChange={(e) => handleInputChange("plateNo", e.target.value)}
                  placeholder="Enter plate number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subTruckerName">Sub-trucker Name</Label>
                <Input
                  id="subTruckerName"
                  value={formData.subTruckerName}
                  onChange={(e) =>
                    handleInputChange("subTruckerName", e.target.value)
                  }
                  placeholder="Enter sub-trucker name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverHelper">Driver/Helper *</Label>
                <Input
                  id="driverHelper"
                  value={formData.driverHelper}
                  onChange={(e) =>
                    handleInputChange("driverHelper", e.target.value)
                  }
                  placeholder="Enter driver/helper name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNoDriver">Contact No.</Label>
                <Input
                  id="contactNoDriver"
                  value={formData.contactNoDriver}
                  onChange={(e) =>
                    handleInputChange("contactNoDriver", e.target.value)
                  }
                  placeholder="Driver contact number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5" />

              <span>Shipment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin *</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) => handleInputChange("origin", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.name}>
                        {port.name}
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
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.name}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Select
                  value={formData.sku}
                  onValueChange={(value) => handleInputChange("sku", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select SKU" />
                  </SelectTrigger>
                  <SelectContent>
                    {skuOptions.map((sku) => (
                      <SelectItem key={sku.id} value={sku.name}>
                        {sku.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uom">UOM</Label>
                <Select
                  value={formData.uom}
                  onValueChange={(value) => handleInputChange("uom", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    {uomOptions.map((uom) => (
                      <SelectItem key={uom.id} value={uom.name}>
                        {uom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remarks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileTextIcon className="w-5 h-5" />

              <span>Additional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder="Enter any additional remarks or notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileTextIcon className="w-5 h-5" />

              <span>Document Upload</span>
            </CardTitle>
            <CardDescription>
              Upload documents related to this trucking booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleDocumentUpload
              files={documents}
              onFilesChange={handleFilesChange}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                * Required fields must be filled before submission
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-gray-300 rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4 mr-2" />
                      Create Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
