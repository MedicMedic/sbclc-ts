import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  XIcon,
  TrashIcon,
  SaveIcon,
  SendIcon,
  ColumnsIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
interface QuotationItem {
  id: string;
  item_sequence: number;
  description: string;
  category: "receipted" | "non-receipted";
  currency: string;
  rate: string;
  amount: number;
  quantity?: string;
  unit?: string;
  locationFrom?: string;
  locationTo?: string;
  containerSize?: string;
  container_size?: string;
  truckSize?: string;
  warehouse?: string;
  equipment_type?: string;
  remarks?: string;
  custom_data?: any;
  [key: string]: any;
}

interface ColumnPreset {
  id: string;
  name: string;
  type: "text" | "number" | "select";
  options?: string[];
}

interface Quotation {
  quotation_id: number;
  quotation_number: string;
  quotation_date: string;
  booking_id?: string | null;
  client_id?: number;
  client_name?: string;
  service_type_id?: number;
  service_type_name?: string;
  origin?: string;
  destination?: string;
  total_amount: number;
  receipted_total: number;
  non_receipted_total: number;
  base_currency: string;
  status: string;
  valid_until?: string | null;
  prepared_by?: string;
  approved_by?: string;
  items?: QuotationItem[];
  contact_person?: string;
  contact_position?: string;
  consignee_position?: string;
  address?: string;
  contact_no?: string;
  payment_term?: string;
  service_description?: string;
  notes?: string;
  exchange_rate?: number;
  [key: string]: any;
}

interface QuotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: Quotation | null;
  onSave: (quotation: Quotation, action: "save" | "submit") => Promise<void>;
  clients: any[];
  serviceTypes: any[];
  serviceItems: any[];
  ports: any[];
  warehouses: any[];
  currencies: string[];
  containerSizes: string[];
  truckSizes: string[];
  categories: string[];
  columnPresets: ColumnPreset[];
  generateQuotationNumber: () => string;
  currencyRates?: any[];
  currentUser?: any;
}

