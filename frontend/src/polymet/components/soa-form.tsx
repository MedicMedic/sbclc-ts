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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  TrashIcon,
  FileTextIcon,
  PrinterIcon,
  SendIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";
import * as LogisticsData from "@/polymet/data/logistics-data";

interface SOAItem {
  id: string;
  description: string;
  amount: number;
  currency: string;
  receiptNumber?: string;
  receiptDate?: string;
  supplier?: string;
}

interface SOAFormProps {
  bookingId?: string;
  costAnalysisId?: string;
  billingType: "import_brokerage" | "import_forwarding" | "domestic";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

export function SOAForm({
  bookingId,
  costAnalysisId,
  billingType,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: SOAFormProps) {
  const [items, setItems] = useState<SOAItem[]>([
    {
      id: "1",
      description: "Port Charges",
      amount: 195.0,
      currency: "USD",
      receiptNumber: "RC-001",
      receiptDate: "2024-01-15",
      supplier: "Manila Port Authority",
    },
  ]);

  const [formData, setFormData] = useState({
    soaNumber: `SOA 2025 - FWDC 0000`,
    bookingId: bookingId || "",
    costAnalysisId: costAnalysisId || "",
    billingType,
    // Company Information
    companyName: "SAVE AND BEST CARGO LOGISTICS CORPORATION",
    vatRegNo: "Vat Reg TIN No. 008 - 107 - 502 - 000",
    telephone: "Telephone No. (045) 404 - 8343",
    // Client Information
    clientName: "Gentle Supreme Philippines Inc.",
    clientAddress:
      "Songkat Building M-14 West Service Road\nSouth Expressway Paranaque City, Manila",
    // Billing References
    proNo: "0000-25",
    date: new Date().toISOString().split("T")[0],
    blNumber: "ARM0403053",
    cntrNo: "CIRU1973673",
    port: "MANILA",
    entryNo: "C - 265412",
    invoiceNo: "500035590",
    // Goods Description
    goodsDescription:
      "1x20 'FCL 300 BOX NOODLE MISEDRAP MISOGANG ASLI 4085GR - BUNDLE\n150 BOX NOODLE MISEDRAP GOSENG AYAM KRISPI 4085GR\n405 BOX NOODLE MISEDRAP KOREAN SPICE CHICKEN 40PCS\n500 BOX NOODLE MISEDRAP KOREAN SOFT 40PCS",
    // Other fields
    currency: "PHP",
    exchangeRate: 1,
    vatRate: 0,
    terms: "Net 30 days",
    remarks: "",
    preparedBy: "Joel De Vera",
    preparedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    // Amount in words
    amountInWords:
      "Eight thousand eight hundred seventy-one pesos and eighty-seven centavos",
  });

  const [showCostAnalysisDialog, setShowCostAnalysisDialog] = useState(false);
  const [availableCostAnalysis, setAvailableCostAnalysis] = useState<any[]>([]);

  // Load available cost analysis data
  useEffect(() => {
    // Mock cost analysis data - in real app, this would come from API
    const mockCostAnalysis = [
      {
        id: "CA-2024-001",
        soaNumber: "SOA 2025 - FWDC 0000",
        bookingId: "BK-2024-001",
        clientName: "Gentle Supreme Philippines Inc.",
        totalAmount: 8871.87,
        createdDate: "2024-01-20",
        status: "approved",
        particularsItems: [
          {
            description: "ARRASTRE CHARGES AS PER CSI No. 0000",
            amount: 0.0,
          },
          {
            description: "WHARFAGE CHARGES AS PER SI No. 0000",
            amount: 0.0,
          },
          {
            description: "LIFT ON LIFT OFF CHARGES AS PER SI No. 0000",
            amount: 0.0,
          },
          {
            description: "STORAGE CHARGES as per CSI No. 0000",
            amount: 0.0,
          },
          {
            description: "DEMURRAGE CHARGES as per SI No. 0000",
            amount: 0.0,
          },
          {
            description: "DETENTION CHARGES as per SI No. 0000",
            amount: 0.0,
          },
          {
            description: "CUSTOMS PAYMENT - AMENDMENT FEE AS PER OR No. 0000",
            amount: 0.0,
          },
          {
            description: "CERTIFICATION FEE AS PER OR No. IML 0000",
            amount: 0.0,
          },
        ],
      },
    ];

    setAvailableCostAnalysis(mockCostAnalysis);
  }, []);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = subtotal * (formData.vatRate / 100);
  const total = subtotal + vatAmount;

  const addItem = () => {
    const newItem: SOAItem = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      currency: formData.currency,
      receiptNumber: "",
      receiptDate: "",
      supplier: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof SOAItem, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
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

    try {
      // Generate professional SOA printout matching reference image
      const printWindow = window.open(
        "",
        "_blank",
        "width=900,height=700,scrollbars=yes,resizable=yes"
      );

      if (!printWindow) {
        alert(
          "Print popup was blocked. Please allow popups for this site and try again."
        );
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Statement of Account - ${data.soaNumber}</title>
            <style>
              @page { size: A4; margin: 0.5in; }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                font-size: 12px;
                line-height: 1.4;
              }
              .header { 
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              .logo {
                width: 80px;
                height: 80px;
                background: linear-gradient(45deg, #ff6b35, #f7931e, #1f4e79);
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
              }
              .company-info {
                flex: 1;
              }
              .company-name {
                font-size: 18px;
                font-weight: bold;
                color: #1f4e79;
                margin-bottom: 5px;
              }
              .company-subtitle {
                color: #ff6b35;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .company-details {
                font-size: 10px;
                line-height: 1.2;
              }
              .soa-header {
                text-align: center;
                margin: 20px 0;
              }
              .soa-title {
                border: 2px solid #000;
                padding: 5px 15px;
                display: inline-block;
                font-weight: bold;
                margin-bottom: 5px;
              }
              .soa-number {
                border: 2px solid #000;
                padding: 5px 15px;
                display: inline-block;
                font-weight: bold;
                background-color: #e6f3ff;
              }
              .billing-section {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
              }
              .bill-to {
                width: 45%;
                border: 2px solid #000;
                padding: 10px;
              }
              .bill-to-header {
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
              }
              .billing-refs {
                width: 45%;
              }
              .billing-refs-header {
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
              }
              .refs-table {
                width: 100%;
                border-collapse: collapse;
              }
              .refs-table td {
                border: 1px solid #000;
                padding: 4px 8px;
                font-size: 11px;
              }
              .refs-table td:first-child {
                font-weight: bold;
                background-color: #f0f0f0;
                width: 40%;
              }
              .goods-description {
                margin: 20px 0;
                border: 1px solid #000;
                padding: 10px;
              }
              .goods-header {
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
              }
              .particulars-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .particulars-table th,
              .particulars-table td {
                border: 1px solid #000;
                padding: 6px 8px;
                text-align: left;
                font-size: 11px;
              }
              .particulars-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                text-align: center;
              }
              .amount-column {
                text-align: right !important;
                width: 100px;
              }
              .total-row {
                background-color: #e6f3ff;
                font-weight: bold;
              }
              .total-amount {
                text-align: right;
                margin: 20px 0;
                font-size: 14px;
                font-weight: bold;
              }
              .amount-words {
                margin: 20px 0;
                font-style: italic;
              }
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
                padding-top: 20px;
              }
              .signature-section {
                text-align: center;
                width: 30%;
              }
              .signature-line {
                border-bottom: 1px solid #000;
                margin-bottom: 5px;
                height: 40px;
              }
              .signature-label {
                font-size: 10px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <!-- Header -->
            <div class="header">
              <div class="logo">SB</div>
              <div class="company-info">
                <div class="company-name">${data.companyName.split(" ").slice(0, 3).join(" ")}</div>
                <div class="company-subtitle">${data.companyName.split(" ").slice(3).join(" ")}</div>
                <div class="company-details">
                  ${data.vatRegNo}<br>
                  ${data.telephone}
                </div>
              </div>
            </div>

            <!-- SOA Header -->
            <div class="soa-header">
              <div class="soa-title">STATEMENT OF ACCOUNT</div><br>
              <div class="soa-number">${data.soaNumber}</div>
            </div>

            <!-- Billing Section -->
            <div class="billing-section">
              <div class="bill-to">
                <div class="bill-to-header">Bill To:</div>
                <strong>${data.clientName}</strong><br>
                ${data.clientAddress.replace(/\n/g, "<br>")}
              </div>
              
              <div class="billing-refs">
                <div class="billing-refs-header">Billing Reference:</div>
                <table class="refs-table">
                  <tr><td>PRO No.:</td><td>${data.proNo}</td></tr>
                  <tr><td>DATE:</td><td>${new Date(data.date).toLocaleDateString()}</td></tr>
                  <tr><td>BL NUMBER:</td><td>${data.blNumber}</td></tr>
                  <tr><td>CNTR No.:</td><td>${data.cntrNo}</td></tr>
                  <tr><td>PORT:</td><td>${data.port}</td></tr>
                  <tr><td>ENTRY No.:</td><td>${data.entryNo}</td></tr>
                  <tr><td>INVOICE No.:</td><td>${data.invoiceNo}</td></tr>
                </table>
              </div>
            </div>

            <!-- Goods Description -->
            <div class="goods-description">
              <div class="goods-header">Description of Goods:</div>
              ${data.goodsDescription.replace(/\n/g, "<br>")}
            </div>

            <!-- Particulars Table -->
            <table class="particulars-table">
              <thead>
                <tr>
                  <th style="width: 70%;">PARTICULARS</th>
                  <th class="amount-column">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="amount-column">${item.amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                  <td style="text-align: right; font-weight: bold;">TOTAL AMOUNT</td>
                  <td class="amount-column">PHP ${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <!-- Amount in Words -->
            <div class="amount-words">
              <strong>Amount in words:</strong><br>
              ${data.amountInWords}
            </div>

            <!-- Signatures -->
            <div class="signatures">
              <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signature-label">${data.preparedBy}</div>
              </div>
              <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signature-label">SBCLC Accounting Department</div>
              </div>
              <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signature-label">Signature over printed Name</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Auto print after content loads
      setTimeout(() => {
        printWindow.print();
        // Optional: Close window after printing (uncomment if desired)
        // printWindow.onafterprint = () => printWindow.close();
      }, 1000);
    } catch (error) {
      console.error("Print error:", error);
      alert(
        "There was an error generating the print preview. Please try again."
      );
    }

    onPrint?.(data);
  };

  const loadCostAnalysis = (costAnalysisData: any) => {
    // Load data from selected cost analysis
    setFormData({
      ...formData,
      costAnalysisId: costAnalysisData.id,
      soaNumber: costAnalysisData.soaNumber,
      clientName: costAnalysisData.clientName,
    });

    // Load particulars items
    const loadedItems = costAnalysisData.particularsItems.map(
      (item: any, index: number) => ({
        id: (index + 1).toString(),
        description: item.description,
        amount: item.amount,
        currency: formData.currency,
        receiptNumber: "",
        receiptDate: "",
        supplier: "",
      })
    );

    setItems(loadedItems);
    setShowCostAnalysisDialog(false);
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
                Statement of Account (SOA)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {billingType === "import_brokerage" &&
                  "Import Brokerage - Receipted Expenses"}
                {billingType === "import_forwarding" &&
                  "Import Forwarding - Receipted Expenses"}
                {billingType === "domestic" && "Domestic - Receipted Expenses"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={showCostAnalysisDialog}
                onOpenChange={setShowCostAnalysisDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Load Cost Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Select Cost Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {availableCostAnalysis.map((ca) => (
                      <Card
                        key={ca.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => loadCostAnalysis(ca)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{ca.soaNumber}</h4>
                              <p className="text-sm text-gray-600">
                                {ca.clientName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Booking: {ca.bookingId} | Created:{" "}
                                {ca.createdDate}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ₱{ca.totalAmount.toFixed(2)}
                              </p>
                              <Badge
                                variant={
                                  ca.status === "approved"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {ca.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {formData.soaNumber}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>VAT Registration No.</Label>
                <Input
                  value={formData.vatRegNo}
                  onChange={(e) =>
                    setFormData({ ...formData, vatRegNo: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Telephone</Label>
                <Input
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Bill To:</h3>
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
                      setFormData({
                        ...formData,
                        clientAddress: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              {/* Billing References */}
              <div className="space-y-4">
                <h3 className="font-semibold">Billing Reference:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>PRO No.</Label>
                    <Input
                      value={formData.proNo}
                      onChange={(e) =>
                        setFormData({ ...formData, proNo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
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
                    />
                  </div>
                  <div>
                    <Label>CNTR No.</Label>
                    <Input
                      value={formData.cntrNo}
                      onChange={(e) =>
                        setFormData({ ...formData, cntrNo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Port</Label>
                    <Input
                      value={formData.port}
                      onChange={(e) =>
                        setFormData({ ...formData, port: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Entry No.</Label>
                    <Input
                      value={formData.entryNo}
                      onChange={(e) =>
                        setFormData({ ...formData, entryNo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Invoice No.</Label>
                    <Input
                      value={formData.invoiceNo}
                      onChange={(e) =>
                        setFormData({ ...formData, invoiceNo: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Goods Description */}
            <div>
              <Label>Description of Goods</Label>
              <Textarea
                value={formData.goodsDescription}
                onChange={(e) =>
                  setFormData({ ...formData, goodsDescription: e.target.value })
                }
                rows={4}
                placeholder="Enter detailed description of goods..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOA Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Receipted Expenses</CardTitle>
            <Button onClick={addItem} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Receipt Date</TableHead>
                  <TableHead>Supplier</TableHead>
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
                        placeholder="Enter description"
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.receiptNumber}
                        onChange={(e) =>
                          updateItem(item.id, "receiptNumber", e.target.value)
                        }
                        placeholder="RC-001"
                        className="w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={item.receiptDate}
                        onChange={(e) =>
                          updateItem(item.id, "receiptDate", e.target.value)
                        }
                        className="w-[140px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.supplier}
                        onChange={(e) =>
                          updateItem(item.id, "supplier", e.target.value)
                        }
                        placeholder="Supplier name"
                        className="min-w-[150px]"
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
                          value={item.amount}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="text-right w-[120px]"
                        />
                      </div>
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

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Amount in Words</Label>
              <Textarea
                value={formData.amountInWords}
                onChange={(e) =>
                  setFormData({ ...formData, amountInWords: e.target.value })
                }
                rows={2}
                placeholder="Enter amount in words..."
              />
            </div>
            <div>
              <Label>Prepared By</Label>
              <Input
                value={formData.preparedBy}
                onChange={(e) =>
                  setFormData({ ...formData, preparedBy: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Remarks</Label>
            <Textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="Add any remarks or special instructions..."
              rows={3}
            />
          </div>
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
