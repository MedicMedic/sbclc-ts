import React, { useState } from "react";
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
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import { CashAdvanceForm } from "@/polymet/components/cash-advance-form";
import { StructuredCashAdvanceForm } from "@/polymet/components/structured-cash-advance-form";
import { CashAdvanceDisbursementForm } from "@/polymet/components/cash-advance-disbursement-form";

// Mock cash advance data
const mockCashAdvances = [
  {
    id: "CA-2024-001",
    bookingId: "BK-2024-001",
    requestedBy: "John Doe",
    department: "Booking",
    purpose: "Import customs duties and port charges",
    totalAmount: 85000,
    currency: "PHP",
    status: "pending_accounting",
    urgency: "high",
    requestedDate: "2024-01-15",
    requiredDate: "2024-01-20",
    createdAt: "2024-01-15",
    itemsCount: 4,
  },
  {
    id: "CA-2024-002",
    bookingId: "BK-2024-002",
    requestedBy: "Jane Smith",
    department: "Operations",
    purpose: "Trucking expenses and fuel costs",
    totalAmount: 25000,
    currency: "PHP",
    status: "pending_finance",
    urgency: "normal",
    requestedDate: "2024-01-14",
    requiredDate: "2024-01-18",
    createdAt: "2024-01-14",
    itemsCount: 2,
  },
  {
    id: "CA-2024-003",
    bookingId: "BK-2024-003",
    requestedBy: "Mike Johnson",
    department: "Customs",
    purpose: "Storage fees and handling charges",
    totalAmount: 45000,
    currency: "PHP",
    status: "approved",
    urgency: "normal",
    requestedDate: "2024-01-13",
    requiredDate: "2024-01-17",
    createdAt: "2024-01-13",
    approvedDate: "2024-01-14",
    itemsCount: 3,
  },
  {
    id: "CA-2024-004",
    bookingId: "BK-2024-004",
    requestedBy: "Sarah Wilson",
    department: "Booking",
    purpose: "Port documentation and inspection fees",
    totalAmount: 15000,
    currency: "PHP",
    status: "disbursed",
    urgency: "low",
    requestedDate: "2024-01-12",
    requiredDate: "2024-01-16",
    createdAt: "2024-01-12",
    approvedDate: "2024-01-13",
    disbursedDate: "2024-01-14",
    itemsCount: 2,
  },
  {
    id: "CA-2024-005",
    bookingId: "BK-2024-005",
    requestedBy: "Tom Brown",
    department: "Operations",
    purpose: "Emergency repair costs",
    totalAmount: 35000,
    currency: "PHP",
    status: "rejected",
    urgency: "urgent",
    requestedDate: "2024-01-11",
    requiredDate: "2024-01-12",
    createdAt: "2024-01-11",
    rejectedDate: "2024-01-12",
    rejectionReason: "Insufficient documentation",
    itemsCount: 1,
  },
];

