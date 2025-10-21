// master-setup-table-sections.tsx - COMPLETE ENHANCED VERSION
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  EditIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2,
} from "lucide-react";

interface TableSectionProps {
  data?: any[];
  loading?: boolean;
  onAdd: (type: string) => void;
  onView: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: string | number, type: string) => void;
}

// ============================================================
// 1. SERVICE TYPES TABLE
// ============================================================
export function ServiceTypesTableSection({
  data = [],
  loading = false,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Types</h3>
          <p className="text-sm text-muted-foreground">
            Manage available service types and their configurations
          </p>
        </div>
        <Button
          onClick={() => onAdd("service-type")}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Service Type
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Service Name</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No service types found
                </TableCell>
              </TableRow>
            ) : (
              data.map((service) => (
                <TableRow key={service.service_type_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{service.service_type_name || service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        service.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }
                    >
                      {service.is_active ? (
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircleIcon className="h-3 w-3 mr-1" />
                      )}
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(service, "service-type")} disabled={loading} title="View details">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(service, "service-type")} disabled={loading} title="Edit">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(service.service_type_id, "service type")} disabled={loading} title="Delete">
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 2. CATEGORIES TABLE (ENHANCED)
// ============================================================
export function CategoriesTableSection({
  data = [],
  loading = false,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Categories</h3>
          <p className="text-sm text-muted-foreground">
            Manage expense and service categories
          </p>
        </div>
        <Button
          onClick={() => onAdd("category")}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Category Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              data.map((category) => (
                <TableRow key={category.category_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{category.category_name || category.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        category.category_type === "service" 
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : category.category_type === "expense"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {category.category_type || "general"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{category.description || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(category, "category")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(category, "category")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(category.category_id, "category")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 3. PORTS TABLE
// ============================================================
export function PortsTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ports & Locations</h3>
          <p className="text-sm text-muted-foreground">Manage ports, airports, and other locations</p>
        </div>
        <Button onClick={() => onAdd("port")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Port
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Port Name</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No ports found</TableCell></TableRow>
            ) : (
              data.map((port) => (
                <TableRow key={port.port_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{port.port_name}</TableCell>
                  <TableCell><Badge variant="outline">{port.port_code}</Badge></TableCell>
                  <TableCell>{port.country || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={port.port_type === "seaport" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                      {port.port_type || "seaport"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(port, "port")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(port, "port")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(port.port_id, "port")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 4. SHIPPING LINES TABLE
// ============================================================
export function ShippingLinesTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Shipping Lines & Partners</h3>
          <p className="text-sm text-muted-foreground">Manage shipping lines and logistics partners</p>
        </div>
        <Button onClick={() => onAdd("shipping-line")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Shipping Line
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Shipping Line</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No shipping lines found</TableCell></TableRow>
            ) : (
              data.map((line) => (
                <TableRow key={line.shipping_line_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{line.line_name}</TableCell>
                  <TableCell><Badge variant="outline">{line.line_code}</Badge></TableCell>
                  <TableCell>{line.country || "N/A"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{line.contact_email || line.email || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(line, "shipping-line")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(line, "shipping-line")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(line.shipping_line_id, "shipping line")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 5. CURRENCIES TABLE
// ============================================================
export function CurrenciesTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Currencies & Exchange Rates</h3>
          <p className="text-sm text-muted-foreground">Manage supported currencies and exchange rates</p>
        </div>
        <Button onClick={() => onAdd("currency")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Currency
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Currency Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Exchange Rate (to PHP)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No currencies found</TableCell></TableRow>
            ) : (
              data.map((currency) => (
                <TableRow key={currency.currency_id} className="hover:bg-muted/30">
                  <TableCell><Badge variant="outline" className="font-semibold">{currency.currency_code}</Badge></TableCell>
                  <TableCell className="font-medium">{currency.currency_name}</TableCell>
                  <TableCell><Badge>{currency.symbol}</Badge></TableCell>
                  <TableCell>{currency.exchange_rate || 1.0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(currency, "currency")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(currency, "currency")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(currency.currency_id, "currency")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 6. TRUCKERS TABLE
// ============================================================
export function TruckersTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Truckers & Fleet Management</h3>
          <p className="text-sm text-muted-foreground">Manage internal fleet and external trucking partners</p>
        </div>
        <Button onClick={() => onAdd("trucker")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Trucker
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Trucker Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No truckers found</TableCell></TableRow>
            ) : (
              data.map((trucker) => (
                <TableRow key={trucker.trucker_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{trucker.trucker_name}</TableCell>
                  <TableCell>
                    <Badge className={trucker.trucker_type === "internal" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                      {trucker.trucker_type || "external"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(trucker, "trucker")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(trucker, "trucker")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(trucker.trucker_id, "trucker")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 7. SERVICE ITEMS TABLE
// ============================================================
export function ServiceItemsTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Items & Pricing</h3>
          <p className="text-sm text-muted-foreground">Manage default rates for services and items</p>
        </div>
        <Button onClick={() => onAdd("service-item")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Service Item
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Default Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No service items found</TableCell></TableRow>
            ) : (
              data.map((rate) => (
                <TableRow key={rate.rate_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{rate.service_type}</TableCell>
                  <TableCell><Badge variant="outline">{rate.category || "N/A"}</Badge></TableCell>
                  <TableCell>₱{(rate.unit_price || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(rate, "service-item")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(rate, "service-item")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(rate.rate_id, "service item")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 8. EXPENSE TYPES TABLE
// ============================================================
export function ExpenseTypesTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Expense Types & Categories</h3>
          <p className="text-sm text-muted-foreground">Manage expense types for quotations and billing</p>
        </div>
        <Button onClick={() => onAdd("expense")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Expense Type
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Expense Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No expense types found</TableCell></TableRow>
            ) : (
              data.map((expense) => (
                <TableRow key={expense.category_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{expense.category_name}</TableCell>
                  <TableCell>
                    <Badge className={expense.category === "receipted" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {expense.category || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(expense, "expense")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(expense, "expense")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(expense.category_id, "expense type")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 9. STATUSES TABLE
// ============================================================
interface StatusesTableSectionProps {
  bookingStatuses?: any[];
  billingStatuses?: any[];
  loading?: boolean;
  onAdd: (type: string) => void;
  onView: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: string | number, type: string) => void;
}

export function StatusesTableSection({ bookingStatuses = [], billingStatuses = [], loading = false, onAdd, onView, onEdit, onDelete }: StatusesTableSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Status Configurations</h3>
        <p className="text-sm text-muted-foreground">Manage status options for bookings, billing, and workflows</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Booking Statuses</h4>
            <Button size="sm" onClick={() => onAdd("booking-status")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Status Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={2} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : bookingStatuses.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-sm">No booking statuses found</TableCell></TableRow>
                ) : (
                  bookingStatuses.map((status) => (
                    <TableRow key={status.status_id} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge className={`bg-${status.color}-100 text-${status.color}-800`}>{status.status_name}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onView(status, "booking-status")} disabled={loading}><EyeIcon className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(status, "booking-status")} disabled={loading}><EditIcon className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => onDelete(status.status_id, "booking status")} disabled={loading}><TrashIcon className="h-3 w-3 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Billing Statuses</h4>
            <Button size="sm" onClick={() => onAdd("billing-status")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Status Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={2} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : billingStatuses.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-sm">No billing statuses found</TableCell></TableRow>
                ) : (
                  billingStatuses.map((status) => (
                    <TableRow key={status.status_id} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge className={`bg-${status.color}-100 text-${status.color}-800`}>{status.status_name}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onView(status, "billing-status")} disabled={loading}><EyeIcon className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(status, "billing-status")} disabled={loading}><EditIcon className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => onDelete(status.status_id, "billing status")} disabled={loading}><TrashIcon className="h-3 w-3 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 10. CLIENTS TABLE
// ============================================================
export function ClientsTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Client Management</h3>
          <p className="text-sm text-muted-foreground">Manage client information and credit limits</p>
        </div>
        <Button onClick={() => onAdd("client")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Client
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Client Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Preferred Currency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No clients found</TableCell></TableRow>
            ) : (
              data.map((client) => (
                <TableRow key={client.client_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{client.client_name}</TableCell>
                  <TableCell><Badge variant="outline">{client.client_code}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{client.contact_person || "N/A"}</TableCell>
                  <TableCell>{client.payment_terms || "Net 30 Days"}</TableCell>
                  <TableCell>₱{(client.credit_limit || 0).toLocaleString()}</TableCell>
                  <TableCell>{client.preferred_currency || "PHP"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(client, "client")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(client, "client")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(client.client_id, "client")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 11. WAREHOUSES TABLE
// ============================================================
export function WarehousesTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Warehouse Management</h3>
          <p className="text-sm text-muted-foreground">Manage warehouse locations and capacities</p>
        </div>
        <Button onClick={() => onAdd("warehouse")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Warehouse
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Warehouse Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No warehouses found</TableCell></TableRow>
            ) : (
              data.map((warehouse) => (
                <TableRow key={warehouse.warehouse_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{warehouse.warehouse_name}</TableCell>
                  <TableCell><Badge variant="outline">{warehouse.warehouse_code}</Badge></TableCell>
                  <TableCell>
                    <Badge className={warehouse.warehouse_type === "bonded" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                      {warehouse.warehouse_type || "standard"}
                    </Badge>
                  </TableCell>
                  <TableCell>{warehouse.capacity || 0} sqm</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{warehouse.address || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(warehouse, "warehouse")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(warehouse, "warehouse")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(warehouse.warehouse_id, "warehouse")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 12. CONTAINER SIZES TABLE (ENHANCED)
// ============================================================
export function ContainerSizesTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Container Sizes</h3>
          <p className="text-sm text-muted-foreground">Manage available container sizes (20 Footer, 40 Footer, etc.)</p>
        </div>
        <Button onClick={() => onAdd("container-size")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Container Size
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Container Size</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No container sizes found</TableCell></TableRow>
            ) : (
              data.map((container) => (
                <TableRow key={container.container_size_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{container.size_name}</TableCell>
                  <TableCell>
                    {container.size_code ? <Badge variant="outline">{container.size_code}</Badge> : <span className="text-muted-foreground text-sm">N/A</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={container.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {container.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(container, "container-size")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(container, "container-size")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(container.container_size_id, "container size")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// 13. TRUCK SIZES TABLE (ENHANCED)
// ============================================================
export function TruckSizesTableSection({ data = [], loading = false, onAdd, onView, onEdit, onDelete }: TableSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Truck Sizes</h3>
          <p className="text-sm text-muted-foreground">Manage available truck sizes (6W Forward, 10W Wingvan, etc.)</p>
        </div>
        <Button onClick={() => onAdd("truck-size")} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />Add Truck Size
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Truck Size</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No truck sizes found</TableCell></TableRow>
            ) : (
              data.map((truck) => (
                <TableRow key={truck.truck_size_id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{truck.size_name}</TableCell>
                  <TableCell>
                    {truck.size_code ? <Badge variant="outline">{truck.size_code}</Badge> : <span className="text-muted-foreground text-sm">N/A</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={truck.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {truck.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(truck, "truck-size")} disabled={loading}><EyeIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(truck, "truck-size")} disabled={loading}><EditIcon className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(truck.truck_size_id, "truck size")} disabled={loading}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}