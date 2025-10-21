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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlusIcon,
  SaveIcon,
  SendIcon,
  ColumnsIcon,
  XIcon,
  PrinterIcon,
} from "lucide-react";
import { serviceTypes, currencies } from "@/polymet/data/logistics-data";

interface ImportBookingFormProps {
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

interface ItemRow {
  id: string;
  description: string;
  category: string;
  warehouse: string;
  containerSize: string;
  eqType: string;
  currency: string;
  rate: string;
  [key: string]: string; // Allow dynamic columns
}

interface CustomColumn {
  id: string;
  name: string;
  type: "text" | "number" | "select";
  options?: string[];
}

export function ImportBookingForm({
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: ImportBookingFormProps) {
  const [formData, setFormData] = useState({
    quotationNumber: "",
    quotationDate: "",
    consignee: "",
    serviceType: "",
    contactPerson: "",
    position: "",
    address: "",
    contactNo: "",
    serviceDescription: "",
    paymentTerm: "",
    notes: "",
    preparedBy: "",
    approvedBy: "",
    ...initialData,
  });

  const [items, setItems] = useState<ItemRow[]>([
    {
      id: "1",
      description: "",
      category: "",
      warehouse: "",
      containerSize: "",
      eqType: "",
      currency: "PHP",
      rate: "",
    },
  ]);

  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<
    "text" | "number" | "select"
  >("text");
  const [newColumnOptions, setNewColumnOptions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addNewItem = () => {
    const newItem: ItemRow = {
      id: Date.now().toString(),
      description: "",
      category: "",
      warehouse: "",
      containerSize: "",
      eqType: "",
      currency: "PHP",
      rate: "",
    };

    // Add empty values for custom columns
    customColumns.forEach((col) => {
      newItem[col.id] = "";
    });

    setItems((prev) => [...prev, newItem]);
  };

  const addCustomColumn = () => {
    if (!newColumnName.trim()) return;

    const newColumn: CustomColumn = {
      id: `custom_${Date.now()}`,
      name: newColumnName.trim(),
      type: newColumnType,
      options:
        newColumnType === "select"
          ? newColumnOptions
              .split(",")
              .map((opt) => opt.trim())
              .filter((opt) => opt)
          : undefined,
    };

    setCustomColumns((prev) => [...prev, newColumn]);

    // Add empty value for this column to all existing items
    setItems((prev) => prev.map((item) => ({ ...item, [newColumn.id]: "" })));

    // Reset form
    setNewColumnName("");
    setNewColumnType("text");
    setNewColumnOptions("");
    setShowAddColumn(false);
  };

  const removeCustomColumn = (columnId: string) => {
    setCustomColumns((prev) => prev.filter((col) => col.id !== columnId));

    // Remove this column from all items
    setItems((prev) =>
      prev.map((item) => {
        const { [columnId]: removed, ...rest } = item;
        return rest;
      })
    );
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (action: "save" | "submit") => {
    setIsLoading(true);

    const submitData = {
      ...formData,
      items,
      submittedAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const callback = action === "save" ? onSave : onSubmit;
    callback?.(submitData);

    setIsLoading(false);
  };

  const handlePrint = () => {
    const printData = {
      ...formData,
      items,
      printedAt: new Date().toISOString(),
    };
    onPrint?.(printData);
  };

  const importServiceTypes = serviceTypes.filter(
    (service) => service.category === "import"
  );

  const containerSizes = ["20'", "40'", "40'HC", "45'"];
  const equipmentTypes = ["DRY", "REEFER", "TANK", "FLAT RACK", "OPEN TOP"];
  const warehouseOptions = ["Warehouse A", "Warehouse B", "Warehouse C"];
  const categoryOptions = [
    "Receipted/Reimbursable",
    "Non-Receipted/Negotiable",
  ];

  const paymentTerms = [
    "COD",
    "30 Days",
    "60 Days",
    "90 Days",
    "Advance Payment",
  ];

  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Header Information */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotationNumber" className="text-sm font-medium">
                    Quotation Number
                  </Label>
                  <Input
                    id="quotationNumber"
                    value={formData.quotationNumber}
                    onChange={(e) =>
                      handleInputChange("quotationNumber", e.target.value)
                    }
                    placeholder="Enter quotation number"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="quotationDate"
                    className="text-sm font-medium"
                  >
                    Quotation Date:
                  </Label>
                  <Input
                    id="quotationDate"
                    type="date"
                    value={formData.quotationDate}
                    onChange={(e) =>
                      handleInputChange("quotationDate", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consignee" className="text-sm font-medium">
                  Consignee:
                </Label>
                <Input
                  id="consignee"
                  value={formData.consignee}
                  onChange={(e) =>
                    handleInputChange("consignee", e.target.value)
                  }
                  placeholder="Enter consignee name"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-medium">
                  Contact Person:
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                  placeholder="Enter contact person name"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address:
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="serviceDescription"
                  className="text-sm font-medium"
                >
                  Service Description:
                </Label>
                <Input
                  id="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={(e) =>
                    handleInputChange("serviceDescription", e.target.value)
                  }
                  placeholder="Enter service description"
                  className="h-9"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-sm font-medium">
                  Service Type:
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    handleInputChange("serviceType", value)
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {importServiceTypes.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">
                  Position:
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="Enter position"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo" className="text-sm font-medium">
                  Contact No:
                </Label>
                <Input
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={(e) =>
                    handleInputChange("contactNo", e.target.value)
                  }
                  placeholder="Enter contact number"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerm" className="text-sm font-medium">
                  Payment Term:
                </Label>
                <Select
                  value={formData.paymentTerm}
                  onValueChange={(value) =>
                    handleInputChange("paymentTerm", value)
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select payment term" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes:
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter additional notes"
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Service Items</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddColumn(true)}
                  className="h-8"
                >
                  <ColumnsIcon className="h-4 w-4 mr-1" />
                  Add Column
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewItem}
                  className="h-8"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>
            </div>

            {/* Add Column Form */}
            {showAddColumn && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-blue-900">
                      Add New Column
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddColumn(false)}
                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label
                        htmlFor="columnName"
                        className="text-xs font-medium text-blue-900"
                      >
                        Column Name
                      </Label>
                      <Input
                        id="columnName"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="Enter column name"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="columnType"
                        className="text-xs font-medium text-blue-900"
                      >
                        Type
                      </Label>
                      <Select
                        value={newColumnType}
                        onValueChange={(value: "text" | "number" | "select") =>
                          setNewColumnType(value)
                        }
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newColumnType === "select" && (
                      <div>
                        <Label
                          htmlFor="columnOptions"
                          className="text-xs font-medium text-blue-900"
                        >
                          Options (comma-separated)
                        </Label>
                        <Input
                          id="columnOptions"
                          value={newColumnOptions}
                          onChange={(e) => setNewColumnOptions(e.target.value)}
                          placeholder="Option1, Option2, Option3"
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={addCustomColumn}
                        disabled={!newColumnName.trim()}
                        className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Add Column
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Columns Display */}
            {customColumns.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                <span className="text-sm font-medium text-gray-700">
                  Custom Columns:
                </span>
                {customColumns.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center gap-1 bg-white px-2 py-1 rounded border"
                  >
                    <span className="text-xs font-medium">{column.name}</span>
                    <span className="text-xs text-gray-500">
                      ({column.type})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomColumn(column.id)}
                      className="h-4 w-4 p-0 text-red-500 hover:text-red-700 ml-1"
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[200px] text-center font-medium">
                      Description
                    </TableHead>
                    <TableHead className="w-[150px] text-center font-medium">
                      Category
                    </TableHead>
                    <TableHead className="w-[120px] text-center font-medium">
                      Warehouse
                    </TableHead>
                    <TableHead className="w-[120px] text-center font-medium">
                      Container Size
                    </TableHead>
                    <TableHead className="w-[120px] text-center font-medium">
                      Eq Type
                    </TableHead>
                    <TableHead className="w-[100px] text-center font-medium">
                      Currency
                    </TableHead>
                    <TableHead className="w-[120px] text-center font-medium">
                      Rate
                    </TableHead>
                    {/* Dynamic Custom Columns */}
                    {customColumns.map((column) => (
                      <TableHead
                        key={column.id}
                        className="w-[120px] text-center font-medium bg-blue-50"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{column.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomColumn(column.id)}
                            className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-[80px] text-center font-medium">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="p-2">
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter description"
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={item.category}
                          onValueChange={(value) =>
                            handleItemChange(item.id, "category", value)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={item.warehouse}
                          onValueChange={(value) =>
                            handleItemChange(item.id, "warehouse", value)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouseOptions.map((warehouse) => (
                              <SelectItem key={warehouse} value={warehouse}>
                                {warehouse}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={item.containerSize}
                          onValueChange={(value) =>
                            handleItemChange(item.id, "containerSize", value)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {containerSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={item.eqType}
                          onValueChange={(value) =>
                            handleItemChange(item.id, "eqType", value)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipmentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={item.currency}
                          onValueChange={(value) =>
                            handleItemChange(item.id, "currency", value)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem
                                key={currency.code}
                                value={currency.code}
                              >
                                {currency.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(item.id, "rate", e.target.value)
                          }
                          placeholder="0.00"
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      {/* Dynamic Custom Columns */}
                      {customColumns.map((column) => (
                        <TableCell key={column.id} className="p-2">
                          {column.type === "select" ? (
                            <Select
                              value={item[column.id] || ""}
                              onValueChange={(value) =>
                                handleItemChange(item.id, column.id, value)
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {column.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={
                                column.type === "number" ? "number" : "text"
                              }
                              value={item[column.id] || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  column.id,
                                  e.target.value
                                )
                              }
                              placeholder={
                                column.type === "number" ? "0" : "Enter value"
                              }
                              className="h-8 text-sm"
                            />
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="p-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preparedBy" className="text-sm font-medium">
                Prepared By:
              </Label>
              <Input
                id="preparedBy"
                value={formData.preparedBy}
                onChange={(e) =>
                  handleInputChange("preparedBy", e.target.value)
                }
                placeholder="Enter preparer name"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvedBy" className="text-sm font-medium">
                Approved By:
              </Label>
              <Input
                id="approvedBy"
                value={formData.approvedBy}
                onChange={(e) =>
                  handleInputChange("approvedBy", e.target.value)
                }
                placeholder="Enter approver name"
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handlePrint} disabled={isLoading}>
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSubmit("save")}
          disabled={isLoading}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit("submit")}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <SendIcon className="mr-2 h-4 w-4" />

          {isLoading ? "Submitting..." : "Submit for Approval"}
        </Button>
      </div>
    </div>
  );
}
