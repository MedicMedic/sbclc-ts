import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";
import * as LogisticsData from "@/polymet/data/logistics-data";

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  currency: string;
}

interface ServiceInvoiceFormProps {
  bookingId?: string;
  quotationId?: string;
  billingType: "import_brokerage" | "import_forwarding" | "domestic";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

export function ServiceInvoiceForm({
  bookingId,
  quotationId,
  billingType,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: ServiceInvoiceFormProps) {
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
    {
      id: "4",
      description: "LCL-FCL CHARGES AT DESTINATION",
      quantity: 1,
      unitPrice: 832.0,
      amount: 832.0,
      currency: "PHP",
    },
    {
      id: "5",
      description: "CTC-EQUIPMENT IMBALANCE CHARGES",
      quantity: 1,
      unitPrice: 275.0,
      amount: 275.0,
      currency: "PHP",
    },
    {
      id: "6",
      description: "OCR-OPERATION COST RECOVERY",
      quantity: 1,
      unitPrice: 110.0,
      amount: 110.0,
      currency: "PHP",
    },
    {
      id: "7",
      description: "STORAGE FEE",
      quantity: 1,
      unitPrice: 3500.0,
      amount: 3500.0,
      currency: "PHP",
    },
    {
      id: "8",
      description: "HANDLING FEE",
      quantity: 1,
      unitPrice: 500.0,
      amount: 500.0,
      currency: "PHP",
    },
  ]);

  const [formData, setFormData] = useState({
    invoiceNumber: `SI-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    bookingId: bookingId || "",
    quotationId: quotationId || "",
    costAnalysisId: "",
    billingType,
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

  const [availableCostAnalyses, setAvailableCostAnalyses] = useState([]);
  const [isLoadingCostAnalysis, setIsLoadingCostAnalysis] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = subtotal * (formData.vatRate / 100);
  const total = subtotal + vatAmount;

  // Load available cost analyses on component mount
  useEffect(() => {
    // Mock cost analyses data - in real app, this would come from API
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

    setAvailableCostAnalyses(mockCostAnalyses);
  }, []);

  // Load cost analysis data
  const loadCostAnalysis = (costAnalysisId: string) => {
    setIsLoadingCostAnalysis(true);

    const costAnalysis = availableCostAnalyses.find(
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
    }

    setTimeout(() => {
      setIsLoadingCostAnalysis(false);
    }, 1000);
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
    };

    // Create professional print layout matching the reference image
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700,scrollbars=yes,resizable=yes"
    );

    if (printWindow) {
      try {
        printWindow.document.write(`
          <html>
            <head>
              <title>Service Invoice - ${data.invoiceNumber}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                }
                .header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                }
                .company-name {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .company-info {
                  font-size: 11px;
                  margin-bottom: 2px;
                }
                .invoice-details {
                  margin: 20px 0;
                  font-size: 11px;
                }
                .services-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                  font-size: 11px;
                }
                .services-table th,
                .services-table td {
                  border: none;
                  padding: 4px 8px;
                  text-align: left;
                }
                .services-table th {
                  font-weight: bold;
                  border-bottom: 1px solid #000;
                }
                .text-right { text-align: right; }
                .text-center { text-center: center; }
                .totals-section {
                  margin-top: 30px;
                  text-align: right;
                  font-size: 12px;
                }
                .total-line {
                  margin: 5px 0;
                }
                .final-total {
                  font-weight: bold;
                  font-size: 14px;
                  border-top: 1px solid #000;
                  padding-top: 5px;
                  margin-top: 10px;
                }
                .note-section {
                  margin-top: 30px;
                  font-size: 11px;
                }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="company-name">${data.companyName}</div>
                <div class="company-info">${data.companyVat}</div>
                <div class="company-info">${data.companyAddress}</div>
              </div>
              
              <div style="text-align: right; margin-bottom: 20px;">
                <strong>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>
              </div>
              
              <div class="invoice-details">
                <div><strong>BOOKING REFERENCE No. ${data.bookingReference} ${data.containerInfo}</strong></div>
                <div style="margin: 10px 0;">
                  ${items
                    .map((item) => `${item.quantity} BOX ${item.description}`)
                    .slice(0, 3)
                    .join("<br>")}
                </div>
                <div>BL No. ${data.blNumber} / INVOICE NO. ${data.invoiceNo} / ${data.port}</div>
              </div>
              
              <table class="services-table">
                <thead>
                  <tr>
                    <th>THC DESTINATION</th>
                    <th class="text-center">Per Cntr.</th>
                    <th class="text-right">20ft</th>
                    <th class="text-right">40ft</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="text-center">Per Cntr.</td>
                      <td class="text-right">₱${item.unitPrice.toFixed(2)}</td>
                      <td class="text-right">${item.amount > 0 ? item.amount.toFixed(2) : "0.00"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
              
              <div class="note-section">
                <strong>Note:</strong> <em>Exchange Rate</em> &nbsp;&nbsp;&nbsp; ₱${data.exchangeRate} per US$ 1.00
              </div>
              
              <div class="totals-section">
                <div style="float: left; margin-top: 20px;">
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div style="float: right; margin-top: 20px;">
                  <strong>${total.toFixed(2)}</strong><br>
                  <strong>${vatAmount.toFixed(2)}</strong>
                </div>
                <div style="clear: both;"></div>
                
                <div style="margin-top: 40px; text-align: left;">
                  <div style="float: left;">
                    <strong>${vatAmount.toFixed(2)}</strong><br>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                  <div style="float: right;">
                    <strong>${vatAmount.toFixed(2)}</strong><br>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                  <div style="clear: both;"></div>
                </div>
              </div>
              
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();
      } catch (error) {
        console.error("Print generation failed:", error);
        alert(
          "Print generation failed. Please check your browser settings and try again."
        );
      }
    } else {
      alert(
        "Print window blocked. Please allow popups for this site and try again."
      );
    }

    onPrint?.(data);
  };

  const getServiceTypeTitle = () => {
    switch (billingType) {
      case "import_brokerage":
        return "Import Brokerage Services";
      case "import_forwarding":
        return "Import Forwarding Services";
      case "domestic":
        return "Domestic Services";
      default:
        return "Services";
    }
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
                {getServiceTypeTitle()} - Non-Receipted Services
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {formData.invoiceNumber}
            </Badge>
          </div>
        </CardHeader>

        {/* Cost Analysis Loader */}
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Load from Cost Analysis
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Import non-receipted items from approved cost analysis
                </p>
              </div>
              <DownloadIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label className="text-blue-900 dark:text-blue-100">
                  Select Cost Analysis
                </Label>
                <Select
                  value={formData.costAnalysisId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, costAnalysisId: value });
                    if (value) loadCostAnalysis(value);
                  }}
                  disabled={isLoadingCostAnalysis}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Choose cost analysis to load..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCostAnalyses.map((ca) => (
                      <SelectItem key={ca.id} value={ca.id}>
                        {ca.id} - {ca.clientName} ({ca.createdDate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (formData.costAnalysisId) {
                    loadCostAnalysis(formData.costAnalysisId);
                  }
                }}
                disabled={!formData.costAnalysisId || isLoadingCostAnalysis}
                className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
              >
                {isLoadingCostAnalysis ? "Loading..." : "Load Data"}
              </Button>
            </div>
            {formData.costAnalysisId && (
              <div className="mt-3 text-sm text-blue-700 dark:text-blue-300">
                ✓ Cost Analysis {formData.costAnalysisId} selected
              </div>
            )}
          </div>
        </CardContent>
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
