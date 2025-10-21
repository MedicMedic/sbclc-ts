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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DollarSignIcon,
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";

interface CashAdvanceDisbursementFormProps {
  cashAdvance: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export function CashAdvanceDisbursementForm({
  cashAdvance,
  onSubmit,
  onCancel,
}: CashAdvanceDisbursementFormProps) {
  const [formData, setFormData] = useState({
    disbursementDate: new Date().toISOString().split("T")[0],
    paymentMethod: "bank_transfer",
    bankName: "",
    accountNumber: "",
    accountName: "",
    referenceNumber: "",
    checkNumber: "",
    checkDate: "",
    disbursedAmount: cashAdvance?.totalAmount || 0,
    processingFee: 0,
    netAmount: cashAdvance?.totalAmount || 0,
    disbursedBy: "",
    receivedBy: cashAdvance?.requestedBy || "",
    notes: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate net amount
      if (field === "disbursedAmount" || field === "processingFee") {
        const disbursed = parseFloat(updated.disbursedAmount) || 0;
        const fee = parseFloat(updated.processingFee) || 0;
        updated.netAmount = disbursed - fee;
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const disbursementData = {
      ...formData,
      cashAdvanceId: cashAdvance.id,
      bookingId: cashAdvance.bookingId,
      requestedAmount: cashAdvance.totalAmount,
      currency: cashAdvance.currency,
      disbursementTimestamp: new Date().toISOString(),
    };

    onSubmit?.(disbursementData);
  };

  const paymentMethods = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "check", label: "Check" },
    { value: "cash", label: "Cash" },
    { value: "online_payment", label: "Online Payment" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cash Advance Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-600" />
            Cash Advance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-gray-600">CA Number</Label>
              <p className="font-semibold">{cashAdvance.id}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Booking ID</Label>
              <p className="font-semibold">{cashAdvance.bookingId}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Requested By</Label>
              <p className="font-semibold">{cashAdvance.requestedBy}</p>
              <p className="text-xs text-gray-500">{cashAdvance.department}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Amount</Label>
              <p className="font-semibold text-lg text-blue-600">
                {cashAdvance.currency}{" "}
                {cashAdvance.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <Separator />

          <div>
            <Label className="text-xs text-gray-600">Purpose</Label>
            <p className="text-sm">{cashAdvance.purpose}</p>
          </div>
        </CardContent>
      </Card>

      {/* Disbursement Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-600" />
            Disbursement Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="disbursementDate">
                Disbursement Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="disbursementDate"
                type="date"
                value={formData.disbursementDate}
                onChange={(e) =>
                  handleInputChange("disbursementDate", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="disbursedBy">
                Disbursed By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="disbursedBy"
                placeholder="Enter name of person processing disbursement"
                value={formData.disbursedBy}
                onChange={(e) =>
                  handleInputChange("disbursedBy", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="receivedBy">
                Received By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="receivedBy"
                placeholder="Enter name of recipient"
                value={formData.receivedBy}
                onChange={(e) =>
                  handleInputChange("receivedBy", e.target.value)
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-gray-600" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paymentMethod">
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bank Transfer Fields */}
          {formData.paymentMethod === "bank_transfer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="md:col-span-2">
                <Label htmlFor="bankName">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">
                  Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="accountName">
                  Account Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountName"
                  placeholder="Enter account name"
                  value={formData.accountName}
                  onChange={(e) =>
                    handleInputChange("accountName", e.target.value)
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="referenceNumber">
                  Reference/Transaction Number{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="referenceNumber"
                  placeholder="Enter bank reference or transaction number"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    handleInputChange("referenceNumber", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* Check Fields */}
          {formData.paymentMethod === "check" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="checkNumber">
                  Check Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkNumber"
                  placeholder="Enter check number"
                  value={formData.checkNumber}
                  onChange={(e) =>
                    handleInputChange("checkNumber", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkDate">
                  Check Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkDate"
                  type="date"
                  value={formData.checkDate}
                  onChange={(e) =>
                    handleInputChange("checkDate", e.target.value)
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bankName">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* Cash Fields */}
          {formData.paymentMethod === "cash" && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5" />

                <div>
                  <p className="font-medium text-amber-900">Cash Payment</p>
                  <p className="text-sm text-amber-700">
                    Please ensure proper documentation and receipt for cash
                    disbursements. A reference number is required for tracking.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="referenceNumber">
                  Receipt/Reference Number{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="referenceNumber"
                  placeholder="Enter receipt or reference number"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    handleInputChange("referenceNumber", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* Online Payment Fields */}
          {formData.paymentMethod === "online_payment" && (
            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="referenceNumber">
                  Transaction Reference Number{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="referenceNumber"
                  placeholder="Enter online payment reference number"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    handleInputChange("referenceNumber", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="bankName">Payment Platform/Gateway</Label>
                <Input
                  id="bankName"
                  placeholder="e.g., PayPal, GCash, PayMaya"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amount Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5 text-gray-600" />
            Amount Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="disbursedAmount">
                Disbursed Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="disbursedAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.disbursedAmount}
                onChange={(e) =>
                  handleInputChange("disbursedAmount", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="processingFee">Processing Fee</Label>
              <Input
                id="processingFee"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.processingFee}
                onChange={(e) =>
                  handleInputChange("processingFee", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="netAmount">Net Amount</Label>
              <Input
                id="netAmount"
                type="number"
                step="0.01"
                value={formData.netAmount}
                readOnly
                className="bg-gray-100 font-semibold"
              />
            </div>
          </div>

          {/* Amount Verification */}
          {formData.disbursedAmount !== cashAdvance.totalAmount && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5" />

                <div className="text-sm">
                  <p className="font-medium text-amber-900">
                    Amount Mismatch Detected
                  </p>
                  <p className="text-amber-700">
                    Disbursed amount ({cashAdvance.currency}{" "}
                    {parseFloat(formData.disbursedAmount).toLocaleString()})
                    differs from requested amount ({cashAdvance.currency}{" "}
                    {cashAdvance.totalAmount.toLocaleString()}). Please provide
                    explanation in notes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes & Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter any additional notes, remarks, or special instructions..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Process Disbursement
        </Button>
      </div>
    </form>
  );
}