export function QuotationForm({
  open,
  onOpenChange,
  quotation,
  onSave,
  clients,
  serviceTypes,
  serviceItems,
  ports,
  warehouses,
  currencies,
  containerSizes,
  truckSizes,
  categories,
  columnPresets,
  generateQuotationNumber,
  currencyRates = [],
  currentUser,
}: QuotationFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showColumnManager, setShowColumnManager] = useState<boolean>(false);
  const [activeColumns, setActiveColumns] = useState<ColumnPreset[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  const todayDateISO = () => new Date().toISOString().split("T")[0];

  const formatDateToMMDDYYYY = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const convertToInputDate = (dateString: string): string => {
    if (!dateString) return "";
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  const getDefaultPreparedBy = () => {
    if (currentUser?.full_name) return currentUser.full_name;
    if (currentUser?.first_name && currentUser?.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    if (currentUser?.email) return currentUser.email;
    return "Current User";
  };

  const [formData, setFormData] = useState({
    quotationNumber: generateQuotationNumber(),
    quotationDate: todayDateISO(),
    bookingId: "",
    clientId: "",
    clientContactPerson: "",
    clientContactPosition: "",
    consigneePosition: "",
    clientAddress: "",
    clientContactNo: "",
    paymentTerm: "",
    serviceTypeId: "",
    origin: "",
    destination: "",
    serviceDescription: "",
    baseCurrency: "PHP",
    exchangeRate: "1",
    notes: "",
    validUntil: "",
    preparedBy: getDefaultPreparedBy(),
    approvedBy: "",
  });

  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: "1",
      item_sequence: 1,
      description: "",
      category: "non-receipted",
      currency: "PHP",
      rate: "",
      amount: 0,
      quantity: "1",
      unit: "pcs",
      remarks: "",
    },
  ]);

  useEffect(() => {
    if (open) {
      // Clear any previous validation errors when opening
      setValidationError("");
      
      if (quotation) {
        setFormData({
          quotationNumber: quotation.quotation_number,
          quotationDate: quotation.quotation_date || todayDateISO(),
          bookingId: quotation.booking_id || "",
          clientId: quotation.client_id?.toString() || "",
          clientContactPerson: quotation.contact_person || "",
          clientContactPosition: quotation.contact_position || "",
          consigneePosition: quotation.consignee_position || "",
          clientAddress: quotation.address || "",
          clientContactNo: quotation.contact_no || "",
          paymentTerm: quotation.payment_term || "",
          serviceTypeId: quotation.service_type_id?.toString() || "",
          origin: quotation.origin || "",
          destination: quotation.destination || "",
          serviceDescription: quotation.service_description || "",
          baseCurrency: quotation.base_currency || "PHP",
          exchangeRate: quotation.exchange_rate?.toString() || "1",
          notes: quotation.notes || "",
          validUntil: quotation.valid_until || "",
          preparedBy: quotation.prepared_by || getDefaultPreparedBy(),
          approvedBy: quotation.approved_by || "",
        });

        if (quotation.items && quotation.items.length > 0) {
          setItems(quotation.items.map((it, idx) => ({
            id: (idx + 1).toString(),
            item_sequence: it.item_sequence || (idx + 1),
            description: it.description || "",
            category: it.category || "non-receipted",
            currency: it.currency || quotation.base_currency || "PHP",
            rate: it.rate?.toString() || "",
            amount: it.amount || 0,
            quantity: it.quantity?.toString() || "1",
            unit: it.unit || "pcs",
            locationFrom: it.locationFrom || "",
            locationTo: it.locationTo || "",
            containerSize: it.containerSize || it.container_size || "",
            truckSize: it.truckSize || "",
            warehouse: it.warehouse || "",
            equipment_type: it.equipment_type || "",
            remarks: it.remarks || "",
          })));
        } else {
          setItems([{
            id: "1",
            item_sequence: 1,
            description: "",
            category: "non-receipted",
            currency: quotation.base_currency || "PHP",
            rate: "",
            amount: 0,
            quantity: "1",
            unit: "pcs",
            remarks: "",
          }]);
        }
      } else {
        setFormData({
          quotationNumber: generateQuotationNumber(),
          quotationDate: todayDateISO(),
          bookingId: "",
          clientId: "",
          clientContactPerson: "",
          clientContactPosition: "",
          consigneePosition: "",
          clientAddress: "",
          clientContactNo: "",
          paymentTerm: "",
          serviceTypeId: "",
          origin: "",
          destination: "",
          serviceDescription: "",
          baseCurrency: "PHP",
          exchangeRate: "1",
          notes: "",
          validUntil: "",
          preparedBy: getDefaultPreparedBy(),
          approvedBy: "",
        });
        setItems([{
          id: "1",
          item_sequence: 1,
          description: "",
          category: "non-receipted",
          currency: "PHP",
          rate: "",
          amount: 0,
          quantity: "1",
          unit: "pcs",
          remarks: "",
        }]);
      }
      setActiveColumns([]);
      setShowColumnManager(false);
    }
  }, [open, quotation, generateQuotationNumber, currentUser]);

  useEffect(() => {
    if (formData.clientId) {
      const client = clients.find((c) => c.id.toString() === formData.clientId);
      if (client) {
        setFormData((prev) => ({
          ...prev,
          clientContactPerson: client.contact_person || "",
          clientContactPosition: client.contact_position || "",
          consigneePosition: client.contact_position || "",
          clientAddress: client.address || "",
          clientContactNo: client.phone || "",
          paymentTerm: client.payment_terms || prev.paymentTerm,
        }));
      }
    }
  }, [formData.clientId, clients]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts fixing things
    if (validationError) setValidationError("");
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated: any = { ...item, [field]: value };

          if (field === "description" && value) {
            const svc = serviceItems.find((s) =>
              s.name === value ||
              s.description === value ||
              s.service_type === value ||
              s.id.toString() === value
            );

            if (svc) {
              const autoRate = svc.rate || svc.unit_price || svc.default_rate || svc.base_rate || "";
              updated.rate = autoRate.toString();
              console.log("Auto-filled rate:", autoRate, "from service:", svc);
            }
          }

          const rate = parseFloat(updated.rate || "0") || 0;
          const qty = parseFloat(updated.quantity || "1") || 1;
          updated.amount = Number((qty * rate).toFixed(2));

          return updated;
        }
        return item;
      })
    );
    // Clear validation error when user starts fixing things
    if (validationError) setValidationError("");
  };

  const addNewItem = () => {
    const newSequence = items.length + 1;
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      item_sequence: newSequence,
      description: "",
      category: "non-receipted",
      currency: formData.baseCurrency || "PHP",
      rate: "",
      amount: 0,
      quantity: "1",
      unit: "pcs",
      remarks: "",
    };

    activeColumns.forEach((col) => {
      (newItem as any)[col.id] = col.id === "quantity" ? "1" : "";
    });

    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      // Resequence items
      return filtered.map((item, idx) => ({
        ...item,
        item_sequence: idx + 1
      }));
    });
  };

  const addColumn = (preset: ColumnPreset) => {
    if (!activeColumns.find((c) => c.id === preset.id)) {
      setActiveColumns((prev) => [...prev, preset]);
      setItems((prev) =>
        prev.map((it) => ({
          ...it,
          [preset.id]: preset.id === "quantity" ? "1" : preset.id === "unit" ? "pcs" : "",
        }))
      );
    }
  };

  const removeColumn = (id: string) => {
    setActiveColumns((prev) => prev.filter((p) => p.id !== id));
    setItems((prev) => prev.map((it) => {
      const copy = { ...it };
      delete (copy as any)[id];
      return copy;
    }));
  };

  const getExchangeRate = (currencyCode: string): number => {
    if (currencyCode === "PHP") return 1;
    const currencyData = currencyRates.find(c => c.currency_code === currencyCode);
    return currencyData?.exchange_rate || 1;
  };

  const calculateTotals = () => {
    let receiptedInBaseCurrency = 0;
    let nonReceiptedInBaseCurrency = 0;

    items.forEach((item) => {
      const amount = parseFloat(String(item.amount)) || 0;
      const itemCurrency = item.currency || "PHP";

      let amountInPHP = amount;
      if (itemCurrency !== "PHP") {
        const exchangeRate = getExchangeRate(itemCurrency);
        amountInPHP = amount * exchangeRate;
      }

      if (item.category === "receipted") {
        receiptedInBaseCurrency += amountInPHP;
      } else {
        nonReceiptedInBaseCurrency += amountInPHP;
      }
    });

    const totalInBaseCurrency = receiptedInBaseCurrency + nonReceiptedInBaseCurrency;

    return {
      receipted: receiptedInBaseCurrency,
      nonReceipted: nonReceiptedInBaseCurrency,
      total: totalInBaseCurrency
    };
  };

  const totals = calculateTotals();

  const validateBeforeSubmit = (isDraft: boolean = false): { ok: boolean; message?: string } => {
    if (isDraft) {
      return { ok: true };
    }

    if (!formData.clientId) return { ok: false, message: "Please select a client (Consignee Name)." };
    if (!formData.serviceTypeId) return { ok: false, message: "Please select a service type." };

    if (!items || items.length === 0) return { ok: false, message: "Add at least one service item." };
    if (!items.some((i) => i.description && i.description.trim() !== "")) {
      return { ok: false, message: "At least one service item must have a description." };
    }

    for (const it of items) {
      if (it.rate !== "" && isNaN(Number(it.rate))) {
        return { ok: false, message: "Each rate must be a numeric value." };
      }
      if (it.rate !== "" && Number(it.rate) < 0) {
        return { ok: false, message: "Rate cannot be negative." };
      }
    }

    if (formData.validUntil) {
      const selected = new Date(formData.validUntil);
      const today = new Date(todayDateISO());
      if (selected < today) return { ok: false, message: "Valid Until must be today or a future date." };
    }

    return { ok: true };
  };

  const handleSubmit = async (action: "save" | "submit") => {
    setIsLoading(true);
    setValidationError(""); // Clear any previous errors

    const isDraft = action === "save";
    const validation = validateBeforeSubmit(isDraft);

    if (!validation.ok) {
      setValidationError(validation.message || "Validation failed");
      setIsLoading(false);
      return; // ✅ Don't close the form
    }

    const { receipted, nonReceipted, total } = calculateTotals();

    try {
      const quotationData: Quotation = {
        quotation_id: quotation?.quotation_id || Date.now(),
        quotation_number: formData.quotationNumber,
        quotation_date: formData.quotationDate,
        booking_id: formData.bookingId || null,
        client_id: Number(formData.clientId),
        client_name: clients.find(c => c.id.toString() === formData.clientId)?.name || "",
        service_type_id: Number(formData.serviceTypeId),
        service_type_name: serviceTypes.find(s => s.id.toString() === formData.serviceTypeId)?.name || "",
        contact_person: formData.clientContactPerson,
        contact_position: formData.clientContactPosition,
        consignee_position: formData.consigneePosition,
        address: formData.clientAddress,
        contact_no: formData.clientContactNo,
        payment_term: formData.paymentTerm,
        origin: formData.origin,
        destination: formData.destination,
        service_description: formData.serviceDescription,
        base_currency: formData.baseCurrency,
        exchange_rate: parseFloat(formData.exchangeRate) || 1,
        receipted_total: receipted,
        non_receipted_total: nonReceipted,
        total_amount: total,
        status: action === "save" ? "draft" : "pending_approval",
        valid_until: formData.validUntil || null,
        notes: formData.notes,
        prepared_by: formData.preparedBy,
        approved_by: formData.approvedBy,
        items: items.map((item, idx) => ({
          ...item,
          item_sequence: idx + 1,
          containerSize: item.containerSize || item.container_size,
        })),
      };

      console.log("Submitting quotation with prepared_by:", formData.preparedBy);
      
      // ✅ Await the onSave promise
      await onSave(quotationData, action);
      
      // ✅ Only close if successful (no error thrown)
      setIsLoading(false);
      onOpenChange(false);
    } catch (error: any) {
      // ✅ Show error and keep form open
      console.error("Error saving quotation:", error);
      setValidationError(error.message || "Failed to save quotation. Please try again.");
      setIsLoading(false);
      // Don't close the form!
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quotation ? "Edit Quotation" : "Create New Quotation"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* ✅ Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Quotation Number <span className="text-red-500">*</span></Label>
                  <Input value={formData.quotationNumber} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label>Quotation Date <span className="text-red-500">*</span></Label>
                  <Input
                    type="date"
                    value={formData.quotationDate}
                    onChange={(e) => {
                      const selected = new Date(e.target.value);
                      const today = new Date(todayDateISO());
                      if (selected < today) {
                        setValidationError("Quotation Date cannot be in the past.");
                        return;
                      }
                      handleInputChange("quotationDate", e.target.value);
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.quotationDate ? formatDateToMMDDYYYY(formData.quotationDate) : "MM/DD/YYYY"}
                  </p>
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleInputChange("validUntil", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.validUntil ? `${formatDateToMMDDYYYY(formData.validUntil)}` : "MM/DD/YYYY"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label>Consignee Name <span className="text-red-500">*</span></Label>
                  <Select value={formData.clientId} onValueChange={(v) => handleInputChange("clientId", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {formData.consigneePosition && <div>Position: {formData.consigneePosition}</div>}
                    {formData.clientContactPerson && <div>Contact: {formData.clientContactPerson}</div>}
                    {formData.clientContactPosition && <div>Contact Position: {formData.clientContactPosition}</div>}
                    {formData.clientAddress && <div>{formData.clientAddress}</div>}
                    {formData.clientContactNo && <div>{formData.clientContactNo}</div>}
                    {formData.paymentTerm && <div>Payment: {formData.paymentTerm}</div>}
                  </div>
                </div>

                <div>
                  <Label>Service Type <span className="text-red-500">*</span></Label>
                  <Select value={formData.serviceTypeId} onValueChange={(v) => handleInputChange("serviceTypeId", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <Label>Origin Location</Label>
                      <Select value={formData.origin} onValueChange={(v) => handleInputChange("origin", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {ports.map((p) => (
                            <SelectItem key={p.id} value={p.name}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Destination Location</Label>
                      <Select value={formData.destination} onValueChange={(v) => handleInputChange("destination", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {ports.map((p) => (
                            <SelectItem key={p.id} value={p.name}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Booking ID</Label>
                  <Input value={formData.bookingId} onChange={(e) => handleInputChange("bookingId", e.target.value)} />
                </div>
                <div>
                  <Label>Base Currency</Label>
                  <Select
                    value={formData.baseCurrency || "PHP"}
                    onValueChange={(v) => handleInputChange("baseCurrency", v)}
                  >
                    <SelectTrigger>
                      <span className="text-sm">{formData.baseCurrency || "PHP"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(currencies)).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </div>
              </div>

              <div className="mt-4">
                <Label>Service Description</Label>
                <Textarea
                  value={formData.serviceDescription}
                  onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <Label>Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Service Items <span className="text-red-500">*</span></h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowColumnManager(!showColumnManager)}>
                    <ColumnsIcon className="h-4 w-4 mr-1" /> Add Column
                  </Button>
                  <Button variant="outline" size="sm" onClick={addNewItem}>
                    <PlusIcon className="h-4 w-4 mr-1" /> Add Row
                  </Button>
                </div>
              </div>

              {showColumnManager && (
                <Card className="border-2 border-blue-200 bg-blue-50 mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-blue-900">Manage Columns</h4>
                      <Button size="sm" variant="ghost" onClick={() => setShowColumnManager(false)} className="h-6 w-6 p-0">
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mb-3">
                      <Label className="text-xs font-medium">Active Columns (click to remove)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activeColumns.length === 0 && <div className="text-sm text-gray-600">No optional columns enabled</div>}
                        {activeColumns.map((c) => (
                          <Button key={c.id} size="sm" variant="secondary" onClick={() => removeColumn(c.id)} className="h-7 text-xs">
                            {c.name} <XIcon className="h-3 w-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Available Columns (click to add)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {columnPresets
                          .filter((preset) => !activeColumns.find((c) => c.id === preset.id))
                          .map((preset) => (
                            <Button key={preset.id} size="sm" variant="outline" onClick={() => addColumn(preset)} className="h-7 text-xs">
                              <PlusIcon className="h-3 w-3 mr-1" /> {preset.name}
                            </Button>
                          ))}
                      </div>
                    </div>

                    <div className="text-xs text-blue-700 italic mt-3">
                      Note: Description, Category, Currency, Rate, Amount, and Remarks are fixed columns.
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="min-w-[220px]">Description (Item) <span className="text-red-500">*</span></TableHead>
                      <TableHead className="min-w-[140px]">Category</TableHead>
                      {activeColumns.map((c) => (
                        <TableHead key={c.id} className="min-w-[130px]">
                          {c.name}
                        </TableHead>
                      ))}
                      <TableHead className="min-w-[100px]">Currency</TableHead>
                      <TableHead className="min-w-[120px]">Rate <span className="text-red-500">*</span></TableHead>
                      <TableHead className="min-w-[120px]">Amount</TableHead>
                      <TableHead className="min-w-[150px]">Remarks</TableHead>
                      <TableHead className="w-[80px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it) => (
                      <TableRow key={it.id}>
                        <TableCell className="p-2">
                          <Select value={it.description} onValueChange={(v) => handleItemChange(it.id, "description", v)}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceItems.map((si) => (
                                <SelectItem key={si.id} value={si.name || si.description || si.service_type}>
                                  {si.name || si.description || si.service_type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="p-2">
                          <Select value={it.category} onValueChange={(v) => handleItemChange(it.id, "category", v)}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="receipted">Receipted</SelectItem>
                              <SelectItem value="non-receipted">Non-Receipted</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {activeColumns.map((c) => (
                          <TableCell key={c.id} className="p-2">
                            {c.type === "select" ? (
                              <Select
                                value={(it as any)[c.id] || ""}
                                onValueChange={(v) => handleItemChange(it.id, c.id, v)}
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {c.options?.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={(it as any)[c.id] || ""}
                                onChange={(e) => handleItemChange(it.id, c.id, e.target.value)}
                                className="h-8 text-sm"
                                type={c.type === "number" ? "number" : "text"}
                              />
                            )}
                          </TableCell>
                        ))}

                        <TableCell className="p-2">
                          <Select
                            value={it.currency || "PHP"}
                            onValueChange={(v) => handleItemChange(it.id, "currency", v)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <span className="text-sm">{it.currency || "PHP"}</span>
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(new Set(currencies)).map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                        </TableCell>

                        <TableCell className="p-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={it.rate}
                            onChange={(e) => handleItemChange(it.id, "rate", e.target.value)}
                            placeholder="0.00"
                            className="h-8 text-sm"
                          />
                        </TableCell>

                        <TableCell className="p-2">
                          <div className="text-sm font-medium">
                            {it.currency} {(Number(it.amount) || 0).toFixed(2)}
                          </div>
                        </TableCell>

                        <TableCell className="p-2">
                          <Input
                            value={it.remarks || ""}
                            onChange={(e) => handleItemChange(it.id, "remarks", e.target.value)}
                            placeholder="Optional"
                            className="h-8 text-sm"
                          />
                        </TableCell>

                        <TableCell className="p-2 text-center">
                          <div className="flex justify-center">
                            <Button variant="ghost" size="sm" onClick={() => removeItem(it.id)} disabled={items.length === 1} className="h-6 w-6 p-0 text-red-500">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm text-blue-600 font-medium">Receipted Total</div>
                    <div className="text-xl font-bold text-blue-800">
                      PHP {totals.receipted.toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">All items converted to PHP</div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-sm text-green-600 font-medium">Non-Receipted Total</div>
                    <div className="text-xl font-bold text-green-800">
                      PHP {totals.nonReceipted.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600 mt-1">All items converted to PHP</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-100">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600 font-medium">Grand Total</div>
                    <div className="text-2xl font-bold text-gray-800">
                      PHP {totals.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">All items converted to PHP</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Prepared By</Label>
                  <Input
                    value={formData.preparedBy}
                    onChange={(e) => handleInputChange("preparedBy", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>Approved By</Label>
                  <Input
                    value={formData.approvedBy}
                    onChange={(e) => handleInputChange("approvedBy", e.target.value)}
                    placeholder="Will be filled after approval"
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSubmit("save")} disabled={isLoading}>
              <SaveIcon className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save Draft"}
            </Button>
            <Button className="bg-[#1e40af] hover:bg-[#1e3a8a]" onClick={() => handleSubmit("submit")} disabled={isLoading}>
              <SendIcon className="mr-2 h-4 w-4" /> {isLoading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuotationForm