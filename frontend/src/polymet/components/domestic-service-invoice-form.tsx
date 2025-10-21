import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  SaveIcon,
  SendIcon,
  FileTextIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface DomesticServiceInvoiceFormProps {
  bookingId?: string;
  billingType: "domestic_trucking" | "domestic_forwarding";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

export function DomesticServiceInvoiceForm({
  bookingId,
  billingType,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: DomesticServiceInvoiceFormProps) {
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "GENTLE SUPREME PHILIPPINES, INC.",
    tinNumber: "221-818-356-000",
    address:
      "BLOCK 2 LOT 4, 6 & 8, LOCATED AT 1ST STREET, GOLDEN MILE BUSINESS PARK CARMONA, PHILIPPINES",

    // Document Information
    documentTitle: "SERVICE INVOICE",
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],

    // Service Details
    serviceDescription:
      "DELIVERY OF GOODS FROM GSPI WAREHOUSE TO ROBINSONS NORTH DC",

    // Service Items
    serviceItems: [
      {
        id: "item_001",
        description: "GSP CARMONA, CAVITE to ROBINSONS NORTH DC - PAMPANGA",
        details:
          "LMVV_D.D. No. 2220000579, PAGE 1-3_D.D. No. 2220000590, PAGE 1-3, DATED: 07/01/2025",
        spfNumber: "10072176",
        dateReceived: "06/01/2025",
        amount: 21100.0,
      },
      {
        id: "item_002",
        description: "GSP CARMONA, CAVITE to ROBINSONS NORTH DC - PAMPANGA",
        details:
          "LMVV_D.D. No. 2220000572, 2220000573, 2220000574, 2220000575, 2220000576, 2220000577, PAGE 1-3, DATED: 07/01/2025",
        spfNumber: "10072103",
        dateReceived: "01/31/2025",
        amount: 21100.0,
      },
    ],

    // Totals
    subtotal: 42200.0,
    vatAmount: 5064.0,
    totalAmount: 47264.0,

    // Footer
    preparedBy: "System Administrator",

    ...initialData,
  });

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.serviceItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const vatAmount = subtotal * 0.12; // 12% VAT
    const totalAmount = subtotal + vatAmount;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      vatAmount,
      totalAmount,
    }));
  }, [formData.serviceItems]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.serviceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      serviceItems: updatedItems,
    }));
  };

  const addServiceItem = () => {
    const newItem = {
      id: `item_${Date.now()}`,
      description: "",
      details: "",
      spfNumber: "",
      dateReceived: "",
      amount: 0,
    };

    setFormData((prev) => ({
      ...prev,
      serviceItems: [...prev.serviceItems, newItem],
    }));
  };

  const removeServiceItem = (index: number) => {
    const updatedItems = formData.serviceItems.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      serviceItems: updatedItems,
    }));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  const handlePrint = () => {
    onPrint?.(formData);

    // Create print window with formatted content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Service Invoice - ${formData.invoiceNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                font-size: 12px;
                line-height: 1.4;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border: 2px solid #000;
                padding: 15px;
              }
              .company-name { 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 5px; 
              }
              .company-details { 
                font-size: 11px; 
                margin-bottom: 10px; 
              }
              .document-title { 
                font-size: 16px; 
                font-weight: bold; 
                margin-top: 15px; 
              }
              .invoice-info { 
                text-align: right; 
                margin-bottom: 20px; 
                font-size: 11px;
              }
              .service-description { 
                text-align: center; 
                font-weight: bold; 
                margin: 20px 0; 
                padding: 10px;
                border: 1px solid #000;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px; 
              }
              th, td { 
                border: 1px solid #000; 
                padding: 8px; 
                text-align: left; 
                vertical-align: top;
              }
              th { 
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
              .amount-cell {
                text-align: right;
                font-weight: bold;
              }
              .total-row { 
                font-weight: bold; 
              }
              .footer-totals {
                margin-top: 20px;
                float: right;
                width: 300px;
              }
              .footer-totals table {
                margin-bottom: 0;
              }
              .clear { clear: both; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">${formData.companyName}</div>
              <div class="company-details">
                TIN: ${formData.tinNumber}<br>
                ${formData.address}
              </div>
              <div class="document-title">${formData.documentTitle}</div>
            </div>
            
            <div class="invoice-info">
              Invoice No: ${formData.invoiceNumber}<br>
              Date: ${new Date(formData.date).toLocaleDateString()}
            </div>
            
            <div class="service-description">
              ${formData.serviceDescription}
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 40%;">Service Description</th>
                  <th style="width: 15%;">SPF No.</th>
                  <th style="width: 15%;">Date Received</th>
                  <th style="width: 15%;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${formData.serviceItems
                  .map(
                    (item) => `
                  <tr>
                    <td>
                      <strong>${item.description}</strong><br>
                      <small>${item.details}</small>
                    </td>
                    <td class="text-center">${item.spfNumber}</td>
                    <td class="text-center">${item.dateReceived}</td>
                    <td class="amount-cell">₱ ${item.amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div class="footer-totals">
              <table>
                <tr>
                  <td>Sub-total:</td>
                  <td class="amount-cell">₱ ${formData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>VAT (12%):</td>
                  <td class="amount-cell">₱ ${formData.vatAmount.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>Total Amount:</strong></td>
                  <td class="amount-cell"><strong>₱ ${formData.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>
            
            <div class="clear"></div>
            
            <div style="margin-top: 60px;">
              <p><strong>Prepared By:</strong></p>
              <div style="margin-top: 40px; border-bottom: 1px solid #000; width: 200px;">
                <p style="text-align: center; padding-bottom: 5px;">${formData.preparedBy}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Domestic Service Invoice
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Company Header */}
          <div className="text-center border-2 border-gray-800 p-4 mb-6">
            <div className="text-xl font-bold mb-2">{formData.companyName}</div>
            <div className="text-sm mb-2">TIN: {formData.tinNumber}</div>
            <div className="text-sm mb-4">{formData.address}</div>
            <div className="text-lg font-bold">{formData.documentTitle}</div>
          </div>

          {/* Invoice Information */}
          <div className="flex justify-end mb-6">
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="invoiceNumber">Invoice Number:</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    handleInputChange("invoiceNumber", e.target.value)
                  }
                  className="w-40"
                  placeholder="INV-2024-001"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="date">Date:</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-6">
            <Label htmlFor="serviceDescription">Service Description</Label>
            <Textarea
              id="serviceDescription"
              value={formData.serviceDescription}
              onChange={(e) =>
                handleInputChange("serviceDescription", e.target.value)
              }
              className="mt-2 text-center font-semibold border-2 border-gray-800"
              rows={2}
            />
          </div>

          {/* Service Items Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Service Items</h3>
              <Button onClick={addServiceItem} size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="border border-gray-800 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border-r border-gray-800 text-center font-bold">
                      Service Description
                    </TableHead>
                    <TableHead className="border-r border-gray-800 text-center font-bold">
                      SPF No.
                    </TableHead>
                    <TableHead className="border-r border-gray-800 text-center font-bold">
                      Date Received
                    </TableHead>
                    <TableHead className="border-r border-gray-800 text-center font-bold">
                      Amount
                    </TableHead>
                    <TableHead className="text-center font-bold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.serviceItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="border-r border-gray-800 p-2">
                        <div className="space-y-2">
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Service description"
                            className="font-semibold"
                          />

                          <Textarea
                            value={item.details}
                            onChange={(e) =>
                              handleItemChange(index, "details", e.target.value)
                            }
                            placeholder="Additional details"
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-gray-800 p-2">
                        <Input
                          value={item.spfNumber}
                          onChange={(e) =>
                            handleItemChange(index, "spfNumber", e.target.value)
                          }
                          placeholder="SPF Number"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="border-r border-gray-800 p-2">
                        <Input
                          type="date"
                          value={item.dateReceived}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "dateReceived",
                              e.target.value
                            )
                          }
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="border-r border-gray-800 p-2">
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                          className="text-right font-bold"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeServiceItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-6">
            <div className="w-80">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold border border-gray-800">
                      Sub-total:
                    </TableCell>
                    <TableCell className="text-right font-bold border border-gray-800">
                      ₱ {formData.subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold border border-gray-800">
                      VAT (12%):
                    </TableCell>
                    <TableCell className="text-right font-bold border border-gray-800">
                      ₱ {formData.vatAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-yellow-100">
                    <TableCell className="font-bold border border-gray-800">
                      Total Amount:
                    </TableCell>
                    <TableCell className="text-right font-bold border border-gray-800">
                      ₱ {formData.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Prepared By Section */}
          <div className="mb-6">
            <Label htmlFor="preparedBy">Prepared By</Label>
            <Input
              id="preparedBy"
              value={formData.preparedBy}
              onChange={(e) => handleInputChange("preparedBy", e.target.value)}
              className="mt-2 w-64"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
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
        </CardContent>
      </Card>
    </div>
  );
}
