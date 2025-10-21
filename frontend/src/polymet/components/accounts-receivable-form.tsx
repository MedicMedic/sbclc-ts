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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface AccountsReceivableFormProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export function AccountsReceivableForm({
  invoice,
  isOpen,
  onClose,
  onSubmit,
}: AccountsReceivableFormProps) {
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    receivedBy: "",
    paymentMethod: "",
    orNumber: "",
    // Bank Transfer fields
    bankName: "",
    accountNumber: "",
    accountName: "",
    referenceNumber: "",
    // Check fields
    checkNumber: "",
    checkDate: "",
    checkBank: "",
    // Cash fields
    receiptNumber: "",
    // Online Payment fields
    transactionId: "",
    paymentPlatform: "",
    // Amount details
    amountReceived: invoice?.balanceAmount || 0,
    bankCharges: 0,
    netAmount: invoice?.balanceAmount || 0,
    // Additional info
    notes: "",
    collectedBy: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate net amount
      if (field === "amountReceived" || field === "bankCharges") {
        updated.netAmount =
          (parseFloat(updated.amountReceived) || 0) -
          (parseFloat(updated.bankCharges) || 0);
      }

      return updated;
    });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        ...formData,
        processedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  const amountMismatch = formData.amountReceived !== invoice?.balanceAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Process Accounts Receivable
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Invoice Number</p>
                  <p className="font-semibold text-gray-900">
                    {invoice?.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Client</p>
                  <p className="font-semibold text-gray-900">
                    {invoice?.clientName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Total Amount</p>
                  <p className="font-semibold text-gray-900">
                    {invoice?.currency} {invoice?.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Balance Due</p>
                  <p className="font-semibold text-red-600">
                    {invoice?.currency}{" "}
                    {invoice?.balanceAmount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payment Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentDate">
                  Payment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    handleInputChange("paymentDate", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="orNumber">
                  OR Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orNumber"
                  placeholder="Enter Official Receipt Number"
                  value={formData.orNumber}
                  onChange={(e) =>
                    handleInputChange("orNumber", e.target.value)
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
                  placeholder="Name of receiver"
                  value={formData.receivedBy}
                  onChange={(e) =>
                    handleInputChange("receivedBy", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="collectedBy">
                  Collected By <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="collectedBy"
                  placeholder="Name of collector"
                  value={formData.collectedBy}
                  onChange={(e) =>
                    handleInputChange("collectedBy", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
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
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online_payment">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bank Transfer Fields */}
            {formData.paymentMethod === "bank_transfer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="Enter account name"
                    value={formData.accountName}
                    onChange={(e) =>
                      handleInputChange("accountName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    placeholder="Enter reference number"
                    value={formData.referenceNumber}
                    onChange={(e) =>
                      handleInputChange("referenceNumber", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Check Fields */}
            {formData.paymentMethod === "check" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="checkNumber">Check Number</Label>
                  <Input
                    id="checkNumber"
                    placeholder="Enter check number"
                    value={formData.checkNumber}
                    onChange={(e) =>
                      handleInputChange("checkNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="checkDate">Check Date</Label>
                  <Input
                    id="checkDate"
                    type="date"
                    value={formData.checkDate}
                    onChange={(e) =>
                      handleInputChange("checkDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="checkBank">Bank Name</Label>
                  <Input
                    id="checkBank"
                    placeholder="Enter bank name"
                    value={formData.checkBank}
                    onChange={(e) =>
                      handleInputChange("checkBank", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Cash Fields */}
            {formData.paymentMethod === "cash" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />

                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Cash Payment Notice
                    </p>
                    <p className="text-xs text-yellow-700">
                      Please ensure proper documentation and receipt issuance
                      for cash payments.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="receiptNumber">Receipt Number</Label>
                  <Input
                    id="receiptNumber"
                    placeholder="Enter official receipt number"
                    value={formData.receiptNumber}
                    onChange={(e) =>
                      handleInputChange("receiptNumber", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Online Payment Fields */}
            {formData.paymentMethod === "online_payment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter transaction ID"
                    value={formData.transactionId}
                    onChange={(e) =>
                      handleInputChange("transactionId", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paymentPlatform">Payment Platform</Label>
                  <Input
                    id="paymentPlatform"
                    placeholder="e.g., PayPal, GCash, PayMaya"
                    value={formData.paymentPlatform}
                    onChange={(e) =>
                      handleInputChange("paymentPlatform", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Amount Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Amount Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amountReceived">
                  Amount Received <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amountReceived"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amountReceived}
                  onChange={(e) =>
                    handleInputChange("amountReceived", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankCharges">Bank Charges / Fees</Label>
                <Input
                  id="bankCharges"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.bankCharges}
                  onChange={(e) =>
                    handleInputChange("bankCharges", e.target.value)
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

            {/* Amount Mismatch Warning */}
            {amountMismatch && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />

                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Amount Mismatch Detected
                  </p>
                  <p className="text-xs text-yellow-700">
                    The amount received ({invoice?.currency}{" "}
                    {parseFloat(formData.amountReceived).toLocaleString()})
                    differs from the balance due ({invoice?.currency}{" "}
                    {invoice?.balanceAmount?.toLocaleString()}).
                    {formData.amountReceived < invoice?.balanceAmount
                      ? " This will be recorded as a partial payment."
                      : " This will be recorded as an overpayment."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes / Remarks</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or remarks about this payment..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />

                <h4 className="font-semibold text-green-900">
                  Payment Summary
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Amount Received</p>
                  <p className="font-semibold text-gray-900">
                    {invoice?.currency}{" "}
                    {parseFloat(formData.amountReceived || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Bank Charges</p>
                  <p className="font-semibold text-gray-900">
                    {invoice?.currency}{" "}
                    {parseFloat(formData.bankCharges || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Net Amount</p>
                  <p className="font-semibold text-green-600">
                    {invoice?.currency}{" "}
                    {parseFloat(formData.netAmount || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Remaining Balance</p>
                  <p
                    className={cn(
                      "font-semibold",
                      invoice?.balanceAmount - formData.netAmount > 0
                        ? "text-red-600"
                        : "text-green-600"
                    )}
                  >
                    {invoice?.currency}{" "}
                    {Math.max(
                      0,
                      invoice?.balanceAmount - formData.netAmount
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !formData.paymentDate ||
              !formData.orNumber ||
              !formData.receivedBy ||
              !formData.paymentMethod ||
              !formData.amountReceived
            }
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
