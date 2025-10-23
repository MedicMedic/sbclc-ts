import { useState, useEffect, JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  SearchIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ArchiveIcon,
  ArchiveRestoreIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Trash2Icon,
} from "lucide-react";
import { QuotationForm } from "@/polymet/components/quotation-form";
import { getApiBase } from "@/api/config";

const API_BASE_URL = getApiBase() + "/api";

const getAuthToken = () => localStorage.getItem("token");
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getAuthToken()}`
});

interface QuotationItem {
  id?: string;
  item_id?: number;
  item_sequence: number;
  description: string;
  category: "receipted" | "non-receipted";
  warehouse?: string;
  container_size?: string;
  containerSize?: string;
  equipment_type?: string;
  currency: string;
  quantity: number;
  unit: string;
  rate: string | number;
  amount: number;
  locationFrom?: string;
  locationTo?: string;
  truckSize?: string;
  remarks?: string;
  custom_data?: any;
  [key: string]: any;
}

interface Quotation {
  quotation_id?: number;
  quotation_number: string;
  booking_id?: string;
  client_id: number;
  client_name?: string;
  service_type_id: number;
  service_type_name?: string;
  quotation_date: string;
  valid_until?: string;
  origin?: string;
  destination?: string;
  exchange_rate: number;
  base_currency: string;
  service_description?: string;
  notes?: string;
  receipted_total: number;
  non_receipted_total: number;
  total_amount: number;
  prepared_by?: string;
  approved_by?: string;
  status: string;
  contact_person?: string;
  contact_position?: string;
  consignee_position?: string;
  address?: string;
  contact_no?: string;
  payment_term?: string;
  items?: QuotationItem[];
  created_at?: string;
  updated_at?: string;
  is_deleted?: number;
}

interface LocalQuotation extends Quotation {
  quotation_id: number;
}

interface Stats {
  total: number;
  pendingApproval: number;
  approved: number;
  clientReview: number;
  approvedValue: number;
}

interface ColumnPreset {
  id: string;
  name: string;
  type: "text" | "number" | "select";
  options?: string[];
}

type SortField = "quotation_number" | "client_name" | "service_type_name" | "total_amount" | "status" | "valid_until" | "created_at";
type SortDirection = "asc" | "desc";

const api = {
  async fetchQuotations(params?: any): Promise<Quotation[]> {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/quotations${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error(`Failed to fetch quotations: ${response.statusText}`);
    return response.json();
  },

  async fetchQuotationById(id: number): Promise<Quotation> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`Failed to fetch quotation: ${response.statusText}`);
    return response.json();
  },

  async fetchStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/quotations/stats/summary`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`Failed to fetch stats: ${response.statusText}`);
    return response.json();
  },

  async createQuotation(data: Partial<Quotation>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create quotation');
    }
    return response.json();
  },

  async updateQuotation(id: number, data: Partial<Quotation>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update quotation');
    }
    return response.json();
  },

  async deleteQuotation(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete quotation');
    return response.json();
  },

  async permanentDeleteQuotation(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/permanent`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to permanently delete quotation');
    return response.json();
  },

  async reviveQuotation(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/revive`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to revive quotation');
    return response.json();
  },

  async approveQuotation(id: number, approvedBy: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ approvedBy })
    });
    if (!response.ok) throw new Error('Failed to approve quotation');
    return response.json();
  },

  async rejectQuotation(id: number, reason: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ rejectionReason: reason })
    });
    if (!response.ok) throw new Error('Failed to reject quotation');
    return response.json();
  },

  async fetchClients(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/clients`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  async fetchServiceTypes(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/service-types`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch service types');
    return response.json();
  },

  async fetchPorts(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/ports`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch ports');
    return response.json();
  },

  async fetchWarehouses(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/warehouses`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch warehouses');
    return response.json();
  },

  async fetchServiceRates(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/service-rates`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch service rates');
    return response.json();
  },

  async fetchCurrencies(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/currencies`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch currencies');
    return response.json();
  },

  async fetchContainerSizes(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/container-sizes`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch container sizes');
    return response.json();
  },

  async fetchTruckSizes(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/truck-sizes`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch truck sizes');
    return response.json();
  },

  async fetchCategories(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};

