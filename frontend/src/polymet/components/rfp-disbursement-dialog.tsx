import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2Icon,
  AlertCircleIcon,
  BanknoteIcon,
  CreditCardIcon,
  BuildingIcon,
} from "lucide-react";

interface RFPDisbursementDialogProps {
  rfp: any;
  isOpen: boolean;
  onClose: () => void;
  onDisburse?: (data: any) => void;
}

export function RFPDisbursementDialog({
  rfp,
  isOpen,
  onClose,
  onDisburse,
}: RFPDisbursementDialogProps) {
  const [disbursementData, setDisbursementData] = useState({
    paymentMethod: rfp?.modeOfPayment === "Cash" ? "cash" : "bank_transfer",
    referenceNumber: "",
    checkNumber: "",
    bankName: "",
    accountNumber: "",
    disbursementDate: new Date().toISOString().split("T")[0],
    disbursedBy: "Finance Department",
    remarks: "",
    deductions: {
      withholdingTax: 0,
      otherDeductions: 0,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setDisbursementData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDeductionChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDisbursementData((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [field]: numValue,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!disbursementData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    if (disbursementData.paymentMethod === "check") {
      if (!disbursementData.checkNumber) {
        newErrors.checkNumber = "Check number is required";
      }
      if (!disbursementData.bankName) {
        newErrors.bankName = "Bank name is required";
      }
    }

    if (
      disbursementData.paymentMethod === "bank_transfer" &&
      !disbursementData.referenceNumber
    ) {
      newErrors.referenceNumber = "Reference number is required";
    }

    if (!disbursementData.disbursementDate) {
      newErrors.disbursementDate = "Disbursement date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDisburse = () => {
    if (!validateForm()) {
      return;
    }

    const totalDeductions =
      disbursementData.deductions.withholdingTax +
      disbursementData.deductions.otherDeductions;
    const netAmount = rfp.totalAmount - totalDeductions;

    const disbursementRecord = {
      rfpId: rfp.id,
      rfpNo: rfp.rfpNo,
      payeeName: rfp.pageeName,
      grossAmount: rfp.totalAmount,
      deductions: disbursementData.deductions,
      totalDeductions,
      netAmount,
      paymentMethod: disbursementData.paymentMethod,
      referenceNumber: disbursementData.referenceNumber,
      checkNumber: disbursementData.checkNumber,
      bankName: disbursementData.bankName,
      accountNumber: disbursementData.accountNumber,
      disbursementDate: disbursementData.disbursementDate,
      disbursedBy: disbursementData.disbursedBy,
      remarks: disbursementData.remarks,
      disbursedAt: new Date().toISOString(),
    };

    onDisburse?.(disbursementRecord);
    onClose();
  };

  if (!rfp) return null;

  const totalDeductions =
    disbursementData.deductions.withholdingTax +
    disbursementData.deductions.otherDeductions;
  const netAmount = rfp.totalAmount - totalDeductions;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BanknoteIcon className="w-5 h-5 text-green-600" />
            Disburse RFP Payment
          </DialogTitle>
          <DialogDescription>
            Process disbursement for approved RFP: {rfp.rfpNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* RFP Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RFP Number</p>
                <p className="font-semibold">{rfp.rfpNo}</p>
              </div>
              <Badge
                variant={rfp.status === "approved" ? "default" : "secondary"}
                className="bg-green-600"
              >
                <CheckCircle2Icon className="w-3 h-3 mr-1" />

                {rfp.status}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Payee Name</p>
                <p className="font-medium">{rfp.pageeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requesting Unit</p>
                <p className="font-medium">{rfp.requestingUnit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RFP Date</p>
                <p className="font-medium">{rfp.rfpDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{rfp.dueDate}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ₱{" "}
                {rfp.totalAmount.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Disbursement Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Disbursement Details</h3>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">
                Payment Method <span className="text-destructive">*</span>
              </Label>
              <Select
                value={disbursementData.paymentMethod}
                onValueChange={(value) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger
                  id="paymentMethod"
                  className={errors.paymentMethod ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <BanknoteIcon className="w-4 h-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="check">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-4 h-4" />
                      Check
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="w-4 h-4" />
                      Bank Transfer / Auto Debit
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircleIcon className="w-3 h-3" />

                  {errors.paymentMethod}
                </p>
              )}
            </div>

            {/* Check Details */}
            {disbursementData.paymentMethod === "check" && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="checkNumber">
                    Check Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkNumber"
                    value={disbursementData.checkNumber}
                    onChange={(e) =>
                      handleInputChange("checkNumber", e.target.value)
                    }
                    placeholder="Enter check number"
                    className={errors.checkNumber ? "border-destructive" : ""}
                  />

                  {errors.checkNumber && (
                    <p className="text-sm text-destructive">
                      {errors.checkNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">
                    Bank Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="bankName"
                    value={disbursementData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="Enter bank name"
                    className={errors.bankName ? "border-destructive" : ""}
                  />

                  {errors.bankName && (
                    <p className="text-sm text-destructive">
                      {errors.bankName}
                    </p>
                  )}
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={disbursementData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Enter account number (optional)"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {disbursementData.paymentMethod === "bank_transfer" && (
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">
                  Reference Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="referenceNumber"
                  value={disbursementData.referenceNumber}
                  onChange={(e) =>
                    handleInputChange("referenceNumber", e.target.value)
                  }
                  placeholder="Enter transaction reference number"
                  className={errors.referenceNumber ? "border-destructive" : ""}
                />

                {errors.referenceNumber && (
                  <p className="text-sm text-destructive">
                    {errors.referenceNumber}
                  </p>
                )}
              </div>
            )}

            {/* Disbursement Date */}
            <div className="space-y-2">
              <Label htmlFor="disbursementDate">
                Disbursement Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="disbursementDate"
                type="date"
                value={disbursementData.disbursementDate}
                onChange={(e) =>
                  handleInputChange("disbursementDate", e.target.value)
                }
                className={errors.disbursementDate ? "border-destructive" : ""}
              />

              {errors.disbursementDate && (
                <p className="text-sm text-destructive">
                  {errors.disbursementDate}
                </p>
              )}
            </div>

            {/* Deductions */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">Deductions (Optional)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="withholdingTax">Withholding Tax (₱)</Label>
                  <Input
                    id="withholdingTax"
                    type="number"
                    step="0.01"
                    min="0"
                    value={disbursementData.deductions.withholdingTax}
                    onChange={(e) =>
                      handleDeductionChange("withholdingTax", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherDeductions">Other Deductions (₱)</Label>
                  <Input
                    id="otherDeductions"
                    type="number"
                    step="0.01"
                    min="0"
                    value={disbursementData.deductions.otherDeductions}
                    onChange={(e) =>
                      handleDeductionChange("otherDeductions", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gross Amount:</span>
                <span className="font-medium">
                  ₱{" "}
                  {rfp.totalAmount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              {totalDeductions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Deductions:
                  </span>
                  <span className="font-medium text-red-600">
                    - ₱{" "}
                    {totalDeductions.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold text-lg">Net Amount:</span>
                <span className="font-bold text-xl text-green-600">
                  ₱{" "}
                  {netAmount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={disbursementData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder="Enter any additional notes or remarks (optional)"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleDisburse}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2Icon className="w-4 h-4 mr-2" />
            Process Disbursement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
