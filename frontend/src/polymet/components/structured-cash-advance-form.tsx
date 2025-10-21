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
  FileTextIcon,
  InfoIcon,
  DollarSignIcon,
} from "lucide-react";

interface StructuredCashAdvanceFormProps {
  bookingId?: string;
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  initialData?: any;
}

interface ContainerCharge {
  id: string;
  description: string;
  container40: number;
  container20: number;
  chargeType: "fixed" | "variable" | "per-container";
  category: string;
}

const defaultCharges: ContainerCharge[] = [
  // Terminal Charges
  {
    id: "arastre_1",
    description: "ARRASTRE",
    container40: 4215.2,
    container20: 0,
    chargeType: "variable",
    category: "Terminal Charges",
  },
  {
    id: "arastre_2",
    description: "ARRASTRE",
    container40: 2523.4,
    container20: 0,
    chargeType: "variable",
    category: "Terminal Charges",
  },
  {
    id: "wharfage_1",
    description: "WHARFAGE",
    container40: 1701.04,
    container20: 0,
    chargeType: "variable",
    category: "Terminal Charges",
  },
  {
    id: "wharfage_2",
    description: "WHARFAGE",
    container40: 1076.68,
    container20: 0,
    chargeType: "variable",
    category: "Terminal Charges",
  },
  {
    id: "wharfage_3",
    description: "WHARFAGE",
    container40: 1562.0,
    container20: 0,
    chargeType: "variable",
    category: "Terminal Charges",
  },
  // Processing Fees
  {
    id: "processing_fixed",
    description: "PROCESSING FEE (FIXED)",
    container40: 2000.0,
    container20: 2000.0,
    chargeType: "fixed",
    category: "Processing Fees",
  },
  {
    id: "processors_fixed",
    description: "PROCESSOR'S FEE (FIXED)",
    container40: 1500.0,
    container20: 1500.0,
    chargeType: "fixed",
    category: "Processing Fees",
  },
  // Other Charges
  {
    id: "other_tgcp_40",
    description: "OTHER CHARGES: (TGCP) 40- Per Container",
    container40: 160.0,
    container20: 0,
    chargeType: "per-container",
    category: "Other Charges",
  },
  {
    id: "other_tgcp_20",
    description: "OTHER CHARGES: (TGCP) 20- Per Container",
    container40: 0,
    container20: 160.0,
    chargeType: "per-container",
    category: "Other Charges",
  },
  // Miscellaneous
  {
    id: "photocopy",
    description: "PHOTOCOPY (PER BL)",
    container40: 200.0,
    container20: 200.0,
    chargeType: "fixed",
    category: "Miscellaneous",
  },
];

