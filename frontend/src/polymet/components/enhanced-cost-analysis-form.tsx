import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PrinterIcon,
  SaveIcon,
  SendIcon,
  SearchIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";
import { quotations, bookings } from "@/polymet/data/logistics-data";

interface CostAnalysisFormProps {
  bookingId?: string;
  quotationId?: string;
  cashAdvanceId?: string;
  billingType: "import_brokerage" | "import_forwarding";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

export function EnhancedCostAnalysisForm({
  bookingId,
  quotationId,
  cashAdvanceId,
  billingType,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: CostAnalysisFormProps) {
  const [formData, setFormData] = useState({
    // Company Info
    companyName: "Save and Best Cargo Logistics Corp.",
    vatRegNo: "Vat Reg. TIN No.: 008 - 701 - 502 - 000",
    telephone: "Telephone No. (046) 404 - 8543",

    // Bill To
    billToCompany: "Gentle Supreme Philippines Inc.",
    billToAddress:
      "Shopall Building 1M 16 West Santos Street,\nSouth Expressway Paranaque City, Manila",

    // Document Info
    documentTitle: "COSTING ANALYSIS",
    soaNumber: "SOA 2025 - FVDG 0000",
    billingReference: "",
    proNo: "0000-25",
    date: new Date().toISOString().split("T")[0],
    blNumber: "ARMU0355665",
    cntrNo: "CMAU0534530",
    port: "MANILA",
    entryNo: "2024025",
    invoiceNo: "200035592",

    // Goods Description
    goodsDescription: "",

    // Form fields
    bookingId: bookingId || "",
    quotationId: quotationId || "",
    cashAdvanceId: cashAdvanceId || "",
    billingType,
    currency: "₱",
    exchangeRate: 1.0,
    preparedBy: "Joel De Vera",
    preparedDate: new Date().toISOString().split("T")[0],
  });

  const [particularsItems, setParticularsItems] = useState([
    {
      id: "1",
      description: "PROCESSING FEE",
      rate: 3500.0,
      containers: 1,
      amount: 3500.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "2",
      description: "THC DESTINATION: Per Cntr.",
      rate: 182.5,
      containers: 1,
      amount: 182.5,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "3",
      description: "IMPORT DOCUMENTATION FEE: Per BL",
      rate: 45.0,
      containers: 1,
      amount: 45.0,
      billedAmount: 3715.43,
      requestedAmount: 0,
    },
    {
      id: "4",
      description: "CONTAINER CLEANING: Per Cntr.",
      rate: 1650.0,
      containers: 1,
      amount: 1650.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "5",
      description: "CONTAINER MAINTENANCE CHARGES: Per Cntr.",
      rate: 1400.0,
      containers: 1,
      amount: 1400.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "6",
      description: "DOC LOCAL CHARGES: Per Cntr.",
      rate: 52.0,
      containers: 1,
      amount: 52.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "7",
      description: "CIC EQUIPMENT IMBALANCE CHARGES: Per Cntr.",
      rate: 275.0,
      containers: 1,
      amount: 275.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "8",
      description: "DOC OPERATIONS CHARGES: Per Cntr.",
      rate: 525.0,
      containers: 1,
      amount: 525.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "9",
      description: "BROKERAGE FEE: Per BL",
      rate: 2500.0,
      containers: 1,
      amount: 2500.0,
      billedAmount: 3500.0,
      requestedAmount: 0,
    },
    {
      id: "10",
      description: "HANDLING FEE: Per Cntr.",
      rate: 500.0,
      containers: 1,
      amount: 500.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "11",
      description: "TRUCKING SERVICES PARANAQUE: Per Cntr.",
      rate: 10200.0,
      containers: 1,
      amount: 10200.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "12",
      description: "TRUCKING SERVICES PARANAQUE: Per Cntr.",
      rate: 24500.0,
      containers: 1,
      amount: 24500.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
    {
      id: "13",
      description: "ARRASTRE/WHARFAGE: Per Cntr.",
      rate: 1500.0,
      containers: 1,
      amount: 1500.0,
      billedAmount: 0,
      requestedAmount: 0,
    },
  ]);

  const [receiptedItems, setReceiptedItems] = useState([
    {
      id: "r1",
      description: "ARRASTRE CHARGES",
      orNumber: "OR 000001",
      amount: 0,
      requestedAmount: 0,
    },
    {
      id: "r2",
      description: "WHARFAGE CHARGES",
      orNumber: "OR 000002",
      amount: 0,
      requestedAmount: 0,
    },
    {
      id: "r3",
      description: "AIEL",
      orNumber: "OR 000003",
      amount: 0,
      requestedAmount: 0,
    },
    {
      id: "r4",
      description: "LIFT ON LIFT OFF CHARGES (LOLO)",
      orNumber: "OR 000004",
      amount: 0,
      requestedAmount: 0,
    },
    {
      id: "r5",
      description: "STORAGE CHARGES",
      orNumber: "OR 000005",
      amount: 0,
      requestedAmount: 0,
    },
    {
      id: "r6",
      description: "DEMURRAGE CHARGES",
      orNumber: "OR 000006",
      amount: 0,
      requestedAmount: 0,
    },
    {
      id: "r7",
      description: "DETENTION CHARGES",
      orNumber: "OR 000007",
      amount: 0,
      requestedAmount: 0,
    },
  ]);

  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false);

  // Calculate totals
  const particularsTotal = particularsItems.reduce(
    (sum, item) => sum + item.billedAmount,
    0
  );
  const receiptedTotal = receiptedItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const grandTotal = particularsTotal + receiptedTotal;

  const loadQuotation = (selectedQuotationId: string) => {
    const quotation = quotations.find((q) => q.id === selectedQuotationId);
    const booking = bookings.find((b) => b.quotationId === selectedQuotationId);

    if (quotation && booking) {
      setFormData((prev) => ({
        ...prev,
        quotationId: selectedQuotationId,
        bookingId: booking.id,
        billToCompany: quotation.clientName,
        blNumber: booking.billOfLading || "",
        cntrNo: booking.containerNumbers?.join(", ") || "",
        goodsDescription: booking.cargoDescription || "",
        proNo: quotation.id,
      }));

      // Load quotation items into particulars
      if (quotation.items) {
        const loadedItems = quotation.items.map((item, index) => ({
          id: (index + 1).toString(),
          description: item.description,
          rate: item.rate,
          containers: item.quantity || 1,
          amount: item.amount,
          billedAmount: 0,
          requestedAmount: 0,
        }));
        setParticularsItems(loadedItems);
      }

      setQuotationDialogOpen(false);
    }
  };

  const handlePrint = () => {
    const printData = {
      ...formData,
      particularsItems,
      receiptedItems,
      totals: {
        particulars: particularsTotal,
        receipted: receiptedTotal,
        grandTotal,
      },
    };

    // Generate professional printout matching reference image
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cost Analysis - ${printData.soaNumber}</title>
            <style>
              @page {
                size: A4;
                margin: 0.5in;
              }
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: Arial, sans-serif;
                font-size: 10px;
                line-height: 1.2;
                color: #000;
              }
              
              .header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              
              .company-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
              }
              
              .company-info {
                font-size: 9px;
                margin-bottom: 2px;
              }
              
              .document-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                align-items: flex-start;
              }
              
