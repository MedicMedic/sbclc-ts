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
  CalculatorIcon,
  FileTextIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface CostAnalysisItem {
  id: string;
  description: string;
  quotedAmount: number;
  requestedAmount: number;
  actualAmount: number;
  variance: number;
  category: "receipted" | "non_receipted";
  remarks?: string;
}

interface CostAnalysisFormProps {
  bookingId?: string;
  quotationId?: string;
  cashAdvanceId?: string;
  billingType: "import_brokerage" | "import_forwarding";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  initialData?: any;
}

export function CostAnalysisForm({
  bookingId,
  quotationId,
  cashAdvanceId,
  billingType,
  onSubmit,
  onSave,
  initialData,
}: CostAnalysisFormProps) {
  const [items, setItems] = useState<CostAnalysisItem[]>([
    {
      id: "1",
      description: "Port Charges",
      quotedAmount: 200.0,
      requestedAmount: 200.0,
      actualAmount: 0,
      variance: 0,
      category: "receipted",
    },
  ]);

  const [formData, setFormData] = useState({
    bookingId: bookingId || "",
    quotationId: quotationId || "",
    cashAdvanceId: cashAdvanceId || "",
    billingType,
    currency: "USD",
    exchangeRate: 56.5,
    remarks: "",
    preparedBy: "Sarah Chen",
    preparedDate: new Date().toISOString().split("T")[0],
  });

  // Calculate totals
  const totals = items.reduce(
    (acc, item) => ({
      quotedAmount: acc.quotedAmount + item.quotedAmount,
      requestedAmount: acc.requestedAmount + item.requestedAmount,
      actualAmount: acc.actualAmount + item.actualAmount,
      variance: acc.variance + item.variance,
    }),
    { quotedAmount: 0, requestedAmount: 0, actualAmount: 0, variance: 0 }
  );

  const addItem = () => {
    const newItem: CostAnalysisItem = {
      id: Date.now().toString(),
      description: "",
      quotedAmount: 0,
      requestedAmount: 0,
      actualAmount: 0,
      variance: 0,
      category: "receipted",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof CostAnalysisItem,
    value: any
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate variance when actual amount changes
          if (field === "actualAmount") {
            updatedItem.variance =
              updatedItem.actualAmount - updatedItem.requestedAmount;
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
      totals,
      status: "pending_approval",
    };
    onSubmit?.(data);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      items,
      totals,
      status: "draft",
    };
    onSave?.(data);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600";
    if (variance < 0) return "text-green-600";
    return "text-gray-600";
  };

  const getVarianceBadge = (variance: number) => {
    if (variance > 0)
      return (
        <Badge variant="destructive" className="text-xs">
          Over
        </Badge>
      );

    if (variance < 0)
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-800"
        >
          Under
        </Badge>
      );

    return (
      <Badge variant="outline" className="text-xs">
        Exact
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5" />
            Cost Analysis -{" "}
            {billingType === "import_brokerage"
              ? "Import Brokerage"
              : "Import Forwarding"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Booking ID</Label>
              <Input
                value={formData.bookingId}
                onChange={(e) =>
                  setFormData({ ...formData, bookingId: e.target.value })
                }
                placeholder="BK-2024-001"
              />
            </div>
            <div>
              <Label>Quotation ID</Label>
              <Input
                value={formData.quotationId}
                onChange={(e) =>
                  setFormData({ ...formData, quotationId: e.target.value })
                }
                placeholder="QT-2024-001"
              />
            </div>
            <div>
              <Label>Cash Advance ID</Label>
              <Input
                value={formData.cashAdvanceId}
                onChange={(e) =>
                  setFormData({ ...formData, cashAdvanceId: e.target.value })
                }
                placeholder="CA-2024-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Exchange Rate</Label>
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
              <Label>Prepared Date</Label>
              <Input
                type="date"
                value={formData.preparedDate}
                onChange={(e) =>
                  setFormData({ ...formData, preparedDate: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Cost Analysis Items</CardTitle>
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
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quoted Amount</TableHead>
                  <TableHead className="text-right">Requested Amount</TableHead>
                  <TableHead className="text-right">Actual Amount</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead>Status</TableHead>
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
                      <Select
                        value={item.category}
                        onValueChange={(value) =>
                          updateItem(item.id, "category", value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receipted">Receipted</SelectItem>
                          <SelectItem value="non_receipted">
                            Non-Receipted
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.quotedAmount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quotedAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="text-right w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.requestedAmount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "requestedAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="text-right w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.actualAmount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "actualAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="text-right w-[120px]"
                      />
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        getVarianceColor(item.variance)
                      )}
                    >
                      {item.variance.toFixed(2)}
                    </TableCell>
                    <TableCell>{getVarianceBadge(item.variance)}</TableCell>
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
          <Separator className="my-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Quoted</div>
              <div className="text-lg font-semibold">
                {formData.currency} {totals.quotedAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Requested</div>
              <div className="text-lg font-semibold">
                {formData.currency} {totals.requestedAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Actual</div>
              <div className="text-lg font-semibold">
                {formData.currency} {totals.actualAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Variance</div>
              <div
                className={cn(
                  "text-lg font-semibold",
                  getVarianceColor(totals.variance)
                )}
              >
                {formData.currency} {totals.variance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Variance Alert */}
          {Math.abs(totals.variance) > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangleIcon className="h-4 w-4" />

                <span className="font-medium">Variance Detected</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                {totals.variance > 0
                  ? `Total actual expenses exceed requested amount by ${formData.currency} ${totals.variance.toFixed(2)}`
                  : `Total actual expenses are under requested amount by ${formData.currency} ${Math.abs(totals.variance).toFixed(2)}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Remarks & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            placeholder="Add any remarks or notes about the cost analysis..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          Prepared by: {formData.preparedBy} on {formData.preparedDate}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>Submit for Approval</Button>
        </div>
      </div>
    </div>
  );
}