function formatAutoQuotationNumber(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `QT-${yyyy}-${rand}`;
}

function getStatusBadge(status: string) {
  const configs: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-gray-300 text-gray-800" },
    pending_approval: { label: "Pending Approval", className: "bg-orange-100 text-orange-800" },
    approved: { label: "Approved", className: "bg-green-100 text-green-800" },
    client_review: { label: "Client Review", className: "bg-blue-100 text-blue-800" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  };
  const config = configs[status] || configs.draft;
  return <Badge className={config.className}>{config.label}</Badge>;
}

function formatNotesAsBullets(notes: string | undefined): JSX.Element {
  if (!notes) return <span className="text-gray-400">No notes</span>;

  const lines = notes.split('\n').filter(line => line.trim());

  if (lines.length === 0) return <span className="text-gray-400">No notes</span>;

  return (
    <ul className="list-disc list-inside space-y-1">
      {lines.map((line, idx) => (
        <li key={idx} className="text-sm text-gray-600">{line.trim()}</li>
      ))}
    </ul>
  );
}

function formatDateToMMDDYYYY(dateString: string | undefined): string {
  if (!dateString) return "N/A";

  let date: Date;

  if (dateString.includes('/')) {
    const [month, day, year] = dateString.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

function canEditQuotation(status: string): boolean {
  return status === "draft" || status === "rejected";
}

function validateQuotation(data: Quotation, isDraft: boolean = false): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (isDraft) {
    return { valid: true, errors: [] };
  }

  if (!data.quotation_number?.trim()) {
    errors.push("Quotation number is required");
  }
  if (!data.client_id || data.client_id === 0) {
    errors.push("Client must be selected");
  }
  if (!data.service_type_id || data.service_type_id === 0) {
    errors.push("Service type must be selected");
  }
  if (!data.quotation_date?.trim()) {
    errors.push("Quotation date is required");
  }

  if (data.quotation_date) {
    const quotDate = new Date(data.quotation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    quotDate.setHours(0, 0, 0, 0);

    if (quotDate < today) {
      errors.push("Quotation date cannot be in the past");
    }
  }

  if (!data.items || data.items.length === 0) {
    errors.push("At least one service item is required");
  }

  return { valid: errors.length === 0, errors };
}

export function QuotationsPage() {
  const [quotations, setQuotations] = useState<LocalQuotation[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pendingApproval: 0,
    approved: 0,
    clientReview: 0,
    approvedValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [clients, setClients] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [currencyRates, setCurrencyRates] = useState<any[]>([]);
  const [containerSizes, setContainerSizes] = useState<string[]>([]);
  const [truckSizes, setTruckSizes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<LocalQuotation | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const fetchQuotationsData = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchQuotations();
      setQuotations(data as LocalQuotation[]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      alert("Failed to load quotations. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.fetchStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [
        clientsData,
        serviceTypesData,
        portsData,
        warehousesData,
        serviceRatesData,
        currenciesData,
        containerSizesData,
        truckSizesData,
        categoriesData
      ] = await Promise.all([
        api.fetchClients(),
        api.fetchServiceTypes(),
        api.fetchPorts(),
        api.fetchWarehouses(),
        api.fetchServiceRates(),
        api.fetchCurrencies(),
        api.fetchContainerSizes(),
        api.fetchTruckSizes(),
        api.fetchCategories()
      ]);

      setClients(clientsData.map(c => ({
        id: c.client_id,
        name: c.client_name,
        contact_person: c.contact_person,
        contact_position: c.contact_position,
        phone: c.phone,
        email: c.email,
        address: c.address,
        payment_terms: c.payment_terms,
        ...c
      })));

      setServiceTypes(serviceTypesData.map(s => ({
        id: s.service_type_id,
        name: s.service_type_name,
        ...s
      })));

      setPorts(portsData.map(p => ({
        id: p.port_id,
        name: p.port_name,
        code: p.port_code,
        ...p
      })));

      setWarehouses(warehousesData.map(w => ({
        id: w.warehouse_id,
        name: w.warehouse_name,
        ...w
      })));

      setServiceItems(serviceRatesData.map(s => ({
        id: s.rate_id,
        name: s.service_type,
        description: s.description,
        rate: s.unit_price,
        unit_price: s.unit_price,
        ...s
      })));

      setCurrencyRates(currenciesData);

      setContainerSizes(containerSizesData.map(cs => cs.size_name));
      setTruckSizes(truckSizesData.map(ts => ts.size_name));
      setCategories(categoriesData.map(cat => cat.category_name));
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  useEffect(() => {
    fetchQuotationsData();
    fetchStats();
    fetchMasterData();
    getCurrentUser();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUpIcon className="h-3 w-3 inline ml-1" />
    ) : (
      <ArrowDownIcon className="h-3 w-3 inline ml-1" />
    );
  };

  const handleCreateQuotation = () => {
    setSelectedQuotation(null);
    setShowCreateForm(true);
  };

  const handleEditQuotation = async (quotation: LocalQuotation) => {
    if (!canEditQuotation(quotation.status)) {
      alert("This quotation cannot be edited because it is " + quotation.status);
      return;
    }

    try {
      const fullQuotation = await api.fetchQuotationById(quotation.quotation_id);
      setSelectedQuotation(fullQuotation as LocalQuotation);
      setShowCreateForm(true);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
      alert("Failed to load quotation details");
    }
  };

  const handleViewQuotation = async (quotation: LocalQuotation) => {
    try {
      const fullQuotation = await api.fetchQuotationById(quotation.quotation_id);
      setSelectedQuotation(fullQuotation as LocalQuotation);
      setShowViewDialog(true);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
      alert("Failed to load quotation details");
    }
  };

  const handleDeleteQuotation = async (quotationId: number) => {
    if (!confirm("Are you sure you want to archive this quotation?")) return;

    try {
      await api.deleteQuotation(quotationId);
      alert("Quotation archived successfully.");
      fetchQuotationsData();
      fetchStats();
    } catch (error: any) {
      console.error("Error archiving quotation:", error);
      alert(error.message || "Failed to archive quotation");
    }
  };

  const handlePermanentDelete = async (quotationId: number) => {
    if (!confirm("⚠️ PERMANENT DELETE: This action cannot be undone. Are you absolutely sure?")) return;

    try {
      await api.permanentDeleteQuotation(quotationId);
      alert("Quotation permanently deleted.");
      fetchQuotationsData();
      fetchStats();
    } catch (error: any) {
      console.error("Error permanently deleting quotation:", error);
      alert(error.message || "Failed to permanently delete quotation");
    }
  };

  const handleReviveQuotation = async (quotationId: number) => {
    if (!confirm("Restore this quotation from archive?")) return;

    try {
      await api.reviveQuotation(quotationId);
      alert("Quotation restored successfully.");
      fetchQuotationsData();
      fetchStats();
    } catch (error: any) {
      console.error("Error reviving quotation:", error);
      alert(error.message || "Failed to revive quotation");
    }
  };

  const handleApprove = async (quotationId: number) => {
    if (!confirm("Approve this quotation?")) return;

    try {
      const approverName = currentUser?.full_name || currentUser?.email || "Current User";
      await api.approveQuotation(quotationId, approverName);
      alert("Quotation approved successfully.");
      fetchQuotationsData();
      fetchStats();
    } catch (error: any) {
      console.error("Error approving quotation:", error);
      alert(error.message || "Failed to approve quotation");
    }
  };

  const handleReject = async (quotationId: number) => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    try {
      await api.rejectQuotation(quotationId, reason);
      alert("Quotation rejected successfully. It can now be edited.");
      fetchQuotationsData();
      fetchStats();
    } catch (error: any) {
      console.error("Error rejecting quotation:", error);
      alert(error.message || "Failed to reject quotation");
    }
  };

  const handleSaveQuotation = async (quotationData: Quotation, action: "save" | "submit"): Promise<void> => {
    const isDraft = action === "save";

    const validation = validateQuotation(quotationData, isDraft);
    if (!validation.valid) {
      throw new Error(`Validation errors:\n${validation.errors.join('\n')}`);
    }

    const preparedBy = currentUser?.full_name ||
      (currentUser?.first_name && currentUser?.last_name ?
        `${currentUser.first_name} ${currentUser.last_name}` : null) ||
      currentUser?.email ||
      "Unknown User";

    const dataToSave = {
      ...quotationData,
      status: isDraft ? "draft" : "pending_approval",
      prepared_by: quotationData.prepared_by || preparedBy,
      base_currency: quotationData.base_currency || "PHP",
    };

    let result;
    if (selectedQuotation?.quotation_id) {
      result = await api.updateQuotation(selectedQuotation.quotation_id, dataToSave);
    } else {
      result = await api.createQuotation(dataToSave);
    }

    alert(
      `Quotation ${quotationData.quotation_number} ${selectedQuotation ? "updated" : isDraft ? "saved as draft" : "submitted for approval"
      } successfully.`
    );

    await fetchQuotationsData();
    await fetchStats();
    // Don't close form here - let the form component handle it
  };

  const handlePrintView = () => {
    window.print();
  };

  const filteredAndSortedQuotations = (() => {
    let filtered = quotations.filter(q => {
      const isArchived = q.is_deleted === 1;
      return showArchived ? isArchived : !isArchived;
    });

    filtered = filtered.filter((q) => {
      const matchesSearch =
        q.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.client_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || q.status === statusFilter;
      const matchesService = serviceFilter === "all" || q.service_type_id?.toString() === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "total_amount") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === "created_at" || sortField === "valid_until") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  })();

  const calculateApprovedValueInPHP = (): number => {
    const approvedQuotations = quotations.filter(
      q => q.status === "approved" && q.is_deleted !== 1
    );

    let totalInPHP = 0;

    approvedQuotations.forEach(q => {
      const amount = Number(q.total_amount) || 0;
      const currency = q.base_currency || "PHP";

      if (currency === "PHP") {
        totalInPHP += amount;
      } else {
        const currencyData = currencyRates.find(
          c => c.currency_code === currency
        );
        const exchangeRate = currencyData?.exchange_rate || q.exchange_rate || 1;
        totalInPHP += amount * exchangeRate;
      }
    });

    return totalInPHP;
  };

  const approvedValuePHP = calculateApprovedValueInPHP();

  const currencies = ["PHP", ...currencyRates.map(c => c.currency_code)];

  const columnPresets: ColumnPreset[] = [
    { id: "quantity", name: "Quantity", type: "number" },
    { id: "unit", name: "Unit", type: "text" },
    { id: "locationFrom", name: "Location From", type: "text" },
    { id: "locationTo", name: "Location To", type: "text" },
    { id: "containerSize", name: "Container Size", type: "select", options: containerSizes },
    { id: "truckSize", name: "Truck Size", type: "select", options: truckSizes },
    { id: "warehouse", name: "Warehouse", type: "select", options: warehouses.map(w => w.name) },
    { id: "equipment_type", name: "Equipment Type", type: "text" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Quotations
          </h1>
          <p className="text-gray-600">Manage quotations</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCreateQuotation} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
            <PlusIcon className="h-4 w-4 mr-2" /> Create Quotation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card onClick={() => setStatusFilter("pending_approval")} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#f97316]">{stats.pendingApproval}</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </CardContent>
        </Card>
        <Card onClick={() => setStatusFilter("approved")} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#10b981]">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card onClick={() => setStatusFilter("client_review")} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#1e40af]">{stats.clientReview}</div>
            <div className="text-sm text-gray-600">Client Review</div>
          </CardContent>
        </Card>
        <Card onClick={() => setStatusFilter("all")} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#6b7280]">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Quotations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              PHP {approvedValuePHP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-600">Approved Value</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                placeholder="Search quotations..."
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="client_review">Client Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {serviceTypes.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quotations List</CardTitle>
            <Button
              variant={showArchived ? "default" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2"
            >
              {showArchived ? (
                <>
                  <ArchiveRestoreIcon className="h-4 w-4" />
                  Show Active
                </>
              ) : (
                <>
                  <ArchiveIcon className="h-4 w-4" />
                  Show Archived
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("quotation_number")}
                >
                  Quotation No {getSortIcon("quotation_number")}
                </TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("client_name")}
                >
                  Client {getSortIcon("client_name")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("service_type_name")}
                >
                  Service Type {getSortIcon("service_type_name")}
                </TableHead>
                <TableHead>Route</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("total_amount")}
                >
                  Amount {getSortIcon("total_amount")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("valid_until")}
                >
                  Valid Until {getSortIcon("valid_until")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedQuotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {showArchived ? "No archived quotations found" : "No quotations found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedQuotations.map((q) => (
                  <TableRow key={q.quotation_id}>
                    <TableCell className="font-medium">{q.quotation_number}</TableCell>
                    <TableCell>{q.booking_id || "-"}</TableCell>
                    <TableCell>{q.client_name}</TableCell>
                    <TableCell>{q.service_type_name}</TableCell>
                    <TableCell className="text-sm">
                      {q.origin || "-"} → {q.destination || "-"}
                    </TableCell>
                    <TableCell>
                      {q.base_currency} {Number(q.total_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(q.status)}</TableCell>
                    <TableCell>{formatDateToMMDDYYYY(q.valid_until)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {showArchived ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReviveQuotation(q.quotation_id)}
                              title="Restore"
                              className="text-green-600 hover:text-green-800"
                            >
                              <ArchiveRestoreIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePermanentDelete(q.quotation_id)}
                              className="text-red-600 hover:text-red-800"
                              title="Permanent Delete"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleViewQuotation(q)} title="View">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuotation(q)}
                              title="Edit"
                              disabled={!canEditQuotation(q.status)}
                              className={!canEditQuotation(q.status) ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuotation(q.quotation_id)}
                              className="text-red-600 hover:text-red-800"
                              title="Archive"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>

                            {q.status === "pending_approval" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleApprove(q.quotation_id)} title="Approve" className="text-green-600">
                                  <CheckIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleReject(q.quotation_id)} title="Reject" className="text-red-600">
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <QuotationForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        quotation={selectedQuotation}
        onSave={handleSaveQuotation}
        clients={clients}
        serviceTypes={serviceTypes}
        serviceItems={serviceItems}
        ports={ports}
        warehouses={warehouses}
        currencies={currencies}
        containerSizes={containerSizes}
        truckSizes={truckSizes}
        categories={categories}
        columnPresets={columnPresets}
        generateQuotationNumber={formatAutoQuotationNumber}
        currencyRates={currencyRates}
        currentUser={currentUser}
      />

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" id="quotation-view-print">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Quotation Details</DialogTitle>
              <Button variant="outline" size="sm" onClick={handlePrintView} className="print:hidden">
                <PrinterIcon className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </DialogHeader>

          {selectedQuotation && (
            <div className="p-6 space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-[#1e40af] mb-2">{selectedQuotation.quotation_number}</h2>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Quotation Date: <span className="font-medium text-gray-900">{formatDateToMMDDYYYY(selectedQuotation.quotation_date)}</span></p>
                    <p className="text-sm text-gray-600">Valid Until: <span className="font-medium text-gray-900">{formatDateToMMDDYYYY(selectedQuotation.valid_until)}</span></p>
                  </div>
                  <div className="print:hidden">{getStatusBadge(selectedQuotation.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Client Information</h3>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Consignee:</span> {selectedQuotation.client_name}</p>
                    {selectedQuotation.consignee_position && (
                      <p className="text-sm"><span className="font-medium">Position:</span> {selectedQuotation.consignee_position}</p>
                    )}
                    {selectedQuotation.contact_person && (
                      <p className="text-sm"><span className="font-medium">Contact Person:</span> {selectedQuotation.contact_person}</p>
                    )}
                    {selectedQuotation.contact_position && (
                      <p className="text-sm"><span className="font-medium">Contact Position:</span> {selectedQuotation.contact_position}</p>
                    )}
                    {selectedQuotation.address && (
                      <p className="text-sm"><span className="font-medium">Address:</span> {selectedQuotation.address}</p>
                    )}
                    {selectedQuotation.contact_no && (
                      <p className="text-sm"><span className="font-medium">Contact No:</span> {selectedQuotation.contact_no}</p>
                    )}
                    {selectedQuotation.payment_term && (
                      <p className="text-sm"><span className="font-medium">Payment Term:</span> {selectedQuotation.payment_term}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Service Information</h3>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Service Type:</span> {selectedQuotation.service_type_name}</p>
                    {selectedQuotation.booking_id && (
                      <p className="text-sm"><span className="font-medium">Booking ID:</span> {selectedQuotation.booking_id}</p>
                    )}
                    <p className="text-sm"><span className="font-medium">Origin:</span> {selectedQuotation.origin || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Destination:</span> {selectedQuotation.destination || "N/A"}</p>
                    {selectedQuotation.service_description && (
                      <p className="text-sm"><span className="font-medium">Description:</span> {selectedQuotation.service_description}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedQuotation.items && selectedQuotation.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="font-semibold">Currency</TableHead>
                          <TableHead className="font-semibold text-right">Rate</TableHead>
                          <TableHead className="font-semibold text-right">Amount</TableHead>
                          <TableHead className="font-semibold">Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuotation.items.map((it, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{it.description}</TableCell>
                            <TableCell>
                              <Badge variant={it.category === "receipted" ? "default" : "secondary"}>
                                {it.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{it.currency}</TableCell>
                            <TableCell className="text-right">{Number(it.rate || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">{Number(it.amount || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-sm text-gray-600">{it.remarks || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <p className="text-xs text-blue-600 font-medium mb-1">Receipted Total</p>
                    <p className="text-xl font-bold text-blue-800">
                      {selectedQuotation.base_currency} {Number(selectedQuotation.receipted_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <p className="text-xs text-green-600 font-medium mb-1">Non-Receipted Total</p>
                    <p className="text-xl font-bold text-green-800">
                      {selectedQuotation.base_currency} {Number(selectedQuotation.non_receipted_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-100">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">Grand Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedQuotation.base_currency} {Number(selectedQuotation.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {selectedQuotation.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded border">
                    {formatNotesAsBullets(selectedQuotation.notes)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 border-t pt-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Prepared By</h3>
                  <p className="text-sm font-medium">{selectedQuotation.prepared_by || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Approved By</h3>
                  <p className="text-sm font-medium">{selectedQuotation.approved_by || "-"}</p>
                </div>
              </div>

              <div className="hidden print:block border-t pt-4 mt-8 text-center text-xs text-gray-500">
                <p>This is a system-generated quotation. No signature is required.</p>
                <p>Printed on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          
          body * {
            visibility: hidden;
          }
          
          #quotation-view-print,
          #quotation-view-print * {
            visibility: visible;
          }
          
          #quotation-view-print {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            overflow: visible !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          [role="dialog"],
          .fixed,
          .max-w-4xl {
            position: static !important;
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            transform: none !important;
          }
          
          .overflow-y-auto {
            overflow: visible !important;
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default QuotationsPage;