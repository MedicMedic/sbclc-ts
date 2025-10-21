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
import { Progress } from "@/components/ui/progress";
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  PrinterIcon,
  SendIcon,
  DollarSignIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";
import { AccountsReceivableForm } from "@/polymet/components/accounts-receivable-form";

export function CollectionMonitoringPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agingFilter, setAgingFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isARFormOpen, setIsARFormOpen] = useState(false);

  // Mock collection data
  const mockCollections = [
    {
      id: "COLL-2024-001",
      billingId: "BILL-2024-001",
      invoiceNumber: "INV-2024-001",
      clientName: "ABC Trading Corp",
      amount: 2593.0,
      currency: "USD",
      issueDate: "2024-01-16",
      dueDate: "2024-02-15",
      status: "overdue",
      agingDays: 5,
      paidAmount: 0,
      balanceAmount: 2593.0,
      paymentHistory: [],
    },
    {
      id: "COLL-2024-002",
      billingId: "BILL-2024-002",
      invoiceNumber: "INV-2024-002",
      clientName: "XYZ Manufacturing",
      amount: 1850.0,
      currency: "USD",
      issueDate: "2024-01-10",
      dueDate: "2024-02-09",
      status: "pending",
      agingDays: 12,
      paidAmount: 0,
      balanceAmount: 1850.0,
      paymentHistory: [],
    },
    {
      id: "COLL-2024-003",
      billingId: "BILL-2024-003",
      invoiceNumber: "INV-2024-003",
      clientName: "Local Trader Inc",
      amount: 750.0,
      currency: "PHP",
      issueDate: "2024-01-05",
      dueDate: "2024-02-04",
      status: "paid",
      agingDays: 0,
      paidAmount: 750.0,
      balanceAmount: 0,
      paymentHistory: [
        {
          date: "2024-02-01",
          amount: 750.0,
          method: "Bank Transfer",
          reference: "BT-2024-001",
        },
      ],
    },
    {
      id: "COLL-2024-004",
      billingId: "BILL-2024-004",
      invoiceNumber: "INV-2024-004",
      clientName: "Global Imports Ltd",
      amount: 3200.0,
      currency: "USD",
      issueDate: "2024-01-20",
      dueDate: "2024-02-19",
      status: "partial",
      agingDays: 1,
      paidAmount: 1600.0,
      balanceAmount: 1600.0,
      paymentHistory: [
        {
          date: "2024-02-10",
          amount: 1600.0,
          method: "Check",
          reference: "CHK-789123",
        },
      ],
    },
  ];

  // Filter collections
  const filteredCollections = mockCollections.filter((collection) => {
    const matchesSearch =
      collection.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      collection.billingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || collection.status === statusFilter;

    let matchesAging = true;
    if (agingFilter !== "all") {
      switch (agingFilter) {
        case "current":
          matchesAging = collection.agingDays <= 0;
          break;
        case "1-30":
          matchesAging =
            collection.agingDays >= 1 && collection.agingDays <= 30;
          break;
        case "31-60":
          matchesAging =
            collection.agingDays >= 31 && collection.agingDays <= 60;
          break;
        case "over-60":
          matchesAging = collection.agingDays > 60;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesAging;
  });

  // Statistics
  const stats = {
    total: mockCollections.length,
    pending: mockCollections.filter((c) => c.status === "pending").length,
    overdue: mockCollections.filter((c) => c.status === "overdue").length,
    paid: mockCollections.filter((c) => c.status === "paid").length,
    partial: mockCollections.filter((c) => c.status === "partial").length,
    totalOutstanding: mockCollections
      .filter((c) => c.status !== "paid")
      .reduce(
        (sum, c) =>
          sum +
          (c.currency === "USD" ? c.balanceAmount * 56.5 : c.balanceAmount),
        0
      ),
    totalCollected: mockCollections.reduce(
      (sum, c) =>
        sum + (c.currency === "USD" ? c.paidAmount * 56.5 : c.paidAmount),
      0
    ),
    collectionRate: 0,
  };

  stats.collectionRate =
    (stats.totalCollected / (stats.totalCollected + stats.totalOutstanding)) *
    100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-blue-600";
      case "overdue":
        return "text-red-600";
      case "partial":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      partial: "bg-yellow-100 text-yellow-800",
    };

    const labelMap = {
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
      partial: "Partial",
    };

    return (
      <Badge
        className={cn(
          "text-xs",
          colorMap[status as keyof typeof colorMap] ||
            "bg-gray-100 text-gray-800"
        )}
      >
        {labelMap[status as keyof typeof labelMap] || status}
      </Badge>
    );
  };

  const getAgingBadge = (days: number) => {
    if (days <= 0)
      return (
        <Badge variant="outline" className="text-xs">
          Current
        </Badge>
      );

    if (days <= 30)
      return (
        <Badge className="text-xs bg-yellow-100 text-yellow-800">
          1-30 days
        </Badge>
      );

    if (days <= 60)
      return (
        <Badge className="text-xs bg-orange-100 text-orange-800">
          31-60 days
        </Badge>
      );

    return (
      <Badge className="text-xs bg-red-100 text-red-800">Over 60 days</Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const handleProcessPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsARFormOpen(true);
  };

  const handlePaymentSubmit = (data: any) => {
    console.log("Payment processed:", data);
    // Here you would typically update the invoice status and payment history
    // For now, we'll just show a success message
    alert(
      `Payment of ${data.amountReceived} processed successfully for invoice ${data.invoiceNumber}`
    );
    setIsARFormOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Collection Monitoring
          </h1>
          <p className="text-gray-600">Track aging, paid and unpaid invoices</p>
        </div>
        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
          <PrinterIcon className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-[#1e40af]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-[#1e40af]">
                  {stats.total}
                </p>
              </div>
              <DollarSignIcon className="h-8 w-8 text-[#1e40af]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#3b82f6]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-[#3b82f6]">
                  {stats.pending}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-[#3b82f6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#f97316]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-[#f97316]">
                  {stats.overdue}
                </p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-[#f97316]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.paid}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#f97316]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-lg font-bold text-[#f97316]">
                  ₱{stats.totalOutstanding.toLocaleString()}
                </p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-[#f97316]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.collectionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingDownIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Collection Rate</span>
                <span>{stats.collectionRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.collectionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Collected: </span>
                <span className="font-medium text-green-600">
                  ₱{stats.totalCollected.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Outstanding: </span>
                <span className="font-medium text-red-600">
                  ₱{stats.totalOutstanding.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            All Invoices
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="overdue"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Overdue
          </TabsTrigger>
          <TabsTrigger
            value="aging"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            Aging Report
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
                      placeholder="Search by client, invoice number, or billing ID..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={agingFilter} onValueChange={setAgingFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Aging" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Aging</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="1-30">1-30 days</SelectItem>
                    <SelectItem value="31-60">31-60 days</SelectItem>
                    <SelectItem value="over-60">Over 60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Collection List */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Collection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aging</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell className="font-medium">
                          {collection.invoiceNumber}
                        </TableCell>
                        <TableCell>{collection.clientName}</TableCell>
                        <TableCell>{collection.issueDate}</TableCell>
                        <TableCell>{collection.dueDate}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(
                            collection.amount,
                            collection.currency
                          )}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(
                            collection.paidAmount,
                            collection.currency
                          )}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {formatCurrency(
                            collection.balanceAmount,
                            collection.currency
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(collection.status)}
                        </TableCell>
                        <TableCell>
                          {getAgingBadge(collection.agingDays)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit Invoice"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Send Reminder"
                            >
                              <SendIcon className="h-4 w-4" />
                            </Button>
                            {collection.status !== "paid" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Process Payment"
                                onClick={() => handleProcessPayment(collection)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <DollarSignIcon className="h-4 w-4" />
                              </Button>
                            )}
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

        {/* Other tabs would show filtered views */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Invoices that are pending payment and not yet overdue.
              </p>
              {/* Same table structure but filtered for pending status */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Invoices that have passed their due date and require immediate
                attention.
              </p>
              {/* Same table structure but filtered for overdue status */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aging Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {mockCollections.filter((c) => c.agingDays <= 0).length}
                  </div>
                  <div className="text-sm text-green-600">Current</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      mockCollections.filter(
                        (c) => c.agingDays >= 1 && c.agingDays <= 30
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-600">1-30 Days</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      mockCollections.filter(
                        (c) => c.agingDays >= 31 && c.agingDays <= 60
                      ).length
                    }
                  </div>
                  <div className="text-sm text-orange-600">31-60 Days</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {mockCollections.filter((c) => c.agingDays > 60).length}
                  </div>
                  <div className="text-sm text-red-600">Over 60 Days</div>
                </div>
              </div>
              {/* Detailed aging breakdown table would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Accounts Receivable Form */}
      {selectedInvoice && (
        <AccountsReceivableForm
          invoice={selectedInvoice}
          isOpen={isARFormOpen}
          onClose={() => {
            setIsARFormOpen(false);
            setSelectedInvoice(null);
          }}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
}