export function StructuredCashAdvanceForm({
  bookingId,
  onSubmit,
  onSave,
  initialData,
}: StructuredCashAdvanceFormProps) {
  const [formData, setFormData] = useState({
    caNumber: initialData?.caNumber || `CA-${Date.now()}`,
    bookingId: bookingId || initialData?.bookingId || "",
    consignee: initialData?.consignee || "GENTLE SUPREME PHILIPPINES INC",
    blNumber: initialData?.blNumber || "SITGJTCB150158",
    selectivityColor: initialData?.selectivityColor || "TENTATIVE ORANGE",
    container40Count: initialData?.container40Count || 0,
    container20Count: initialData?.container20Count || 0,
    requestedBy: initialData?.requestedBy || "",
    department: initialData?.department || "Booking",
    urgency: initialData?.urgency || "normal",
    requestedDate:
      initialData?.requestedDate || new Date().toISOString().split("T")[0],
    requiredDate: initialData?.requiredDate || "",
    status: initialData?.status || "draft",
    remarks: initialData?.remarks || "",
    bankDetails:
      initialData?.bankDetails || "BDO SAVINGS MARLON P. SENO (01234800166B)",
    ewtNote:
      initialData?.ewtNote ||
      "ALWAYS APPLY EWT FOR ALL GSPI SHIPMENTS, EWT ALREADY DEDUCTED",
  });

  const [charges, setCharges] = useState<ContainerCharge[]>(
    initialData?.charges || defaultCharges
  );

  const [customCharges, setCustomCharges] = useState<ContainerCharge[]>(
    initialData?.customCharges || []
  );

  const [newCharge, setNewCharge] = useState<Partial<ContainerCharge>>({
    description: "",
    container40: 0,
    container20: 0,
    chargeType: "variable",
    category: "Other Charges",
  });

  const addCustomCharge = () => {
    if (newCharge.description) {
      const charge: ContainerCharge = {
        id: `custom_${Date.now()}`,
        description: newCharge.description!,
        container40: newCharge.container40 || 0,
        container20: newCharge.container20 || 0,
        chargeType: newCharge.chargeType || "variable",
        category: newCharge.category || "Other Charges",
      };
      setCustomCharges([...customCharges, charge]);
      setNewCharge({
        description: "",
        container40: 0,
        container20: 0,
        chargeType: "variable",
        category: "Other Charges",
      });
    }
  };

  const removeCustomCharge = (id: string) => {
    setCustomCharges(customCharges.filter((charge) => charge.id !== id));
  };

  const updateCharge = (
    id: string,
    field: keyof ContainerCharge,
    value: any
  ) => {
    setCharges(
      charges.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const calculateCategoryTotal = (
    category: string,
    containerType: "40" | "20"
  ) => {
    const allCharges = [...charges, ...customCharges];
    const categoryCharges = allCharges.filter((c) => c.category === category);

    if (containerType === "40") {
      return categoryCharges.reduce(
        (sum, charge) => sum + charge.container40 * formData.container40Count,
        0
      );
    } else {
      return categoryCharges.reduce(
        (sum, charge) => sum + charge.container20 * formData.container20Count,
        0
      );
    }
  };

  const calculateTotal = () => {
    const allCharges = [...charges, ...customCharges];
    const total40 = allCharges.reduce(
      (sum, charge) => sum + charge.container40 * formData.container40Count,
      0
    );
    const total20 = allCharges.reduce(
      (sum, charge) => sum + charge.container20 * formData.container20Count,
      0
    );
    return total40 + total20;
  };

  const handleSubmit = (action: "save" | "submit") => {
    const cashAdvanceData = {
      ...formData,
      charges,
      customCharges,
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

  const categories = [
    "Terminal Charges",
    "Processing Fees",
    "Other Charges",
    "Miscellaneous",
  ];

  const getChargeTypeBadge = (type: string) => {
    const config = {
      fixed: {
        variant: "default" as const,
        label: "Fixed",
        className: "bg-blue-600",
      },
      variable: {
        variant: "default" as const,
        label: "Variable",
        className: "bg-green-600",
      },
      "per-container": {
        variant: "default" as const,
        label: "Per Container",
        className: "bg-orange-600",
      },
    };
    const c = config[type as keyof typeof config] || config.variable;
    return (
      <Badge variant={c.variant} className={`${c.className} text-xs`}>
        {c.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5" />

              <span>Structured Cash Advance Request</span>
            </div>
            <Badge
              variant={formData.status === "approved" ? "default" : "secondary"}
            >
              {formData.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information */}
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

          {/* Consignee Information */}
          <Separator />

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg flex items-center">
              <InfoIcon className="h-5 w-5 mr-2 text-blue-600" />
              Consignee & Shipment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consignee">Consignee</Label>
                <Input
                  id="consignee"
                  value={formData.consignee}
                  onChange={(e) =>
                    setFormData({ ...formData, consignee: e.target.value })
                  }
                  placeholder="Consignee name"
                />
              </div>
              <div>
                <Label htmlFor="blNumber">BL No.</Label>
                <Input
                  id="blNumber"
                  value={formData.blNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, blNumber: e.target.value })
                  }
                  placeholder="Bill of Lading number"
                />
              </div>
              <div>
                <Label htmlFor="selectivityColor">Selectivity Color</Label>
                <Input
                  id="selectivityColor"
                  value={formData.selectivityColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selectivityColor: e.target.value,
                    })
                  }
                  placeholder="e.g., TENTATIVE ORANGE"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="container40Count">
                    No. of Containers (40')
                  </Label>
                  <Input
                    id="container40Count"
                    type="number"
                    min="0"
                    value={formData.container40Count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        container40Count: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="container20Count">
                    No. of Containers (20')
                  </Label>
                  <Input
                    id="container20Count"
                    type="number"
                    min="0"
                    value={formData.container20Count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        container20Count: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Request Details */}
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
        </CardContent>
      </Card>

      {/* Financial Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            Financial Breakdown - Rate Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Charges by Category */}
          {categories.map((category) => {
            const categoryCharges = charges.filter(
              (c) => c.category === category
            );
            const customCategoryCharges = customCharges.filter(
              (c) => c.category === category
            );
            const allCategoryCharges = [
              ...categoryCharges,
              ...customCategoryCharges,
            ];

            if (allCategoryCharges.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      40' Total: ₱
                      {calculateCategoryTotal(category, "40").toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </span>
                    <span className="text-gray-600">
                      20' Total: ₱
                      {calculateCategoryTotal(category, "20").toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-100 dark:bg-orange-950">
                        <TableHead className="font-semibold">
                          Particulars
                        </TableHead>
                        <TableHead className="text-right font-semibold bg-orange-200 dark:bg-orange-900">
                          1x40
                        </TableHead>
                        <TableHead className="text-right font-semibold bg-orange-200 dark:bg-orange-900">
                          1x20
                        </TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allCategoryCharges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell>
                            <Input
                              value={charge.description}
                              onChange={(e) =>
                                updateCharge(
                                  charge.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="border-0 focus-visible:ring-0"
                            />
                          </TableCell>
                          <TableCell className="text-right bg-orange-50 dark:bg-orange-950/30">
                            <Input
                              type="number"
                              step="0.01"
                              value={charge.container40}
                              onChange={(e) =>
                                updateCharge(
                                  charge.id,
                                  "container40",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="text-right border-0 focus-visible:ring-0 bg-transparent"
                            />
                          </TableCell>
                          <TableCell className="text-right bg-orange-50 dark:bg-orange-950/30">
                            <Input
                              type="number"
                              step="0.01"
                              value={charge.container20}
                              onChange={(e) =>
                                updateCharge(
                                  charge.id,
                                  "container20",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="text-right border-0 focus-visible:ring-0 bg-transparent"
                            />
                          </TableCell>
                          <TableCell>
                            {charge.id.startsWith("custom_") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCustomCharge(charge.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}

          {/* Add Custom Charge */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h4 className="font-medium mb-3">Add Custom Charge</h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <Label htmlFor="newDescription">Description</Label>
                <Input
                  id="newDescription"
                  value={newCharge.description}
                  onChange={(e) =>
                    setNewCharge({ ...newCharge, description: e.target.value })
                  }
                  placeholder="Charge description"
                />
              </div>
              <div>
                <Label htmlFor="newCategory">Category</Label>
                <Select
                  value={newCharge.category}
                  onValueChange={(value) =>
                    setNewCharge({ ...newCharge, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newChargeType">Charge Type</Label>
                <Select
                  value={newCharge.chargeType}
                  onValueChange={(value: any) =>
                    setNewCharge({ ...newCharge, chargeType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                    <SelectItem value="per-container">Per Container</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new40">Rate (40')</Label>
                <Input
                  id="new40"
                  type="number"
                  step="0.01"
                  value={newCharge.container40}
                  onChange={(e) =>
                    setNewCharge({
                      ...newCharge,
                      container40: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="new20">Rate (20')</Label>
                <Input
                  id="new20"
                  type="number"
                  step="0.01"
                  value={newCharge.container20}
                  onChange={(e) =>
                    setNewCharge({
                      ...newCharge,
                      container20: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={addCustomCharge} className="w-full md:w-auto">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Custom Charge
              </Button>
            </div>
          </div>

          {/* Total Summary */}
          <div className="border-t-2 pt-4">
            <div className="bg-orange-100 dark:bg-orange-950 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Amount Requested
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ₱
                    {calculateTotal().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Containers: {formData.container40Count} x 40' +{" "}
                    {formData.container20Count} x 20'
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    BL No: {formData.blNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details & Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bankDetails">Bank Details</Label>
            <Input
              id="bankDetails"
              value={formData.bankDetails}
              onChange={(e) =>
                setFormData({ ...formData, bankDetails: e.target.value })
              }
              placeholder="Bank account details"
            />
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <Label
              htmlFor="ewtNote"
              className="flex items-center text-yellow-800 dark:text-yellow-200"
            >
              <InfoIcon className="h-4 w-4 mr-2" />
              EWT Note
            </Label>
            <Textarea
              id="ewtNote"
              value={formData.ewtNote}
              onChange={(e) =>
                setFormData({ ...formData, ewtNote: e.target.value })
              }
              placeholder="EWT instructions and notes"
              rows={2}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="remarks">Additional Remarks</Label>
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

      {/* Action Buttons */}
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
