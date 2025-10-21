import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  SaveIcon,
  SendIcon,
  PrinterIcon,
} from "lucide-react";
import { payees } from "@/polymet/data/logistics-data";

interface RFPParticular {
  id: string;
  charging: string;
  invoiceNo: string;
  ifdNo: string;
  unitPort: string;
  description: string;
  amount: number;
}

interface RFPEntryFormProps {
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

export function RFPEntryForm({
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: RFPEntryFormProps) {
  const [formData, setFormData] = useState({
    rfpNo: initialData?.rfpNo || "",
    rfpDate: initialData?.rfpDate || new Date().toISOString().split("T")[0],
    dueDate: initialData?.dueDate || new Date().toISOString().split("T")[0],
    pageeName: initialData?.pageeName || "",
    requestingUnit: initialData?.requestingUnit || "",
    modeOfPayment: initialData?.modeOfPayment || "Cash",
    rfpAmount: initialData?.rfpAmount || 0,
    preparedBy: initialData?.preparedBy || "",
    reviewedBy: initialData?.reviewedBy || "",
    approvedBy: initialData?.approvedBy || "",
  });

  const [particulars, setParticulars] = useState<RFPParticular[]>(
    initialData?.particulars || [
      {
        id: "1",
        charging: "",
        invoiceNo: "",
        ifdNo: "",
        unitPort: "",
        description: "",
        amount: 0,
      },
    ]
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleParticularChange = (
    id: string,
    field: keyof RFPParticular,
    value: any
  ) => {
    setParticulars((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "amount" ? parseFloat(value) || 0 : value,
            }
          : item
      )
    );
  };

  const addParticular = () => {
    const newId = (particulars.length + 1).toString();
    setParticulars((prev) => [
      ...prev,
      {
        id: newId,
        charging: "",
        invoiceNo: "",
        ifdNo: "",
        unitPort: "",
        description: "",
        amount: 0,
      },
    ]);
  };

  const removeParticular = (id: string) => {
    if (particulars.length > 1) {
      setParticulars((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const calculateTotal = () => {
    return particulars.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      particulars,
      totalAmount: calculateTotal(),
      status: "pending",
    };
    onSubmit?.(data);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      particulars,
      totalAmount: calculateTotal(),
      status: "draft",
    };
    onSave?.(data);
  };

  const handlePrint = () => {
    const data = {
      ...formData,
      particulars,
      totalAmount: calculateTotal(),
    };
    onPrint?.(data);
  };

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <Card>
        <CardHeader className="text-center border-b border-border pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SB</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-blue-900">
                SAVE AND BEST
              </h1>
              <p className="text-sm text-orange-500 font-semibold">
                CARGO LOGISTICS CORPORATION
              </p>
            </div>
          </div>
          <h2 className="text-xl font-bold mt-4 border-t border-b border-border py-2">
            REQUEST FOR PAYMENT
          </h2>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payee's Name:</Label>
                  <Select
                    value={formData.pageeName}
                    onValueChange={(value) =>
                      handleInputChange("pageeName", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payee" />
                    </SelectTrigger>
                    <SelectContent>
                      {payees.map((payee) => (
                        <SelectItem key={payee.id} value={payee.name}>
                          {payee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Mode of Payment:</Label>
                  <Select
                    value={formData.modeOfPayment}
                    onValueChange={(value) =>
                      handleInputChange("modeOfPayment", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Check Deposit">
                        Check Deposit
                      </SelectItem>
                      <SelectItem value="Auto Debit">Auto Debit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Requesting Unit:</Label>
                <Select
                  value={formData.requestingUnit}
                  onValueChange={(value) =>
                    handleInputChange("requestingUnit", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by Port (SBCLC-Cavite or Cebu or CDD or Davao)">
                      by Port (SBCLC-Cavite or Cebu or CDD or Davao)
                    </SelectItem>
                    <SelectItem value="SBCLC-Manila">SBCLC-Manila</SelectItem>
                    <SelectItem value="SBCLC-Cebu">SBCLC-Cebu</SelectItem>
                    <SelectItem value="SBCLC-Davao">SBCLC-Davao</SelectItem>
                    <SelectItem value="SBCLC-Cavite">SBCLC-Cavite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>RFP DATE:</Label>
                  <Input
                    type="date"
                    value={formData.rfpDate}
                    onChange={(e) =>
                      handleInputChange("rfpDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>DUE DATE:</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>RFP No.:</Label>
                  <Input
                    value={formData.rfpNo}
                    onChange={(e) => handleInputChange("rfpNo", e.target.value)}
                    placeholder="2025-CEBU-01"
                  />
                </div>
                <div>
                  <Label>RFP Amount:</Label>
                  <Input
                    type="number"
                    value={calculateTotal()}
                    readOnly
                    className="font-bold bg-muted"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Particulars Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">
                Particulars:{" "}
                <span className="text-muted-foreground text-sm">
                  (complete descriptions at least 1000 characters--for history
                  verification)
                </span>
              </Label>
              <Button onClick={addParticular} size="sm" variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Line
              </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="w-[120px]">Charging</TableHead>
                    <TableHead className="w-[150px]">
                      Invoice No./IFD No./OR No.
                    </TableHead>
                    <TableHead className="w-[120px]">Unit/Port</TableHead>
                    <TableHead>Description (Amount)</TableHead>
                    <TableHead className="w-[150px] text-right">
                      Amount
                    </TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {particulars.map((particular) => (
                    <TableRow key={particular.id}>
                      <TableCell>
                        <Input
                          value={particular.charging}
                          onChange={(e) =>
                            handleParticularChange(
                              particular.id,
                              "charging",
                              e.target.value
                            )
                          }
                          placeholder="BL#1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={particular.invoiceNo}
                          onChange={(e) =>
                            handleParticularChange(
                              particular.id,
                              "invoiceNo",
                              e.target.value
                            )
                          }
                          placeholder="SI#000"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={particular.unitPort}
                          onChange={(e) =>
                            handleParticularChange(
                              particular.id,
                              "unitPort",
                              e.target.value
                            )
                          }
                          placeholder="IMPORT-CEBU"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={particular.description}
                          onChange={(e) =>
                            handleParticularChange(
                              particular.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Cebu new shipment request-CSPI-BL#1 THC-P888, Cont. Dep.-P888..."
                          className="min-h-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={particular.amount}
                          onChange={(e) =>
                            handleParticularChange(
                              particular.id,
                              "amount",
                              e.target.value
                            )
                          }
                          className="text-right"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticular(particular.id)}
                          disabled={particulars.length === 1}
                        >
                          <TrashIcon className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted font-bold">
                    <TableCell colSpan={4} className="text-right">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-right text-lg">
                      ₱
                      {calculateTotal().toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Approval Section */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            <div>
              <Label>Prepared by:</Label>
              <Input
                value={formData.preparedBy}
                onChange={(e) =>
                  handleInputChange("preparedBy", e.target.value)
                }
                placeholder="Name"
              />
            </div>
            <div>
              <Label>Reviewed by:</Label>
              <Input
                value={formData.reviewedBy}
                onChange={(e) =>
                  handleInputChange("reviewedBy", e.target.value)
                }
                placeholder="Name"
                disabled
              />
            </div>
            <div>
              <Label>Approved by:</Label>
              <Input
                value={formData.approvedBy}
                onChange={(e) =>
                  handleInputChange("approvedBy", e.target.value)
                }
                placeholder="Name"
                disabled
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={handleSave}>
              <SaveIcon className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <SendIcon className="w-4 h-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
