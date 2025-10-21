import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PrinterIcon,
  SaveIcon,
  SendIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface DomesticSOAFormProps {
  bookingId?: string;
  billingType: "domestic_trucking" | "domestic_forwarding";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

interface ParticularItem {
  id: string;
  description: string;
  amount: number;
}

export function DomesticSOAForm({
  bookingId,
  billingType,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: DomesticSOAFormProps) {
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "SAVE AND BEST CARGO LOGISTICS CORPORATION",
    vatRegNo: "Vat Reg. TIN No. 000 - 707 - 002 - 000",
    telephone: "Telephone No. (046) 404 - 8343",

    // Document Information
    soaNumber: "SOA 2025 - REIM. 0023",
    date: new Date().toISOString().split("T")[0],

    // Bill To Information
    billToCompany: "GENTLE SUPREME PHILIPPINES INC.",
    billToAddress:
      "BLOCK 2 LOT 4 & 5, LOCATED AT 1ST STREET, GOLDCREST VILLE BUSINESS PARK CARMONA, PHILIPPINES",

    // Billing Reference
    billingReference: {
      origin: "AS STATED BELOW",
      destination: "AS STATED BELOW",
    },

    // Description of Goods
    goodsDescription: "REIMBURSEMENT FOR DEMURRAGE",

    // Particulars Items
    particularsItems: [
      {
        id: "item_001",
        description: "DEMURRAGE CHARGES (2220000578/2220000590)",
        amount: 2500.0,
      },
    ],

    // Totals
    totals: {
      particulars: 2500.0,
    },

    // Prepared By
    preparedBy: "Nova De La Cruz",
    certifiedBy: "SBCLC-Accounting Department",
    receivedBy: "Signature over printed Name",

    // Additional Fields
    remarks: "",
    status: "draft",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const addParticularItem = () => {
    const newItem: ParticularItem = {
      id: `item_${Date.now()}`,
      description: "",
      amount: 0,
    };

    setFormData((prev) => ({
      ...prev,
      particularsItems: [...prev.particularsItems, newItem],
    }));
  };

  const updateParticularItem = (
    id: string,
    field: keyof ParticularItem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      particularsItems: prev.particularsItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeParticularItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      particularsItems: prev.particularsItems.filter((item) => item.id !== id),
    }));
  };

  const calculateTotals = () => {
    const particularsTotal = formData.particularsItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      totals: {
        particulars: particularsTotal,
      },
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.particularsItems]);

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      bookingId,
      billingType,
      submittedAt: new Date().toISOString(),
      status: "pending_approval",
    };

    onSubmit?.(submitData);
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      bookingId,
      billingType,
      savedAt: new Date().toISOString(),
    };

    onSave?.(saveData);
  };

  const handlePrint = () => {
    const printData = {
      ...formData,
      bookingId,
      billingType,
    };

    // Create print window with formatted content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Statement of Account - ${formData.soaNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                font-size: 12px;
              }
              .header { 
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              .logo-section {
                flex: 1;
              }
              .company-name {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
              }
              .company-subtitle {
                font-size: 14px;
                color: #f97316;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .company-details {
                font-size: 10px;
                line-height: 1.4;
              }
              .document-title {
                text-align: center;
                flex: 1;
              }
              .document-title h1 {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
                text-decoration: underline;
              }
              .soa-number {
                border: 2px solid #000;
                padding: 5px;
                margin-top: 10px;
                text-align: center;
                font-weight: bold;
              }
              .bill-to-section {
                display: flex;
                margin: 20px 0;
              }
              .bill-to {
                flex: 1;
                border: 2px solid #000;
                padding: 10px;
                margin-right: 10px;
              }
              .billing-reference {
                flex: 1;
                border: 2px solid #000;
                padding: 10px;
              }
              .section-header {
                background-color: #dbeafe;
                font-weight: bold;
                padding: 5px;
                text-align: center;
                border: 1px solid #000;
                margin: 10px 0 5px 0;
              }
              .description-section {
                border: 2px solid #000;
                padding: 10px;
                margin: 10px 0;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0;
              }
              th, td { 
                border: 1px solid #000; 
                padding: 8px; 
                text-align: left;
              }
              th { 
                background-color: #dbeafe; 
                font-weight: bold;
                text-align: center;
              }
              .text-right { 
                text-align: right; 
              }
              .text-center {
                text-align: center;
              }
              .total-row { 
                font-weight: bold; 
                background-color: #f3f4f6;
              }
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
              }
              .signature-box {
                text-align: center;
                width: 30%;
              }
              .signature-line {
                border-bottom: 1px solid #000;
                margin: 30px 0 5px 0;
                height: 20px;
              }
              .amount-cell {
                text-align: right;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-section">
                <div style="display: flex; align-items: center;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #f97316, #1e40af); margin-right: 15px; display: flex; align-items: center; justify-content: center;">
                    <div style="color: white; font-size: 24px; font-weight: bold;">S&B</div>
                  </div>
                  <div>
                    <div class="company-name">SAVE AND BEST</div>
                    <div class="company-subtitle">CARGO LOGISTICS CORPORATION</div>
                  </div>
                </div>
                <div class="company-details">
                  <div>${formData.vatRegNo}</div>
                  <div>${formData.telephone}</div>
                </div>
              </div>
              
              <div class="document-title">
                <h1>STATEMENT OF<br>ACCOUNT</h1>
                <div class="soa-number">${formData.soaNumber}</div>
              </div>
            </div>
            
            <div class="bill-to-section">
              <div class="bill-to">
                <div style="background-color: #dbeafe; padding: 5px; font-weight: bold; text-align: center; margin: -10px -10px 10px -10px;">Bill To:</div>
                <div style="font-weight: bold; font-size: 14px;">${formData.billToCompany}</div>
                <div style="margin-top: 5px; font-size: 10px;">${formData.billToAddress}</div>
              </div>
              
              <div class="billing-reference">
                <div style="background-color: #dbeafe; padding: 5px; font-weight: bold; text-align: center; margin: -10px -10px 10px -10px;">Billing Reference:</div>
                <table style="margin: 0;">
                  <tr>
                    <td style="font-weight: bold; width: 30%;">DATE:</td>
                    <td>${new Date(formData.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">ORIGIN:</td>
                    <td>${formData.billingReference.origin}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">DESTINATION:</td>
                    <td>${formData.billingReference.destination}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="section-header">Description of Goods</div>
            <div class="description-section">
              ${formData.goodsDescription}
            </div>
            
            <div class="section-header">PARTICULARS</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 70%;">PARTICULARS</th>
                  <th style="width: 30%;">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${formData.particularsItems
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="amount-cell">${item.amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                  <td class="text-center"><strong>TOTAL AMOUNT</strong></td>
                  <td class="amount-cell">PHP ${formData.totals.particulars.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="signatures">
              <div class="signature-box">
                <div style="font-weight: bold;">Prepared by:</div>
                <div class="signature-line"></div>
                <div>${formData.preparedBy}</div>
              </div>
              
              <div class="signature-box">
                <div style="font-weight: bold;">Certified true and correct by:</div>
                <div class="signature-line"></div>
                <div>${formData.certifiedBy}</div>
              </div>
              
              <div class="signature-box">
                <div style="font-weight: bold;">Received by:</div>
                <div class="signature-line"></div>
                <div>${formData.receivedBy}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    onPrint?.(printData);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 border-b">
        <div>
          <h2 className="text-2xl font-bold">Domestic Statement of Account</h2>
          <p className="text-gray-600">Create SOA for domestic services</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {formData.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Document Layout - Matching Reference Image */}
      <div className="p-6 space-y-6">
        {/* Company Header Section */}
        <div className="border-2 border-gray-800 p-4">
          <div className="flex items-center justify-between">
            {/* Company Logo and Name */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                S&B
              </div>
              <div>
                <div className="text-xl font-bold text-blue-800">
                  SAVE AND BEST
                </div>
                <div className="text-lg font-bold text-orange-500">
                  CARGO LOGISTICS CORPORATION
                </div>
                <div className="text-xs mt-1 space-y-1">
                  <div>{formData.vatRegNo}</div>
                  <div>{formData.telephone}</div>
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center">
              <h1 className="text-xl font-bold underline">
                STATEMENT OF
                <br />
                ACCOUNT
              </h1>
              <div className="border-2 border-gray-800 p-2 mt-3 font-bold">
                <Input
                  value={formData.soaNumber}
                  onChange={(e) =>
                    handleInputChange("soaNumber", e.target.value)
                  }
                  className="text-center font-bold border-0 p-0 h-auto bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bill To and Billing Reference Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bill To */}
          <div className="border-2 border-gray-800">
            <div className="bg-blue-100 p-2 text-center font-bold border-b border-gray-800">
              Bill To:
            </div>
            <div className="p-3 space-y-2">
              <Input
                value={formData.billToCompany}
                onChange={(e) =>
                  handleInputChange("billToCompany", e.target.value)
                }
                className="font-bold text-sm border-0 p-0 h-auto bg-transparent"
                placeholder="Company Name"
              />

              <Textarea
                value={formData.billToAddress}
                onChange={(e) =>
                  handleInputChange("billToAddress", e.target.value)
                }
                className="text-xs border-0 p-0 bg-transparent resize-none"
                rows={3}
                placeholder="Company Address"
              />
            </div>
          </div>

          {/* Billing Reference */}
          <div className="border-2 border-gray-800">
            <div className="bg-blue-100 p-2 text-center font-bold border-b border-gray-800">
              Billing Reference:
            </div>
            <div className="p-3">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-bold w-20">DATE:</td>
                    <td>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">ORIGIN:</td>
                    <td>
                      <Input
                        value={formData.billingReference.origin}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "origin",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="Origin"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">DESTINATION:</td>
                    <td>
                      <Input
                        value={formData.billingReference.destination}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "destination",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="Destination"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Description of Goods */}
        <div>
          <div className="bg-blue-100 p-2 text-center font-bold border-2 border-gray-800 border-b-0">
            Description of Goods
          </div>
          <div className="border-2 border-gray-800 p-3">
            <Textarea
              value={formData.goodsDescription}
              onChange={(e) =>
                handleInputChange("goodsDescription", e.target.value)
              }
              className="w-full border-0 p-0 bg-transparent resize-none"
              rows={2}
              placeholder="Enter description of goods/services..."
            />
          </div>
        </div>

        {/* Particulars Table */}
        <div>
          <div className="bg-blue-100 p-2 text-center font-bold border-2 border-gray-800 border-b-0">
            PARTICULARS
          </div>
          <table className="w-full border-2 border-gray-800 border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-800 p-2 text-center font-bold w-2/3">
                  PARTICULARS
                </th>
                <th className="border border-gray-800 p-2 text-center font-bold w-1/3">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.particularsItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-800 p-2">
                    <div className="flex items-center space-x-2">
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateParticularItem(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="flex-1 border-0 p-0 bg-transparent resize-none text-sm"
                        rows={1}
                        placeholder="Enter service description..."
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticularItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1 h-auto"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="border border-gray-800 p-2 text-right">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) =>
                        updateParticularItem(
                          item.id,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="text-right border-0 p-0 h-auto bg-transparent font-bold"
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-800 p-2" colSpan={2}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParticularItem}
                    className="w-full"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-800 p-2 text-center font-bold">
                  TOTAL AMOUNT
                </td>
                <td className="border border-gray-800 p-2 text-right font-bold">
                  PHP {formData.totals.particulars.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="font-bold mb-2">Prepared by:</div>
            <div className="border-b border-gray-800 h-12 mb-2"></div>
            <Input
              value={formData.preparedBy}
              onChange={(e) => handleInputChange("preparedBy", e.target.value)}
              className="text-center border-0 p-0 h-auto bg-transparent font-bold"
              placeholder="Name"
            />
          </div>

          <div className="text-center">
            <div className="font-bold mb-2">Certified true and correct by:</div>
            <div className="border-b border-gray-800 h-12 mb-2"></div>
            <Input
              value={formData.certifiedBy}
              onChange={(e) => handleInputChange("certifiedBy", e.target.value)}
              className="text-center border-0 p-0 h-auto bg-transparent font-bold"
              placeholder="Name"
            />
          </div>

          <div className="text-center">
            <div className="font-bold mb-2">Received by:</div>
            <div className="border-b border-gray-800 h-12 mb-2"></div>
            <Input
              value={formData.receivedBy}
              onChange={(e) => handleInputChange("receivedBy", e.target.value)}
              className="text-center border-0 p-0 h-auto bg-transparent font-bold"
              placeholder="Signature over printed Name"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button variant="outline" onClick={handleSave}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save
        </Button>

        <Button variant="outline" onClick={handlePrint}>
          <PrinterIcon className="h-4 w-4 mr-2" />
          Print
        </Button>

        <Button onClick={handleSubmit}>
          <SendIcon className="h-4 w-4 mr-2" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