              .bill-to {
                width: 45%;
                border: 1px solid #000;
                padding: 8px;
                min-height: 80px;
              }
              
              .bill-to-title {
                font-weight: bold;
                margin-bottom: 5px;
              }
              
              .doc-details {
                width: 45%;
              }
              
              .doc-title {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              
              .soa-box {
                border: 2px solid #000;
                padding: 5px;
                text-align: center;
                margin-bottom: 10px;
                font-weight: bold;
              }
              
              .doc-info-table {
                width: 100%;
                border-collapse: collapse;
              }
              
              .doc-info-table td {
                border: 1px solid #000;
                padding: 3px 5px;
                font-size: 9px;
              }
              
              .doc-info-table .label {
                background-color: #f0f0f0;
                font-weight: bold;
                width: 40%;
              }
              
              .goods-description {
                margin: 15px 0;
                border: 1px solid #000;
                padding: 8px;
                min-height: 60px;
              }
              
              .goods-title {
                font-weight: bold;
                margin-bottom: 5px;
              }
              
              .particulars-section {
                margin-bottom: 15px;
              }
              
              .section-title {
                font-weight: bold;
                font-size: 11px;
                margin-bottom: 5px;
                text-decoration: underline;
              }
              
              .particulars-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              
              .particulars-table th,
              .particulars-table td {
                border: 1px solid #000;
                padding: 3px 4px;
                text-align: left;
                font-size: 8px;
              }
              
              .particulars-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                text-align: center;
              }
              
