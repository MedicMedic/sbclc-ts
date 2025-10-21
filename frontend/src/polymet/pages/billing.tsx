import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  PrinterIcon,
  SendIcon,
  FileTextIcon,
  CalculatorIcon,
  DollarSignIcon,
  TruckIcon,
  ShipIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";
import {
  billings,
  billingStatuses,
  billingTypes,
} from "@/polymet/data/logistics-data";
import { EnhancedCostAnalysisForm } from "@/polymet/components/enhanced-cost-analysis-form";
import { UnifiedSOAForm } from "@/polymet/components/unified-soa-form";
import { UnifiedServiceInvoiceForm } from "@/polymet/components/unified-service-invoice-form";

export function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBilling, setSelectedBilling] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "cost_analysis" | "soa" | "service_invoice" | null
  >(null);

  // Mock billing data
  const mockBillings = [
    {
      id: "BILL-2024-001",
      bookingId: "BK-2024-001",
      type: "import_forwarding",
      clientName: "ABC Trading Corp",
      billOfLading: "MAEU123456789",
      status: "pending_approval",
      totalAmount: 2593.0,
      currency: "USD",
      createdDate: "2024-01-16",
      dueDate: "2024-02-15",
      documents: {
        costAnalysis: true,
        soa: true,
        serviceInvoice: true,
      },
    },
    {
      id: "BILL-2024-002",
      bookingId: "BK-2024-002",
      type: "import_brokerage",
      clientName: "XYZ Manufacturing",
      billOfLading: "MSCU987654321",
      status: "draft",
      totalAmount: 1850.0,
      currency: "USD",
      createdDate: "2024-01-17",
      dueDate: "2024-02-16",
      documents: {
        costAnalysis: false,
        soa: false,
        serviceInvoice: false,
      },
    },
    {
      id: "BILL-2024-003",
      bookingId: "BK-2024-003",
      type: "domestic",
      clientName: "Local Trader Inc",
      billOfLading: "DOM123456",
      status: "sent",
      totalAmount: 750.0,
      currency: "PHP",
      createdDate: "2024-01-15",
      dueDate: "2024-02-14",
      documents: {
        costAnalysis: false, // Domestic doesn't need cost analysis
        soa: true,
        serviceInvoice: true,
      },
    },
  ];

  // Filter billings
  const filteredBillings = mockBillings.filter((billing) => {
    const matchesSearch =
      billing.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.billOfLading.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || billing.status === statusFilter;
    const matchesType = typeFilter === "all" || billing.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Statistics
  const stats = {
    total: mockBillings.length,
    draft: mockBillings.filter((b) => b.status === "draft").length,
    pending: mockBillings.filter((b) => b.status === "pending_approval").length,
    approved: mockBillings.filter((b) => b.status === "approved").length,
    sent: mockBillings.filter((b) => b.status === "sent").length,
    totalAmount: mockBillings.reduce(
      (sum, b) =>
        sum + (b.currency === "USD" ? b.totalAmount * 56.5 : b.totalAmount),
      0
    ),
  };

  const getStatusColor = (status: string) => {
    const statusObj = billingStatuses.find((s) => s.id === status);
    return statusObj?.color || "gray";
  };

  const getStatusBadge = (status: string) => {
    const statusObj = billingStatuses.find((s) => s.id === status);
    const colorMap = {
      yellow: "bg-yellow-100 text-yellow-800",
      green: "bg-green-100 text-green-800",
      blue: "bg-blue-100 text-blue-800",
      red: "bg-red-100 text-red-800",
      gray: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={cn(
          "text-xs",
          colorMap[statusObj?.color as keyof typeof colorMap] || colorMap.gray
        )}
      >
        {statusObj?.name || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "import_brokerage":
      case "import_forwarding":
        return <ShipIcon className="h-4 w-4" />;

      case "domestic":
        return <TruckIcon className="h-4 w-4" />;

      default:
        return <FileTextIcon className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeObj = billingTypes.find((t) => t.id === type);
    return typeObj?.name || type;
  };

  const openDialog = (
    type: "cost_analysis" | "soa" | "service_invoice",
    billing?: any
  ) => {
    setDialogType(type);
    setSelectedBilling(billing);
    setDialogOpen(true);
  };

  const handleCreateBilling = () => {
    // Navigate to create billing workflow
    console.log("Create new billing");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Billing Management
          </h1>
          <p className="text-gray-600">
            Manage import and domestic billing processes
          </p>
        </div>
        <Button
          onClick={handleCreateBilling}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Billing
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-[#1e40af]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Billings</p>
                <p className="text-2xl font-bold text-[#1e40af]">
                  {stats.total}
                </p>
              </div>
              <FileTextIcon className="h-8 w-8 text-[#1e40af]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
              <EditIcon className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#f97316]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-[#f97316]">
                  {stats.pending}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-[#f97316]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-lg font-bold text-green-600">
                  ₱{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSignIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            Import
          </TabsTrigger>
          <TabsTrigger
            value="domestic"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Domestic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                    <Input
                      placeholder="Search by client, booking ID, or B/L..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {billingStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {billingTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Billing List */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Billing ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>B/L Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBillings.map((billing) => (
                      <TableRow key={billing.id}>
                        <TableCell className="font-medium">
                          {billing.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(billing.type)}
                            <span className="text-sm">
                              {getTypeLabel(billing.type)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{billing.clientName}</TableCell>
                        <TableCell>{billing.bookingId}</TableCell>
                        <TableCell>{billing.billOfLading}</TableCell>
                        <TableCell className="font-medium">
                          {billing.currency}{" "}
                          {billing.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(billing.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {billing.documents.costAnalysis && (
                              <Badge variant="outline" className="text-xs">
                                CA
                              </Badge>
                            )}
                            {billing.documents.soa && (
                              <Badge variant="outline" className="text-xs">
                                SOA
                              </Badge>
                            )}
                            {billing.documents.serviceInvoice && (
                              <Badge variant="outline" className="text-xs">
                                SI
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <PrinterIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <div className="max-w-md mx-auto">
            {/* Import Billing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShipIcon className="h-5 w-5" />
                  Import Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => openDialog("cost_analysis")}
                  >
                    <CalculatorIcon className="h-5 w-5" />

                    <span>Cost Analysis</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => openDialog("soa")}
                  >
                    <FileTextIcon className="h-5 w-5" />

                    <span>SOA (Import & Domestic)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => openDialog("service_invoice")}
                  >
                    <DollarSignIcon className="h-5 w-5" />

                    <span>Service Invoice (Import & Domestic)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Domestic Tab */}
        <TabsContent value="domestic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5" />
                Domestic Billing Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => openDialog("soa")}
                >
                  <FileTextIcon className="h-6 w-6" />

                  <span>SOA (Import & Domestic)</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => openDialog("service_invoice")}
                >
                  <DollarSignIcon className="h-6 w-6" />

                  <span>Service Invoice (Import & Domestic)</span>
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Note: Domestic billing does not require cost analysis. Use the
                unified forms with Import/Domestic toggle.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for Forms */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "cost_analysis" && "Cost Analysis"}
              {dialogType === "soa" &&
                "Statement of Account (SOA) - Import & Domestic"}
              {dialogType === "service_invoice" &&
                "Service Invoice - Import & Domestic"}
            </DialogTitle>
          </DialogHeader>

          {dialogType === "cost_analysis" && (
            <EnhancedCostAnalysisForm
              bookingId="BK-2024-001"
              quotationId="QT-2024-001"
              cashAdvanceId="CA-2024-001"
              billingType="import_brokerage"
              onSubmit={(data) => {
                console.log("Cost analysis submitted:", data);
                setDialogOpen(false);
              }}
              onSave={(data) => {
                console.log("Cost analysis saved:", data);
              }}
              onPrint={(data) => {
                console.log("Cost analysis printed:", data);
              }}
            />
          )}

          {dialogType === "soa" && (
            <UnifiedSOAForm
              bookingId="BK-2024-001"
              onSubmit={(data) => {
                console.log("Unified SOA submitted:", data);
                setDialogOpen(false);
              }}
              onSave={(data) => {
                console.log("Unified SOA saved:", data);
              }}
              onPrint={(data) => {
                console.log("Unified SOA printed:", data);
              }}
            />
          )}

          {dialogType === "service_invoice" && (
            <UnifiedServiceInvoiceForm
              bookingId="BK-2024-001"
              onSubmit={(data) => {
                console.log("Unified Service invoice submitted:", data);
                setDialogOpen(false);
              }}
              onSave={(data) => {
                console.log("Unified Service invoice saved:", data);
              }}
              onPrint={(data) => {
                console.log("Unified Service invoice printed:", data);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
