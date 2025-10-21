import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  PlusIcon,
  TrashIcon,
  FileTextIcon,
  PrinterIcon,
  SendIcon,
  DownloadIcon,
  SearchIcon,
  ShipIcon,
  TruckIcon,
  SaveIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  currency: string;
}

interface UnifiedServiceInvoiceFormProps {
  bookingId?: string;
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

export function UnifiedServiceInvoiceForm({
  bookingId,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: UnifiedServiceInvoiceFormProps) {
  const [billingMode, setBillingMode] = useState<"import" | "domestic">(
    "import"
  );
  const [showCostAnalysisSelector, setShowCostAnalysisSelector] =
    useState(false);
  const [selectedCostAnalysis, setSelectedCostAnalysis] = useState<string>("");
  const [isLoadingCostAnalysis, setIsLoadingCostAnalysis] = useState(false);

  const [items, setItems] = useState<ServiceItem[]>([
    {
      id: "1",
      description: "IMPORT DOCUMENTATION FEE",
      quantity: 1,
      unitPrice: 165.0,
      amount: 165.0,
      currency: "PHP",
    },
    {
      id: "2",
      description: "CONTAINER CLEANING",
      quantity: 1,
      unitPrice: 1550.0,
      amount: 1550.0,
      currency: "PHP",
    },
    {
      id: "3",
      description: "CONTAINER MAINTENANCE CHARGE",
      quantity: 1,
      unitPrice: 1100.0,
      amount: 1100.0,
      currency: "PHP",
    },
  ]);

  const [formData, setFormData] = useState({
    invoiceNumber: `SI-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    bookingId: bookingId || "",
    costAnalysisId: "",
    // Company Information
    companyName: "GENTLE SUPREME PHILIPPINES, INC.",
    companyAddress: "STANPAK BLDG. KM. 18 WEST SERVICE RD., PARANAQUE CITY",
    companyVat: "Vat Reg. 221-819-358-000",
    // Client Information
    clientName: "ABC Trading Corp",
    clientAddress: "123 Business District, Manila, Philippines",
    clientTIN: "123-456-789-000",
    // Shipment Information
    bookingReference: "PRO# 0140-25",
    containerInfo: "1x20FTR CONTAINER",
    blNumber: "ARM0403059",
    invoiceNo: "800035980",
    port: "MANILA PORT",
    billOfLading: "MAEU123456789",
    vessel: "MSC MAYA",
    voyage: "024E",
    // Financial Information
    currency: "PHP",
    exchangeRate: 56.5,
    vatRate: 12,
    terms: "Net 30 days",
    remarks: "",
    preparedBy: "Sarah Chen",
    preparedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  // Mock cost analyses data (for Import)
  const mockCostAnalyses = [
    {
      id: "CA-2024-001",
      bookingId: "BK-2024-001",
      clientName: "ABC Trading Corp",
      status: "approved",
      createdDate: "2024-01-15",
      nonReceiptedItems: [
        { description: "IMPORT DOCUMENTATION FEE", amount: 165.0 },
        { description: "CONTAINER CLEANING", amount: 1550.0 },
        { description: "CONTAINER MAINTENANCE CHARGE", amount: 1100.0 },
        { description: "LCL-FCL CHARGES AT DESTINATION", amount: 832.0 },
        { description: "CTC-EQUIPMENT IMBALANCE CHARGES", amount: 275.0 },
        { description: "OCR-OPERATION COST RECOVERY", amount: 110.0 },
        { description: "STORAGE FEE", amount: 3500.0 },
        { description: "HANDLING FEE", amount: 500.0 },
      ],
    },
    {
      id: "CA-2024-002",
      bookingId: "BK-2024-002",
      clientName: "XYZ Manufacturing",
      status: "approved",
      createdDate: "2024-01-18",
      nonReceiptedItems: [
        { description: "FORWARDING SERVICE", amount: 2500.0 },
        { description: "DOCUMENTATION FEE", amount: 300.0 },
      ],
    },
  ];

  // Mock domestic quotations data (for Domestic)
  const mockDomesticQuotations = [
    {
      id: "QT-DOM-2024-001",
      bookingId: "BK-DOM-2024-001",
      status: "approved",
      createdDate: "2024-01-15",
      approvedDate: "2024-01-18",
      clientName: "Metro Logistics Corp",
      serviceType: "Domestic Trucking",
      nonReceiptedItems: [
        { description: "TRUCKING SERVICE FEE", amount: 5000.0 },
        { description: "DOCUMENTATION FEE", amount: 300.0 },
        { description: "HANDLING CHARGES", amount: 800.0 },
      ],
    },
    {
      id: "QT-DOM-2024-002",
      bookingId: "BK-DOM-2024-002",
      status: "approved",
      createdDate: "2024-01-20",
      approvedDate: "2024-01-22",
      clientName: "Global Freight Solutions",
      serviceType: "Domestic Forwarding",
      nonReceiptedItems: [
        { description: "FORWARDING SERVICE", amount: 3500.0 },
        { description: "COORDINATION FEE", amount: 500.0 },
        { description: "WAREHOUSE HANDLING", amount: 1200.0 },
      ],
    },
  ];

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = subtotal * (formData.vatRate / 100);
  const total = subtotal + vatAmount;

  // Load cost analysis data (for Import)
  const loadCostAnalysis = (costAnalysisId: string) => {
    setIsLoadingCostAnalysis(true);

    const costAnalysis = mockCostAnalyses.find(
      (ca) => ca.id === costAnalysisId
    );

    if (costAnalysis) {
      // Update form data with cost analysis information
      setFormData((prev) => ({
        ...prev,
        costAnalysisId,
        bookingId: costAnalysis.bookingId,
        clientName: costAnalysis.clientName,
      }));

      // Update items with non-receipted items from cost analysis
      const newItems = costAnalysis.nonReceiptedItems.map((item, index) => ({
        id: (index + 1).toString(),
        description: item.description,
        quantity: 1,
        unitPrice: item.amount,
        amount: item.amount,
        currency: formData.currency,
      }));

      setItems(newItems);
      setSelectedCostAnalysis(costAnalysisId);
      setShowCostAnalysisSelector(false);

      alert(
        `Cost Analysis ${costAnalysisId} loaded successfully! Non-receipted items have been populated.`
      );
    }

    setTimeout(() => {
      setIsLoadingCostAnalysis(false);
    }, 500);
  };

  // Load domestic quotation data (for Domestic)
  const loadDomesticQuotation = (quotationId: string) => {
    setIsLoadingCostAnalysis(true);

    const quotation = mockDomesticQuotations.find((q) => q.id === quotationId);

    if (quotation) {
      // Update form data with quotation information
      setFormData((prev) => ({
        ...prev,
        costAnalysisId: quotationId,
        bookingId: quotation.bookingId,
        clientName: quotation.clientName,
      }));

      // Update items with non-receipted items from quotation
      const newItems = quotation.nonReceiptedItems.map((item, index) => ({
        id: (index + 1).toString(),
        description: item.description,
        quantity: 1,
        unitPrice: item.amount,
        amount: item.amount,
        currency: formData.currency,
      }));

      setItems(newItems);
      setSelectedCostAnalysis(quotationId);
      setShowCostAnalysisSelector(false);

      alert(
        `Domestic Quotation ${quotationId} loaded successfully! Non-receipted service items have been populated.`
      );
    }

    setTimeout(() => {
      setIsLoadingCostAnalysis(false);
    }, 500);
  };

  const clearLoadedData = () => {
    setSelectedCostAnalysis("");
    setFormData((prev) => ({
      ...prev,
      costAnalysisId: "",
    }));
    setItems([
      {
        id: "1",
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        currency: "PHP",
      },
    ]);
  };

  const addItem = () => {
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      currency: formData.currency,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ServiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate amount when quantity or unit price changes
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      items,
      subtotal,
      vatAmount,
      total,
      billingMode,
      status: "pending_approval",
    };
    onSubmit?.(data);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      items,
      subtotal,
      vatAmount,
      total,
      billingMode,
      status: "draft",
    };
    onSave?.(data);
  };

  const handlePrint = () => {
    const data = {
      ...formData,
      items,
      subtotal,
      vatAmount,
      total,
      billingMode,
    };

    onPrint?.(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Service Invoice
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Unified Service Invoice for Import and Domestic - Non-Receipted
                Services
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedCostAnalysis && (
                <Badge variant="secondary" className="text-sm">
                  Loaded from: {selectedCostAnalysis}
                </Badge>
              )}
              <Badge variant="outline" className="text-lg px-3 py-1">
                {formData.invoiceNumber}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Billing Mode Selector */}
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <Label className="text-lg font-semibold text-blue-900 mb-3 block">
              Select Billing Type
            </Label>
            <RadioGroup
              value={billingMode}
              onValueChange={(value: "import" | "domestic") => {
                setBillingMode(value);
                if (value === "domestic") {
                  clearLoadedData();
                }
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="import" id="import-si" />

                <Label
                  htmlFor="import-si"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ShipIcon className="h-4 w-4 text-blue-600" />

                  <span className="font-medium">Import Billing</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="domestic" id="domestic-si" />

                <Label
                  htmlFor="domestic-si"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TruckIcon className="h-4 w-4 text-orange-600" />

                  <span className="font-medium">Domestic Billing</span>
                </Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-600 mt-2">
              {billingMode === "import"
                ? "Import mode: Load non-receipted items from approved cost analysis"
                : "Domestic mode: Manual data entry (loading disabled)"}
            </p>
          </div>
        </CardContent>

        {/* Cost Analysis Loader - Only for Import */}
        {billingMode === "import" && (
          <CardContent>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-green-900">
                    Load from Cost Analysis
                  </h4>
                  <p className="text-sm text-green-700">
                    Import non-receipted items from approved cost analysis
                  </p>
                </div>
                <div className="flex gap-2">
                  {!showCostAnalysisSelector && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCostAnalysisSelector(true)}
                      className="bg-white"
                    >
                      <SearchIcon className="h-4 w-4 mr-2" />
                      Load Cost Analysis
                    </Button>
                  )}
                  {selectedCostAnalysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearLoadedData}
                      className="bg-white text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Clear Loaded Data
                    </Button>
                  )}
                </div>
              </div>

              {showCostAnalysisSelector && (
                <div className="bg-white p-4 rounded border">
                  <div className="mb-3">
                    <Label className="text-sm font-medium">
                      Select Approved Cost Analysis:
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {mockCostAnalyses
                      .filter((ca) => ca.status === "approved")
                      .map((costAnalysis) => (
                        <div
                          key={costAnalysis.id}
                          className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => loadCostAnalysis(costAnalysis.id)}
                        >
                          <div>
                            <div className="font-medium">
                              {costAnalysis.id} - {costAnalysis.clientName}
                            </div>
                            <div className="text-sm text-gray-600">
                              Created: {costAnalysis.createdDate} •{" "}
                              {costAnalysis.nonReceiptedItems.length}{" "}
                              non-receipted items
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {costAnalysis.status.toUpperCase()}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCostAnalysisSelector(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {/* Domestic Quotation Loader - Only for Domestic */}
        {billingMode === "domestic" && (
          <CardContent>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-green-900">
                    Load from Domestic Quotation
                  </h4>
                  <p className="text-sm text-green-700">
                    Import non-receipted service items from approved domestic
                    quotation
                  </p>
                </div>
                <div className="flex gap-2">
                  {!showCostAnalysisSelector && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCostAnalysisSelector(true)}
                      className="bg-white"
                    >
                      <SearchIcon className="h-4 w-4 mr-2" />
                      Load Quotation
                    </Button>
                  )}
                  {selectedCostAnalysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearLoadedData}
                      className="bg-white text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Clear Loaded Data
                    </Button>
                  )}
                </div>
              </div>

              {showCostAnalysisSelector && (
                <div className="bg-white p-4 rounded border">
                  <div className="mb-3">
                    <Label className="text-sm font-medium">
                      Select Approved Domestic Quotation:
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {mockDomesticQuotations
                      .filter((q) => q.status === "approved")
                      .map((quotation) => (
                        <div
                          key={quotation.id}
                          className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => loadDomesticQuotation(quotation.id)}
                        >
                          <div>
                            <div className="font-medium">
                              {quotation.id} - {quotation.serviceType}
                            </div>
                            <div className="text-sm text-gray-600">
                              {quotation.clientName} • Approved:{" "}
                              {quotation.approvedDate} •{" "}
                              {quotation.nonReceiptedItems.length} service items
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {quotation.status.toUpperCase()}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCostAnalysisSelector(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Client Info */}
            <div className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Client Address</Label>
                <Textarea
                  value={formData.clientAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, clientAddress: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Client TIN</Label>
                <Input
                  value={formData.clientTIN}
                  onChange={(e) =>
                    setFormData({ ...formData, clientTIN: e.target.value })
                  }
                  placeholder="123-456-789-000"
                />
              </div>
              <div>
                <Label>Booking Reference</Label>
                <Input
                  value={formData.bookingReference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingReference: e.target.value,
                    })
                  }
                  placeholder="PRO# 0140-25"
                />
              </div>
              <div>
                <Label>Container Information</Label>
                <Input
                  value={formData.containerInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, containerInfo: e.target.value })
                  }
                  placeholder="1x20FTR CONTAINER"
                />
              </div>
            </div>

            {/* Right Column - Shipment Info */}
            <div className="space-y-4">
              <div>
                <Label>Booking ID</Label>
                <Input
                  value={formData.bookingId}
                  onChange={(e) =>
                    setFormData({ ...formData, bookingId: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>BL Number</Label>
                <Input
                  value={formData.blNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, blNumber: e.target.value })
                  }
                  placeholder="ARM0403059"
                />
              </div>
              <div>
                <Label>Invoice Number</Label>
                <Input
                  value={formData.invoiceNo}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceNo: e.target.value })
                  }
                  placeholder="800035980"
                />
              </div>
              <div>
                <Label>Port</Label>
                <Input
                  value={formData.port}
                  onChange={(e) =>
                    setFormData({ ...formData, port: e.target.value })
                  }
                  placeholder="MANILA PORT"
                />
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Select
                  value={formData.terms}
                  onValueChange={(value) =>
                    setFormData({ ...formData, terms: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15 days">Net 15 days</SelectItem>
                    <SelectItem value="Net 30 days">Net 30 days</SelectItem>
                    <SelectItem value="Net 45 days">Net 45 days</SelectItem>
                    <SelectItem value="Cash on Delivery">
                      Cash on Delivery
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Service Items</CardTitle>
            <Button onClick={addItem} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Enter service description"
                        className="min-w-[250px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="text-center w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {formData.currency}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="text-right w-[120px]"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formData.currency} {item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <Separator className="my-6" />

          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {formData.currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({formData.vatRate}%):</span>
                <span className="font-medium">
                  {formData.currency} {vatAmount.toFixed(2)}
                </span>
              </div>
              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>
                  {formData.currency} {total.toFixed(2)}
                </span>
              </div>
              {formData.currency !== "PHP" && (
                <div className="text-sm text-gray-600 text-right">
                  PHP {(total * formData.exchangeRate).toFixed(2)} @{" "}
                  {formData.exchangeRate}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency & VAT Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Currency & Tax Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="PHP">PHP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Exchange Rate (to PHP)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.exchangeRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exchangeRate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>VAT Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.vatRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vatRate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            placeholder="Add any remarks or special instructions..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          Prepared by: {formData.preparedBy} on {formData.preparedDate}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            <SendIcon className="h-4 w-4 mr-2" />
            Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  );
}