              .text-right {
                text-align: right;
              }
              
              .text-center {
                text-align: center;
              }
              
              .highlight {
                background-color: #ffff99 !important;
              }
              
              .total-row {
                font-weight: bold;
                background-color: #ffff99;
              }
              
              .receipted-section {
                margin-bottom: 15px;
              }
              
              .weight-breakdown {
                margin-bottom: 15px;
              }
              
              .weight-table {
                width: 60%;
                border-collapse: collapse;
              }
              
              .weight-table th,
              .weight-table td {
                border: 1px solid #000;
                padding: 3px 4px;
                text-align: center;
                font-size: 8px;
              }
              
              .weight-table th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              
              .formula-section {
                float: right;
                width: 35%;
                margin-top: 20px;
              }
              
              .formula-box {
                border: 1px solid #000;
                padding: 8px;
                background-color: #f8f8f8;
              }
              
              .formula-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
                font-size: 9px;
              }
              
              .formula-total {
                border-top: 1px solid #000;
                padding-top: 3px;
                font-weight: bold;
              }
              
              .signature-section {
                clear: both;
                margin-top: 30px;
                text-align: left;
              }
              
              .signature-line {
                border-bottom: 1px solid #000;
                width: 200px;
                margin-top: 30px;
                text-align: center;
                padding-bottom: 3px;
              }
              
              .no-print {
                display: none;
              }
              
              @media print {
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <!-- Header -->
            <div class="header">
              <div class="company-name">${printData.companyName}</div>
              <div class="company-info">${printData.vatRegNo}</div>
              <div class="company-info">${printData.telephone}</div>
            </div>
            
            <!-- Document Header -->
            <div class="document-header">
              <div class="bill-to">
                <div class="bill-to-title">Bill To:</div>
                <div>${printData.billToCompany}</div>
                <div style="white-space: pre-line; margin-top: 5px;">${printData.billToAddress}</div>
              </div>
              
              <div class="doc-details">
                <div class="doc-title">${printData.documentTitle}</div>
                <div class="soa-box">${printData.soaNumber}</div>
                
                <table class="doc-info-table">
                  <tr>
                    <td class="label">Billing Reference:</td>
                    <td>${printData.billingReference || ""}</td>
                  </tr>
                  <tr>
                    <td class="label">PRO No.:</td>
                    <td>${printData.proNo}</td>
                  </tr>
                  <tr>
                    <td class="label">DATE:</td>
                    <td>${new Date(printData.date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td class="label">BL NUMBER:</td>
                    <td>${printData.blNumber}</td>
                  </tr>
                  <tr>
                    <td class="label">CNTR. No.:</td>
                    <td>${printData.cntrNo}</td>
                  </tr>
                  <tr>
                    <td class="label">PORT:</td>
                    <td>${printData.port}</td>
                  </tr>
                  <tr>
                    <td class="label">ENTRY No.:</td>
                    <td>${printData.entryNo}</td>
                  </tr>
                  <tr>
                    <td class="label">INVOICE No.:</td>
                    <td>${printData.invoiceNo}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- Description of Goods -->
            <div class="goods-description">
              <div class="goods-title">Description of Goods:</div>
              <div style="white-space: pre-line;">${printData.goodsDescription}</div>
            </div>
            
            <!-- Particulars Section -->
            <div class="particulars-section">
              <div class="section-title">PARTICULARS</div>
              <table class="particulars-table">
                <thead>
                  <tr>
                    <th style="width: 35%;">PARTICULARS</th>
                    <th style="width: 12%;">RATE</th>
                    <th style="width: 10%;">NO. of CONTAINERS</th>
                    <th style="width: 12%;">AMOUNT</th>
                    <th style="width: 15%;">BILLED AMOUNT</th>
                    <th style="width: 16%;">REQUESTED AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  ${particularsItems
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="text-right">₱ ${item.rate.toFixed(2)}</td>
                      <td class="text-center">${item.containers}</td>
                      <td class="text-right">₱ ${item.amount.toFixed(2)}</td>
                      <td class="text-right highlight">₱ ${item.billedAmount.toFixed(2)}</td>
                      <td class="text-right">₱ ${item.requestedAmount.toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                  <tr class="total-row">
                    <td colspan="4" class="text-right">SUBTOTAL:</td>
                    <td class="text-right">₱ ${printData.totals.particulars.toFixed(2)}</td>
                    <td class="text-right">₱ -</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Receipted Section -->
            <div class="receipted-section">
              <div class="section-title">RECEIPTED</div>
              <table class="particulars-table">
                <thead>
                  <tr>
                    <th style="width: 40%;">DESCRIPTION</th>
                    <th style="width: 20%;">OR NUMBER</th>
                    <th style="width: 20%;">AMOUNT</th>
                    <th style="width: 20%;">REQUESTED AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  ${receiptedItems
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="text-center">${item.orNumber}</td>
                      <td class="text-right highlight">₱ ${item.amount.toFixed(2)}</td>
                      <td class="text-right">₱ ${item.requestedAmount.toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                  <tr class="total-row">
                    <td colspan="2" class="text-right">SUBTOTAL:</td>
                    <td class="text-right">₱ ${printData.totals.receipted.toFixed(2)}</td>
                    <td class="text-right">₱ -</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Weight Breakdown -->
            <div class="weight-breakdown">
              <div class="section-title">WEIGHT BREAKDOWN:</div>
              <table class="weight-table">
                <thead>
                  <tr>
                    <th>CNTR</th>
                    <th>SIZE</th>
                    <th>RATE</th>
                    <th>BRK/Cntr.</th>
                    <th>E-rate</th>
                    <th>Wt. Cntr.</th>
                    <th>SEAL DELIVERY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>MTD</td>
                    <td>5341 541</td>
                    <td>5</td>
                    <td>613.00</td>
                    <td>541</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Formula Section -->
            <div class="formula-section">
              <div class="formula-box">
                <div class="formula-row">
                  <span>SUBTOTAL:</span>
                  <span>₱ ${printData.totals.particulars.toFixed(2)}</span>
                </div>
                <div class="formula-row">
                  <span></span>
                  <span>₱ ${printData.totals.receipted.toFixed(2)}</span>
                </div>
                <div class="formula-row">
                  <span></span>
                  <span>₱ -</span>
                </div>
                <div class="formula-row formula-total">
                  <span></span>
                  <span>₱ ${printData.totals.particulars.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <!-- Signature Section -->
            <div class="signature-section">
              <div style="font-weight: bold; margin-bottom: 5px;">Prepared By:</div>
              <div class="signature-line">${printData.preparedBy}</div>
            </div>
            
            <!-- Print Button -->
            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Document</button>
              <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Auto-print after a short delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    onPrint?.(printData);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      particularsItems,
      receiptedItems,
      totals: {
        particulars: particularsTotal,
        receipted: receiptedTotal,
        grandTotal,
      },
      status: "draft",
    };
    onSave?.(data);
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      particularsItems,
      receiptedItems,
      totals: {
        particulars: particularsTotal,
        receipted: receiptedTotal,
        grandTotal,
      },
      status: "pending_approval",
    };
    onSubmit?.(data);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{formData.companyName}</h1>
            <p className="text-sm">{formData.vatRegNo}</p>
            <p className="text-sm">{formData.telephone}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <Label className="font-semibold">Bill To:</Label>
              <div className="mt-2 p-3 border rounded">
                <Textarea
                  value={formData.billToCompany + "\n" + formData.billToAddress}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    setFormData((prev) => ({
                      ...prev,
                      billToCompany: lines[0] || "",
                      billToAddress: lines.slice(1).join("\n"),
                    }));
                  }}
                  rows={4}
                />
              </div>
            </div>

            <div>
              <div className="text-right mb-4">
                <h2 className="text-lg font-bold">{formData.documentTitle}</h2>
                <div className="bg-blue-100 p-2 rounded text-sm">
                  Auto-Generated
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Label>SOA Number:</Label>
                  <Input
                    value={formData.soaNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        soaNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>PRO No.:</Label>
                  <Input
                    value={formData.proNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        proNo: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Date:</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>BL Number:</Label>
                  <Input
                    value={formData.blNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        blNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>CNTR. No.:</Label>
                  <Input
                    value={formData.cntrNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cntrNo: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Port:</Label>
                  <Input
                    value={formData.port}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, port: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Entry No.:</Label>
                  <Input
                    value={formData.entryNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        entryNo: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Invoice No.:</Label>
                  <Input
                    value={formData.invoiceNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoiceNo: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Label>Description of Goods:</Label>
            <Textarea
              value={formData.goodsDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  goodsDescription: e.target.value,
                }))
              }
              rows={3}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Load Quotation Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>Load from Quotation:</Label>
            <Dialog
              open={quotationDialogOpen}
              onOpenChange={setQuotationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Select Quotation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Quotation</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {quotations.map((quotation) => (
                    <div
                      key={quotation.id}
                      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => loadQuotation(quotation.id)}
                    >
                      <div className="font-medium">{quotation.id}</div>
                      <div className="text-sm text-gray-600">
                        {quotation.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quotation.serviceType}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            {formData.quotationId && (
              <span className="text-sm text-green-600">
                Loaded: {formData.quotationId}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Particulars Table */}
      <Card>
        <CardHeader>
          <CardTitle>Particulars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">
                    No. of Containers
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right bg-yellow-100">
                    Billed Amount
                  </TableHead>
                  <TableHead className="text-right">Requested Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {particularsItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      ₱ {item.rate.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.containers}
                    </TableCell>
                    <TableCell className="text-right">
                      ₱ {item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="bg-yellow-50">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.billedAmount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setParticularsItems((prev) =>
                            prev.map((p) =>
                              p.id === item.id
                                ? { ...p, billedAmount: value }
                                : p
                            )
                          );
                        }}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.requestedAmount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setParticularsItems((prev) =>
                            prev.map((p) =>
                              p.id === item.id
                                ? { ...p, requestedAmount: value }
                                : p
                            )
                          );
                        }}
                        className="text-right"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-yellow-100 font-semibold">
                  <TableCell colSpan={4} className="text-right">
                    Sub-total:
                  </TableCell>
                  <TableCell className="text-right">
                    ₱ {particularsTotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">₱ -</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Receipted Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Receipted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>OR Number</TableHead>
                  <TableHead className="text-right bg-yellow-100">
                    Amount
                  </TableHead>
                  <TableHead className="text-right">Requested Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receiptedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.orNumber}</TableCell>
                    <TableCell className="bg-yellow-50">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setReceiptedItems((prev) =>
                            prev.map((r) =>
                              r.id === item.id ? { ...r, amount: value } : r
                            )
                          );
                        }}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.requestedAmount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setReceiptedItems((prev) =>
                            prev.map((r) =>
                              r.id === item.id
                                ? { ...r, requestedAmount: value }
                                : r
                            )
                          );
                        }}
                        className="text-right"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-yellow-100 font-semibold">
                  <TableCell colSpan={2} className="text-right">
                    Sub-total:
                  </TableCell>
                  <TableCell className="text-right">
                    ₱ {receiptedTotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">₱ -</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totals Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Weight Breakdown:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cntr</TableHead>
                    <TableHead>MTD</TableHead>
                    <TableHead>Seal No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Wt. Cntr.</TableHead>
                    <TableHead>Seal Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>MTD</TableCell>
                    <TableCell>5341 541</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>613.00</TableCell>
                    <TableCell>541</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <div className="space-y-4">
                <div className="bg-blue-100 p-4 rounded">
                  <div className="grid grid-cols-2 gap-2">
                    <span>Formula:</span>
                    <span className="text-right">
                      ₱ {particularsTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span>Formula:</span>
                    <span className="text-right">₱ -</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span>Formula:</span>
                    <span className="text-right">₱ -</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-semibold border-t pt-2">
                    <span>Formula:</span>
                    <span className="text-right">
                      ₱ {particularsTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-left">
            <p className="font-semibold">Prepared By:</p>
            <div className="mt-8 border-b border-black w-64">
              <p className="text-center pb-2">{formData.preparedBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
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
            Save
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
