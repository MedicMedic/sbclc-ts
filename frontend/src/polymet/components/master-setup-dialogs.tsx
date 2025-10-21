// master-setup-dialogs.tsx - COMPLETE WITH ALL FORMS
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface MasterSetupDialogProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingItem?: any;
  mode?: "add" | "edit" | "view";
  categories?: any[];
  currencies?: any[];
  containerSizes?: any[];
  truckSizes?: any[];
  warehouses?: any[];
}

export function MasterSetupDialog({
  type,
  isOpen,
  onClose,
  onSave,
  editingItem,
  mode = "add",
  categories = [],
  currencies = [],
}: MasterSetupDialogProps) {
  const [formData, setFormData] = React.useState(editingItem || {});
  const isViewMode = mode === "view";

  React.useEffect(() => {
    if (isOpen) {
      setFormData(editingItem || {});
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewMode) {
      const backendData = convertToBackendFormat(formData, type);
      onSave(backendData);
    }
  };

  const convertToBackendFormat = (data: any, dialogType: string) => {
    switch (dialogType) {
      case "service-type":
        return {
          service_type_name: data.service_type_name || data.name,
          category: data.category,
          description: data.description || null,
          is_active: data.is_active !== undefined ? data.is_active : (data.active ? 1 : 0),
        };

      case "category":
        return {
          category_name: data.category_name || data.name,
          category_type: data.category_type || 'general',
          parent_category_id: data.parent_category_id || null,
          description: data.description || null,
          display_order: data.display_order || 0,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "port":
        return {
          port_name: data.port_name || data.name,
          port_code: data.port_code || data.code,
          country: data.country || null,
          port_type: data.port_type || data.type || "seaport",
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "shipping-line":
        return {
          line_name: data.line_name || data.name,
          line_code: data.line_code || data.code,
          country: data.country || null,
          contact_email: data.contact_email || data.email || null,
          contact_phone: data.contact_phone || data.phone || null,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "currency":
        return {
          currency_code: data.currency_code || data.code,
          currency_name: data.currency_name || data.name,
          symbol: data.symbol,
          exchange_rate: parseFloat(data.exchange_rate || data.exchangeRate) || 1.0,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "trucker":
        return {
          trucker_name: data.trucker_name || data.name,
          trucker_type: data.trucker_type || data.type,
          contact_person: data.contact_person || data.contactPerson || null,
          contact_phone: data.contact_phone || data.phone || null,
          address: data.address || null,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "service-item":
        return {
          service_type: data.service_type || data.service,
          category: data.category,
          unit_price: parseFloat(data.unit_price || data.defaultRate) || 0,
          description: data.description || null,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "expense":
        return {
          category_name: data.category_name || data.name,
          category: data.category,
          description: data.description || null,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "booking-status":
      case "billing-status":
        return {
          status_code: data.status_code || data.code || data.status_name?.toLowerCase().replace(/\s+/g, '_'),
          status_name: data.status_name || data.name,
          category: dialogType === "booking-status" ? "booking" : "billing",
          color: data.color,
          sequence: data.sequence || 0,
          description: data.description || null,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "client":
        return {
          client_name: data.client_name || data.name,
          client_code: data.client_code || data.code,
          contact_person: data.contact_person || data.contactPerson,
          email: data.email || data.contact_email, // ✅ change this line
          contact_phone: data.contact_phone || data.phone || null,
          address: data.address || null,
          payment_terms: data.payment_terms || data.paymentTerms,
          credit_limit: parseFloat(data.credit_limit || data.creditLimit) || 0,
          preferred_currency: data.preferred_currency || data.currency || null,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "warehouse":
        return {
          warehouse_name: data.warehouse_name || data.name,
          warehouse_code: data.warehouse_code || data.code,
          address: data.address,
          warehouse_type: data.warehouse_type || data.type,
          capacity: parseFloat(data.capacity) || 0,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "container-size":
        return {
          size_name: data.size_name || data.name,
          size_code: data.size_code || data.code || null,
          description: data.description || null,
          display_order: data.display_order || 0,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      case "truck-size":
        return {
          size_name: data.size_name || data.name,
          size_code: data.size_code || data.code || null,
          truck_type: data.truck_type || 'other',
          description: data.description || null,
          display_order: data.display_order || 0,
          is_active: data.is_active !== undefined ? data.is_active : 1,
        };

      default:
        return data;
    }
  };

  const updateField = (field: string, value: any) => {
    if (!isViewMode) {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const ViewField = ({ label, value }: { label: string; value: any }) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1 p-2 bg-muted/30 rounded text-sm">
        {value || "N/A"}
      </div>
    </div>
  );

  // SERVICE TYPE FORM
  const renderServiceTypeForm = () => {
    const serviceName = formData.service_type_name || formData.name || "";
    const isActive = formData.is_active !== undefined ? formData.is_active : (formData.active !== false);
    const serviceCategories = categories.filter(c => c.category_type === 'service');

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Service Name" value={serviceName} />
            <ViewField label="Category" value={formData.category} />
            <ViewField label="Description" value={formData.description} />
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge className={isActive ? "bg-green-600" : "bg-gray-600"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="service_type_name">Service Name *</Label>
              <Input
                id="service_type_name"
                value={serviceName}
                onChange={(e) => updateField("service_type_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(v) => updateField("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="forwarding">Forwarding</SelectItem>
                  <SelectItem value="brokerage">Brokerage</SelectItem>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_name}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={(v) => updateField("is_active", v ? 1 : 0)}
              />
              <Label>Active</Label>
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // CATEGORY FORM
  const renderCategoryForm = () => {
    const categoryName = formData.category_name || formData.name || "";
    const isActive = formData.is_active !== undefined ? formData.is_active : 1;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Category Name" value={categoryName} />
            <ViewField label="Type" value={formData.category_type} />
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge className={isActive ? "bg-green-600" : "bg-gray-600"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <ViewField label="Description" value={formData.description} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="category_name">Category Name *</Label>
              <Input
                id="category_name"
                value={categoryName}
                onChange={(e) => updateField("category_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category_type">Type *</Label>
              <Select
                value={formData.category_type || ""}
                onValueChange={(v) => updateField("category_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!isActive}
                onCheckedChange={(v) => updateField("is_active", v ? 1 : 0)}
              />
              <Label>Active</Label>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // PORT FORM
  const renderPortForm = () => {
    const portName = formData.port_name || formData.name || "";
    const portCode = formData.port_code || formData.code || "";
    const portType = formData.port_type || formData.type || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Port Name" value={portName} />
            <ViewField label="Port Code" value={portCode} />
            <ViewField label="Country" value={formData.country} />
            <ViewField label="Type" value={portType} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="port_name">Port Name *</Label>
              <Input
                id="port_name"
                value={portName}
                onChange={(e) => updateField("port_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="port_code">Port Code *</Label>
              <Input
                id="port_code"
                value={portCode}
                onChange={(e) => updateField("port_code", e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => updateField("country", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="port_type">Type *</Label>
              <Select
                value={portType}
                onValueChange={(v) => updateField("port_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seaport">Seaport</SelectItem>
                  <SelectItem value="airport">Airport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // SHIPPING LINE FORM
  const renderShippingLineForm = () => {
    const lineName = formData.line_name || formData.name || "";
    const lineCode = formData.line_code || formData.code || "";
    const contactEmail = formData.contact_email || formData.email || "";
    const contactPhone = formData.contact_phone || formData.phone || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Shipping Line Name" value={lineName} />
            <ViewField label="Code" value={lineCode} />
            <ViewField label="Country" value={formData.country} />
            <ViewField label="Contact Email" value={contactEmail} />
            <ViewField label="Contact Phone" value={contactPhone} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="line_name">Shipping Line Name *</Label>
              <Input
                id="line_name"
                value={lineName}
                onChange={(e) => updateField("line_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="line_code">Code *</Label>
              <Input
                id="line_code"
                value={lineCode}
                onChange={(e) => updateField("line_code", e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => updateField("country", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={contactEmail}
                onChange={(e) => updateField("contact_email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={contactPhone}
                onChange={(e) => updateField("contact_phone", e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // CURRENCY FORM
  const renderCurrencyForm = () => {
    const currencyCode = formData.currency_code || formData.code || "";
    const currencyName = formData.currency_name || formData.name || "";
    const exchangeRate = formData.exchange_rate || formData.exchangeRate || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Currency Code" value={currencyCode} />
            <ViewField label="Currency Name" value={currencyName} />
            <ViewField label="Symbol" value={formData.symbol} />
            <ViewField label="Exchange Rate to PHP" value={exchangeRate} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="currency_code">Currency Code *</Label>
              <Input
                id="currency_code"
                value={currencyCode}
                onChange={(e) => updateField("currency_code", e.target.value.toUpperCase())}
                placeholder="e.g., USD, EUR"
                maxLength={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="currency_name">Currency Name *</Label>
              <Input
                id="currency_name"
                value={currencyName}
                onChange={(e) => updateField("currency_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                value={formData.symbol || ""}
                onChange={(e) => updateField("symbol", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="exchange_rate">Exchange Rate to PHP *</Label>
              <Input
                id="exchange_rate"
                type="number"
                step="0.01"
                value={exchangeRate}
                onChange={(e) => updateField("exchange_rate", e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // TRUCKER FORM
  const renderTruckerForm = () => {
    const truckerName = formData.trucker_name || formData.name || "";
    const truckerType = formData.trucker_type || formData.type || "";
    const contactPerson = formData.contact_person || formData.contactPerson || "";
    const contactPhone = formData.contact_phone || formData.phone || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Trucker Name" value={truckerName} />
            <ViewField label="Type" value={truckerType} />
            <ViewField label="Contact Person" value={contactPerson} />
            <ViewField label="Contact Phone" value={contactPhone} />
            <ViewField label="Address" value={formData.address} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="trucker_name">Trucker Name *</Label>
              <Input
                id="trucker_name"
                value={truckerName}
                onChange={(e) => updateField("trucker_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="trucker_type">Type *</Label>
              <Select
                value={truckerType}
                onValueChange={(v) => updateField("trucker_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Fleet</SelectItem>
                  <SelectItem value="external">External Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={contactPerson}
                onChange={(e) => updateField("contact_person", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={contactPhone}
                onChange={(e) => updateField("contact_phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // SERVICE ITEM FORM
  const renderServiceItemForm = () => {
    const serviceType = formData.service_type || formData.service || "";
    const unitPrice = formData.unit_price || formData.defaultRate || "";
    const serviceCategories = categories.filter(c => c.category_type === 'service');

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Service Name" value={serviceType} />
            <ViewField label="Category" value={formData.category} />
            <ViewField label="Default Rate (PHP)" value={`₱${(parseFloat(unitPrice) || 0).toLocaleString()}`} />
            <ViewField label="Description" value={formData.description} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="service_type">Service Name *</Label>
              <Input
                id="service_type"
                value={serviceType}
                onChange={(e) => updateField("service_type", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(v) => updateField("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receipted">Receipted</SelectItem>
                  <SelectItem value="non-receipted">Non-Receipted</SelectItem>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_name}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit_price">Default Rate (PHP) *</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => updateField("unit_price", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // EXPENSE FORM
  const renderExpenseForm = () => {
    const categoryName = formData.category_name || formData.name || "";
    const expenseCategories = categories.filter(c => c.category_type === 'expense');

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Expense Name" value={categoryName} />
            <ViewField label="Category" value={formData.category} />
            <ViewField label="Description" value={formData.description} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="category_name">Expense Name *</Label>
              <Input
                id="category_name"
                value={categoryName}
                onChange={(e) => updateField("category_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(v) => updateField("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receipted">Receipted</SelectItem>
                  <SelectItem value="non-receipted">Non-Receipted</SelectItem>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_name}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // STATUS FORM
  const renderStatusForm = () => {
    const statusName = formData.status_name || formData.name || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Status Name" value={statusName} />
            <div>
              <Label className="text-xs text-muted-foreground">Badge Color</Label>
              <div className="mt-1">
                <Badge className={`bg-${formData.color}-600`}>{formData.color || "gray"}</Badge>
              </div>
            </div>
            <ViewField label="Description" value={formData.description} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="status_name">Status Name *</Label>
              <Input
                id="status_name"
                value={statusName}
                onChange={(e) => updateField("status_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="color">Badge Color *</Label>
              <Select
                value={formData.color || ""}
                onValueChange={(v) => updateField("color", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // CLIENT FORM
  const renderClientForm = () => {
    const clientName = formData.client_name || formData.name || "";
    const clientCode = formData.client_code || formData.code || "";
    const contactPerson = formData.contact_person || formData.contactPerson || "";
    const contactEmail = formData.contact_email || formData.email || "";
    const contactPhone = formData.contact_phone || formData.phone || "";
    const paymentTerms = formData.payment_terms || formData.paymentTerms || "";
    const creditLimit = formData.credit_limit || formData.creditLimit || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Client Name" value={clientName} />
            <ViewField label="Client Code" value={clientCode} />
            <ViewField label="Contact Person" value={contactPerson} />
            <ViewField label="Contact Email" value={contactEmail} />
            <ViewField label="Contact Phone" value={contactPhone} />
            <ViewField label="Address" value={formData.address} />
            <ViewField label="Payment Terms" value={paymentTerms} />
            <ViewField label="Credit Limit" value={`₱${(parseFloat(creditLimit) || 0).toLocaleString()}`} />
            <ViewField label="Preferred Currency" value={formData.preferred_currency} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={clientName}
                onChange={(e) => updateField("client_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="client_code">Client Code *</Label>
              <Input
                id="client_code"
                value={clientCode}
                onChange={(e) => updateField("client_code", e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                value={contactPerson}
                onChange={(e) => updateField("contact_person", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={contactEmail}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={contactPhone}
                onChange={(e) => updateField("contact_phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment_terms">Payment Terms *</Label>
              <Select
                value={paymentTerms}
                onValueChange={(v) => updateField("payment_terms", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash on Delivery (COD)">Cash on Delivery (COD)</SelectItem>
                  <SelectItem value="Net 7 Days">Net 7 Days</SelectItem>
                  <SelectItem value="Net 15 Days">Net 15 Days</SelectItem>
                  <SelectItem value="Net 30 Days">Net 30 Days</SelectItem>
                  <SelectItem value="Net 45 Days">Net 45 Days</SelectItem>
                  <SelectItem value="Net 60 Days">Net 60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="credit_limit">Credit Limit (PHP)</Label>
              <Input
                id="credit_limit"
                type="number"
                step="0.01"
                value={creditLimit}
                onChange={(e) => updateField("credit_limit", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="preferred_currency">Preferred Currency</Label>
              <Select
                value={formData.preferred_currency || "PHP"}
                onValueChange={(v) => updateField("preferred_currency", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.currency_id} value={currency.currency_code}>
                      {currency.currency_code} - {currency.currency_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // WAREHOUSE FORM
  const renderWarehouseForm = () => {
    const warehouseName = formData.warehouse_name || formData.name || "";
    const warehouseCode = formData.warehouse_code || formData.code || "";
    const warehouseType = formData.warehouse_type || formData.type || "";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Warehouse Name" value={warehouseName} />
            <ViewField label="Warehouse Code" value={warehouseCode} />
            <ViewField label="Address" value={formData.address} />
            <ViewField label="Type" value={warehouseType} />
            <ViewField label="Capacity (sqm)" value={formData.capacity} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="warehouse_name">Warehouse Name *</Label>
              <Input
                id="warehouse_name"
                value={warehouseName}
                onChange={(e) => updateField("warehouse_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="warehouse_code">Warehouse Code *</Label>
              <Input
                id="warehouse_code"
                value={warehouseCode}
                onChange={(e) => updateField("warehouse_code", e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="warehouse_type">Type *</Label>
              <Select
                value={warehouseType}
                onValueChange={(v) => updateField("warehouse_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonded">Bonded Warehouse</SelectItem>
                  <SelectItem value="standard">Standard Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity (sqm) *</Label>
              <Input
                id="capacity"
                type="number"
                step="0.01"
                value={formData.capacity || ""}
                onChange={(e) => updateField("capacity", e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // CONTAINER SIZE FORM
  const renderContainerSizeForm = () => {
    const sizeName = formData.size_name || formData.name || "";
    const isActive = formData.is_active !== undefined ? formData.is_active : 1;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Container Size" value={sizeName} />
            <ViewField label="Code" value={formData.size_code} />
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge className={isActive ? "bg-green-600" : "bg-gray-600"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <ViewField label="Description" value={formData.description} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="size_name">Container Size *</Label>
              <Input
                id="size_name"
                value={sizeName}
                onChange={(e) => updateField("size_name", e.target.value)}
                placeholder="e.g., 20 Footer, 40 Footer"
                required
              />
            </div>
            <div>
              <Label htmlFor="size_code">Code</Label>
              <Input
                id="size_code"
                value={formData.size_code || ""}
                onChange={(e) => updateField("size_code", e.target.value.toUpperCase())}
                placeholder="e.g., 20FT, 40FT"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!isActive}
                onCheckedChange={(v) => updateField("is_active", v ? 1 : 0)}
              />
              <Label>Active</Label>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Enter any additional notes"
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  // TRUCK SIZE FORM
  const renderTruckSizeForm = () => {
    const sizeName = formData.size_name || formData.name || "";
    const isActive = formData.is_active !== undefined ? formData.is_active : 1;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isViewMode ? (
          <>
            <ViewField label="Truck Size" value={sizeName} />
            <ViewField label="Code" value={formData.size_code} />
            <ViewField label="Truck Type" value={formData.truck_type} />
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge className={isActive ? "bg-green-600" : "bg-gray-600"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <ViewField label="Description" value={formData.description} />
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="size_name">Truck Size *</Label>
              <Input
                id="size_name"
                value={sizeName}
                onChange={(e) => updateField("size_name", e.target.value)}
                placeholder="e.g., 6W Forward, 10W Wingvan"
                required
              />
            </div>
            <div>
              <Label htmlFor="size_code">Code</Label>
              <Input
                id="size_code"
                value={formData.size_code || ""}
                onChange={(e) => updateField("size_code", e.target.value.toUpperCase())}
                placeholder="e.g., 6WF, 10WWV"
              />
            </div>
            <div>
              <Label htmlFor="truck_type">Truck Type</Label>
              <Select
                value={formData.truck_type || "other"}
                onValueChange={(v) => updateField("truck_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forward">Forward</SelectItem>
                  <SelectItem value="closed_van">Closed Van</SelectItem>
                  <SelectItem value="wingvan">Wingvan</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                  <SelectItem value="reefer">Reefer</SelectItem>
                  <SelectItem value="tanker">Tanker</SelectItem>
                  <SelectItem value="dump_truck">Dump Truck</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!isActive}
                onCheckedChange={(v) => updateField("is_active", v ? 1 : 0)}
              />
              <Label>Active</Label>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Enter any additional notes"
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          {!isViewMode && (
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} className={isViewMode ? "flex-1" : ""}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </form>
    );
  };

  const getDialogTitle = () => {
    const action = mode === "view" ? "View" : editingItem ? "Edit" : "Add";
    const typeMap: Record<string, string> = {
      "service-type": "Service Type",
      "category": "Category",
      "port": "Port/Location",
      "shipping-line": "Shipping Line",
      "currency": "Currency",
      "trucker": "Trucker",
      "service-item": "Service Item",
      "expense": "Expense Type",
      "booking-status": "Booking Status",
      "billing-status": "Billing Status",
      "client": "Client",
      "warehouse": "Warehouse",
      "container-size": "Container Size",
      "truck-size": "Truck Size",
    };
    return `${action} ${typeMap[type] || type}`;
  };

  const renderForm = () => {
    switch (type) {
      case "service-type":
        return renderServiceTypeForm();
      case "category":
        return renderCategoryForm();
      case "port":
        return renderPortForm();
      case "shipping-line":
        return renderShippingLineForm();
      case "currency":
        return renderCurrencyForm();
      case "trucker":
        return renderTruckerForm();
      case "service-item":
        return renderServiceItemForm();
      case "expense":
        return renderExpenseForm();
      case "booking-status":
      case "billing-status":
        return renderStatusForm();
      case "client":
        return renderClientForm();
      case "warehouse":
        return renderWarehouseForm();
      case "container-size":
        return renderContainerSizeForm();
      case "truck-size":
        return renderTruckSizeForm();
      default:
        return <div>Form not available for {type}</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}