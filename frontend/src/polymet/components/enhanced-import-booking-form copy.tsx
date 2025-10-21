import React, { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SaveIcon,
  CheckIcon,
  FileTextIcon,
  ShipIcon,
  PackageIcon,
  UserIcon,
  MapPinIcon,
  UploadIcon,
  FileIcon,
  XIcon,
  AlertCircleIcon,
  InfoIcon,
  CopyIcon,
  RefreshCwIcon,
  PrinterIcon,
  DownloadIcon,
} from "lucide-react";
import {
  serviceTypes,
  shippingLines,
  ports,
  bookings,
} from "@/polymet/data/logistics-data";
import { ContainerManagement } from "@/polymet/components/container-management";
import { SimpleDocumentUpload } from "@/polymet/components/simple-document-upload";

interface EnhancedImportBookingFormProps {
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  onExport?: (data: any) => void;
  initialData?: any;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface Container {
  id: string;
  containerNumber: string;
  containerSize: string;
  sku: string;
  quantity: number;
  status:
    | "pending"
    | "in_transit"
    | "arrived"
    | "customs_clearance"
    | "released"
    | "delivered";
  remarks?: string;
}

export function EnhancedImportBookingForm({
  onSubmit,
  onSave,
  onPrint,
  onExport,
  initialData = {},
}: EnhancedImportBookingFormProps) {
  const [formData, setFormData] = useState({
    // Auto-generated fields
    bookingNo: initialData.bookingNo || `BK-${Date.now()}`,
    quotationNo: initialData.quotationNo || "",

    // Basic Information
    serviceType: initialData.serviceType || "",
    consignee: initialData.consignee || "",
    address: initialData.address || "",
    contactPerson: initialData.contactPerson || "",
    position: initialData.position || "",
    contactNo: initialData.contactNo || "",
    invoiceNo: initialData.invoiceNo || "",
    blReferenceNo: initialData.blReferenceNo || "",

    // Shipment Details
    portOfDischarge: initialData.portOfDischarge || "",
    shippingLines: initialData.shippingLines || "",
    containerNo: initialData.containerNo || "",
    containerSize: initialData.containerSize || "",
    sku: initialData.sku || "",
    qty: initialData.qty || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showValidation, setShowValidation] = useState(false);
  const [containers, setContainers] = useState<Container[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== field)
    );
  };

  // Validation function
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.serviceType) {
      errors.push({
        field: "serviceType",
        message: "Service type is required",
      });
    }
    if (!formData.consignee) {
      errors.push({ field: "consignee", message: "Consignee is required" });
    }
    if (!formData.portOfDischarge) {
      errors.push({
        field: "portOfDischarge",
        message: "Port of discharge is required",
      });
    }
    if (!formData.shippingLines) {
      errors.push({
        field: "shippingLines",
        message: "Shipping line is required",
      });
    }

    return errors;
  };

  // Handle uploaded files change
  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  // Auto-fill from quotation
  const handleQuotationChange = (quotationId: string) => {
    handleInputChange("quotationNo", quotationId);

    // Simulate loading quotation data
    if (quotationId === "QT-2024-001") {
      setFormData((prev) => ({
        ...prev,
        quotationNo: quotationId,
        consignee: "ABC Trading Corp",
        address: "123 Business District, Makati City",
        contactPerson: "John Smith",
        position: "Operations Manager",
        contactNo: "+63 2 8123 4567",
        serviceType: "import_brokerage",
      }));
    }
  };

  // Copy booking number to clipboard
  const copyBookingNumber = async () => {
    try {
      await navigator.clipboard.writeText(formData.bookingNo);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy booking number");
    }
  };

  // Generate new booking number
  const generateNewBookingNumber = () => {
    const newBookingNo = `BK-${Date.now()}`;
    handleInputChange("bookingNo", newBookingNo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      const submissionData = {
        ...formData,
        containers,
        uploadedFiles,
        submissionDate: new Date().toISOString(),
      };
      onSubmit?.(submissionData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      const draftData = {
        ...formData,
        containers,
        uploadedFiles,
        lastSaved: new Date().toISOString(),
        status: "draft",
      };
      onSave?.(draftData);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const printData = {
      ...formData,
      containers,
      uploadedFiles,
      printDate: new Date().toISOString(),
    };
    onPrint?.(printData);
  };

  const handleExport = () => {
    const exportData = {
      ...formData,
      containers,
      uploadedFiles,
      exportDate: new Date().toISOString(),
    };
    onExport?.(exportData);
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Validation Alert */}
        {showValidation && validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />

            <AlertDescription>
              Please fix the following errors:
              <ul className="mt-2 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Import Booking Form
            </h2>
            <p className="text-muted-foreground">
              Create comprehensive import booking with all required details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {formData.bookingNo}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyBookingNumber}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy booking number</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateNewBookingNumber}
                >
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate new booking number</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Auto-generated and basic booking details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingNo">Booking No *</Label>
                <Input
                  id="bookingNo"
                  value={formData.bookingNo}
                  disabled
                  className="bg-muted"
                />

                <p className="text-xs text-muted-foreground">Auto-generated</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quotationNo">
                  Quotation No
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="inline h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select an approved quotation to auto-fill form data</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  value={formData.quotationNo}
                  onValueChange={handleQuotationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Load approved quotation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QT-2024-001">
                      QT-2024-001 - ABC Trading Corp (Import Brokerage)
                    </SelectItem>
                    <SelectItem value="QT-2024-002">
                      QT-2024-002 - XYZ Manufacturing (Import Forwarding)
                    </SelectItem>
                    <SelectItem value="QT-2024-003">
                      QT-2024-003 - Global Imports Ltd (Import Brokerage)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    handleInputChange("serviceType", value)
                  }
                >
                  <SelectTrigger
                    className={
                      validationErrors.some((e) => e.field === "serviceType")
                        ? "border-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes
                      .filter((st) => st.category === "import")
                      .map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {validationErrors.find((e) => e.field === "serviceType") && (
                  <p className="text-sm text-destructive">
                    {
                      validationErrors.find((e) => e.field === "serviceType")
                        ?.message
                    }
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consignee Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Consignee Information
            </CardTitle>
            <CardDescription>Client and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consignee">Consignee *</Label>
                <Select
                  value={formData.consignee}
                  onValueChange={(value) =>
                    handleInputChange("consignee", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Load approved quotation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABC Trading Corp">
                      ABC Trading Corp
                    </SelectItem>
                    <SelectItem value="XYZ Manufacturing">
                      XYZ Manufacturing
                    </SelectItem>
                    <SelectItem value="Global Imports Ltd">
                      Global Imports Ltd
                    </SelectItem>
                    <SelectItem value="Pacific Trading Co">
                      Pacific Trading Co
                    </SelectItem>
                    <SelectItem value="Metro Logistics Inc">
                      Metro Logistics Inc
                    </SelectItem>
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
                <Label htmlFor="contactNo">Contact No</Label>
                <Input
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={(e) =>
                    handleInputChange("contactNo", e.target.value)
                  }
                  placeholder="Load approved quotation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNo">Invoice No</Label>
                <Input
                  id="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={(e) =>
                    handleInputChange("invoiceNo", e.target.value)
                  }
                  placeholder="Enter invoice number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blReferenceNo">BL Reference No</Label>
              <Input
                id="blReferenceNo"
                value={formData.blReferenceNo}
                onChange={(e) =>
                  handleInputChange("blReferenceNo", e.target.value)
                }
                placeholder="Enter B/L reference number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipment Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShipIcon className="h-5 w-5" />
              Shipment Details
            </CardTitle>
            <CardDescription>
              Transportation and cargo information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portOfDischarge">Port of Discharge</Label>
                <Select
                  value={formData.portOfDischarge}
                  onValueChange={(value) =>
                    handleInputChange("portOfDischarge", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select port" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.id}>
                        {port.name} ({port.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingLines">Shipping Lines</Label>
                <Select
                  value={formData.shippingLines}
                  onValueChange={(value) =>
                    handleInputChange("shippingLines", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping line" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingLines.map((line) => (
                      <SelectItem key={line.id} value={line.id}>
                        {line.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Container Management Section */}
        <ContainerManagement
          containers={containers}
          onContainersChange={setContainers}
        />

        {/* Document Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5" />
              Document Upload
            </CardTitle>
            <CardDescription>
              Upload required shipping and customs documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleDocumentUpload
              files={uploadedFiles}
              onFilesChange={handleFilesChange}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              disabled={isLoading}
            >
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={isLoading}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              <SaveIcon className="mr-2 h-4 w-4" />

              {isLoading ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px]"
            >
              <CheckIcon className="mr-2 h-4 w-4" />

              {isLoading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
}