export function CashAdvancePage() {
  const [cashAdvances, setCashAdvances] = useState(mockCashAdvances);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formType, setFormType] = useState<"simple" | "structured">(
    "structured"
  );
  const [selectedCA, setSelectedCA] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDisbursementDialog, setShowDisbursementDialog] = useState(false);

  const filteredCashAdvances = cashAdvances.filter((ca) => {
    const matchesSearch =
      ca.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ca.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ca.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ca.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ca.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "all" || ca.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      pending_accounting: {
        variant: "default" as const,
        label: "Pending",
        className: "bg-[#2E3B8E] hover:bg-[#2E3B8E]/90",
      },
      pending_finance: {
        variant: "default" as const,
        label: "Pending",
        className: "bg-[#FF6B35] hover:bg-[#FF6B35]/90",
      },
      approved: {
        variant: "default" as const,
        label: "Approved",
        className: "bg-green-600",
      },
      disbursed: {
        variant: "default" as const,
        label: "Disbursed",
        className: "bg-emerald-600",
      },
      rejected: { variant: "destructive" as const, label: "Rejected" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { variant: "secondary" as const, label: "Low" },
      normal: {
        variant: "default" as const,
        label: "Normal",
        className: "bg-[#4A5FC1] hover:bg-[#4A5FC1]/90",
      },
      high: {
        variant: "default" as const,
        label: "High",
        className: "bg-[#FF6B35] hover:bg-[#FF6B35]/90",
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

  const handleApprove = (caId: string) => {
    setCashAdvances(
      cashAdvances.map((ca) =>
        ca.id === caId
          ? {
              ...ca,
              status:
                ca.status === "pending_accounting"
                  ? "pending_finance"
                  : "approved",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : ca
      )
    );
  };

  const handleReject = (caId: string) => {
    setCashAdvances(
      cashAdvances.map((ca) =>
        ca.id === caId
          ? {
              ...ca,
              status: "rejected",
              rejectedDate: new Date().toISOString().split("T")[0],
              rejectionReason: "Rejected by user",
            }
          : ca
      )
    );
  };

  const handleDisburse = (ca: any) => {
    setSelectedCA(ca);
    setShowDisbursementDialog(true);
  };

  const handleDisbursementSubmit = (data: any) => {
    setCashAdvances(
      cashAdvances.map((ca) =>
        ca.id === data.cashAdvanceId
          ? {
              ...ca,
              status: "disbursed",
              disbursedDate: data.disbursementDate,
              disbursementDetails: data,
            }
          : ca
      )
    );
    setShowDisbursementDialog(false);
    setSelectedCA(null);
  };

  const handleCreateCA = (data: any) => {
    const newCA = {
      id: `CA-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString().split("T")[0],
      itemsCount: data.items?.length || 0,
    };
    setCashAdvances([newCA, ...cashAdvances]);
    setShowCreateForm(false);
  };

  const handleSaveCA = (data: any) => {
    console.log("Cash advance saved:", data);
  };

  // Calculate statistics
  const stats = {
    total: cashAdvances.length,
    pending: cashAdvances.filter((ca) => ca.status.includes("pending")).length,
    approved: cashAdvances.filter((ca) => ca.status === "approved").length,
    disbursed: cashAdvances.filter((ca) => ca.status === "disbursed").length,
    totalAmount: cashAdvances
      .filter((ca) => ca.status === "disbursed")
      .reduce((sum, ca) => sum + ca.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cash Advance Management
          </h1>
          <p className="text-gray-600">
            Manage cash advance requests and approvals
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-[#2E3B8E] to-[#4A5FC1] hover:from-[#2E3B8E]/90 hover:to-[#4A5FC1]/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Cash Advance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-600" />

              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-orange-600" />

              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5 text-green-600" />

              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-emerald-600" />

              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.disbursed}
                </div>
                <div className="text-sm text-gray-600">Disbursed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-gray-600" />

              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₱{stats.totalAmount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Disbursed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                <Input
                  placeholder="Search cash advances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_accounting">
                  Pending Accounting
                </SelectItem>
                <SelectItem value="pending_finance">Pending Finance</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cash Advances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Advance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CA Number</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Required Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCashAdvances.map((ca) => (
                <TableRow key={ca.id}>
                  <TableCell className="font-medium">{ca.id}</TableCell>
                  <TableCell>{ca.bookingId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ca.requestedBy}</div>
                      <div className="text-sm text-gray-500">
                        {ca.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={ca.purpose}>
                      {ca.purpose}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ca.itemsCount} items
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {ca.currency} {ca.totalAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ca.status)}</TableCell>
                  <TableCell>{getUrgencyBadge(ca.urgency)}</TableCell>
                  <TableCell>{ca.requiredDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCA(ca);
                          setShowViewDialog(true);
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {ca.status === "pending_accounting" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(ca.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {ca.status === "pending_finance" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(ca.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {ca.status === "approved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisburse(ca)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Process Disbursement"
                        >
                          <DollarSignIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {(ca.status.includes("pending") ||
                        ca.status === "approved") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(ca.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Cash Advance Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Create New Cash Advance Request</span>
              <div className="flex gap-2">
                <Button
                  variant={formType === "structured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormType("structured")}
                >
                  Structured Form
                </Button>
                <Button
                  variant={formType === "simple" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormType("simple")}
                >
                  Simple Form
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {formType === "structured" ? (
            <StructuredCashAdvanceForm
              onSubmit={handleCreateCA}
              onSave={handleSaveCA}
            />
          ) : (
            <CashAdvanceForm onSubmit={handleCreateCA} onSave={handleSaveCA} />
          )}
        </DialogContent>
      </Dialog>

      {/* View Cash Advance Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cash Advance Details - {selectedCA?.id}</DialogTitle>
          </DialogHeader>
          {selectedCA && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Requested By
                  </label>
                  <p className="text-lg">{selectedCA.requestedBy}</p>
                  <p className="text-sm text-gray-500">
                    {selectedCA.department}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Booking ID
                  </label>
                  <p className="text-lg">{selectedCA.bookingId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Purpose
                  </label>
                  <p className="text-lg">{selectedCA.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Amount
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedCA.currency}{" "}
                    {selectedCA.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Required Date
                  </label>
                  <p className="text-lg">{selectedCA.requiredDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Items Count
                  </label>
                  <p className="text-lg">{selectedCA.itemsCount} items</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                {getStatusBadge(selectedCA.status)}
                {getUrgencyBadge(selectedCA.urgency)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disbursement Dialog */}
      <Dialog
        open={showDisbursementDialog}
        onOpenChange={setShowDisbursementDialog}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Process Disbursement - {selectedCA?.id}</DialogTitle>
          </DialogHeader>
          {selectedCA && (
            <CashAdvanceDisbursementForm
              cashAdvance={selectedCA}
              onSubmit={handleDisbursementSubmit}
              onCancel={() => {
                setShowDisbursementDialog(false);
                setSelectedCA(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
