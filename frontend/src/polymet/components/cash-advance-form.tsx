import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PlusIcon,
  TrashIcon,
  SaveIcon,
  SendIcon,
  FileTextIcon,
} from "lucide-react";
import { currencies } from "@/polymet/data/logistics-data";

interface CashAdvanceFormProps {
  bookingId?: string;
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  initialData?: any;
}

interface CashAdvanceItem {
  id: string;
  particular: string;
  description: string;
  amount: number;
  currency: string;
  supplier: string;
  dueDate: string;
  category: string;
}

const expenseCategories = [
  "Customs Duties",
  "Port Charges",
  "Storage Fees",
  "Transportation",
  "Documentation",
  "Inspection Fees",
  "Insurance",
  "Handling Charges",
  "Other Expenses",
];

export function CashAdvanceForm({
  bookingId,
  onSubmit,
  onSave,
  initialData,
}: CashAdvanceFormProps) {
  const [formData, setFormData] = useState({
    caNumber: initialData?.caNumber || `CA-${Date.now()}`,
    bookingId: bookingId || initialData?.bookingId || "",
    requestedBy: initialData?.requestedBy || "",
    department: initialData?.department || "Booking",
    purpose: initialData?.purpose || "",
    urgency: initialData?.urgency || "normal",
    requestedDate:
      initialData?.requestedDate || new Date().toISOString().split("T")[0],
    requiredDate: initialData?.requiredDate || "",
    status: initialData?.status || "draft",
    remarks: initialData?.remarks || "",
  });

  const [items, setItems] = useState<CashAdvanceItem[]>(
    initialData?.items || []
  );
  const [newItem, setNewItem] = useState<Partial<CashAdvanceItem>>({
    particular: "",
    description: "",
    amount: 0,
    currency: "PHP",
    supplier: "",
    dueDate: "",
    category: "",
  });

  const addItem = () => {
    if (newItem.particular && newItem.amount && newItem.amount > 0) {
      const item: CashAdvanceItem = {
        id: Date.now().toString(),
        particular: newItem.particular!,
        description: newItem.description || "",
        amount: newItem.amount!,
        currency: newItem.currency || "PHP",
        supplier: newItem.supplier || "",
        dueDate: newItem.dueDate || "",
        category: newItem.category || "",
      };
      setItems([...items, item]);
      setNewItem({
        particular: "",
        description: "",
        amount: 0,
        currency: "PHP",
        supplier: "",
        dueDate: "",
        category: "",
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CashAdvanceItem, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = (action: "save" | "submit") => {
    const cashAdvanceData = {
      ...formData,
      items,
      totalAmount: calculateTotal(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (action === "save") {
      onSave?.(cashAdvanceData);
    } else {
      onSubmit?.(cashAdvanceData);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { variant: "secondary" as const, label: "Low Priority" },
      normal: {
        variant: "default" as const,
        label: "Normal",
        className: "bg-blue-600",
      },
      high: {
        variant: "default" as const,
        label: "High Priority",
        className: "bg-orange-600",
      },
      urgent: { variant: "destructive" as const, label: "Urgent" },
    };

    const config =
      urgencyConfig[urgency as keyof typeof urgencyConfig] ||
      urgencyConfig.normal;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5" />

              <span>Cash Advance Request</span>
            </div>
            <Badge
              variant={formData.status === "approved" ? "default" : "secondary"}
            >
              {formData.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="caNumber">CA Number</Label>
              <Input
                id="caNumber"
                value={formData.caNumber}
                onChange={(e) =>
                  setFormData({ ...formData, caNumber: e.target.value })
                }
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="bookingId">Booking ID</Label>
              <Input
                id="bookingId"
                value={formData.bookingId}
                onChange={(e) =>
                  setFormData({ ...formData, bookingId: e.target.value })
                }
                placeholder="Enter booking ID"
              />
            </div>
            <div>
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy}
                onChange={(e) =>
                  setFormData({ ...formData, requestedBy: e.target.value })
                }
                placeholder="Enter requester name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Customs">Customs</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) =>
                  setFormData({ ...formData, urgency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="requestedDate">Requested Date</Label>
              <Input
                id="requestedDate"
                type="date"
                value={formData.requestedDate}
                onChange={(e) =>
                  setFormData({ ...formData, requestedDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="requiredDate">Required Date</Label>
              <Input
                id="requiredDate"
                type="date"
                value={formData.requiredDate}
                onChange={(e) =>
                  setFormData({ ...formData, requiredDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              placeholder="Describe the purpose of this cash advance..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Item */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Add New Expense Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              <div>
                <Label htmlFor="particular">Particular</Label>
                <Input
                  id="particular"
                  value={newItem.particular}
                  onChange={(e) =>
                    setNewItem({ ...newItem, particular: e.target.value })
                  }
                  placeholder="Expense item"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newItem.amount}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newItem.currency}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={newItem.supplier}
                  onChange={(e) =>
                    setNewItem({ ...newItem, supplier: e.target.value })
                  }
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addItem} className="w-full">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600 border-b pb-2">
                <div className="col-span-2">Particular</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Currency</div>
                <div className="col-span-2">Supplier</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Description</div>
                <div className="col-span-1">Action</div>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center py-2 border-b"
                >
                  <div className="col-span-2">
                    <Input
                      value={item.particular}
                      onChange={(e) =>
                        updateItem(item.id, "particular", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "amount",
                          parseFloat(e.target.value)
                        )
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm">{item.currency}</span>
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={item.supplier}
                      onChange={(e) =>
                        updateItem(item.id, "supplier", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) =>
                        updateItem(item.id, "dueDate", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="text-sm"
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {items.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-gray-800">
                    PHP {calculateTotal().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="Additional remarks or special instructions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => handleSubmit("save")}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit("submit")}>
          <SendIcon className="h-4 w-4 mr-2" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
