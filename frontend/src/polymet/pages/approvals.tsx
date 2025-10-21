import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FileTextIcon,
  DollarSignIcon,
  FileIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  AlertCircleIcon,
  Loader2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";
import { ApprovalTransactionDetails } from "@/polymet/components/approval-transaction-details";
import * as ApprovalsAPI from "@/api/approvals-api";

interface ApprovalItem {
  id: string;
  type: "quotation" | "cost_analysis" | "soa" | "service_invoice" | "cash_advance";
  referenceNo: string;
  clientName: string;
  amount: number;
  currency: string;
  submittedBy: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "pending_approval";
  priority: "high" | "medium" | "low";
  bookingNo?: string;
  serviceType?: string;
  description?: string;
}

type SortField = "referenceNo" | "clientName" | "amount" | "submittedBy" | "submittedDate" | "priority" | "status";
type SortDirection = "asc" | "desc";

export function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "view">("view");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    pendingApprovals: 0,
    approved: 0,
    rejected: 0,
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("submittedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Get current user on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  // Fetch approvals and stats on mount and when tab changes
  useEffect(() => {
    fetchApprovals();
    fetchStats();
  }, [selectedTab]);

  const fetchStats = async () => {
    try {
      const statsData = await ApprovalsAPI.getApprovalStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      // Determine status filter based on selected tab
      let statusFilter: string | undefined = undefined;
      
      if (selectedTab === "pending") {
        statusFilter = "pending_approval";
      } else if (selectedTab === "approved") {
        statusFilter = "approved";
      } else if (selectedTab === "rejected") {
        statusFilter = "rejected";
      }
      // For "all" and type tabs (quotation, cost_analysis, etc.), don't pass a status filter

      const data = await ApprovalsAPI.getApprovals(statusFilter);
      console.log(`📊 Fetched ${data.length} approvals for tab: ${selectedTab}`);
      setApprovals(data);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quotation":
        return <FileTextIcon className="h-4 w-4" />;
      case "cost_analysis":
        return <DollarSignIcon className="h-4 w-4" />;
      case "soa":
        return <FileIcon className="h-4 w-4" />;
      case "service_invoice":
        return <FileTextIcon className="h-4 w-4" />;
      case "cash_advance":
        return <DollarSignIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "quotation":
        return "Quotation";
      case "cost_analysis":
        return "Cost Analysis";
      case "soa":
        return "SOA";
      case "service_invoice":
        return "Service Invoice";
      case "cash_advance":
        return "Cash Advance";
      default:
        return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_approval":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Sorting function
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

  // Filter and sort approvals
  const filteredAndSortedApprovals = (() => {
    let filtered = approvals.filter((approval) => {
      // Tab filtering
      const matchesTab = (() => {
        if (selectedTab === "all") return true; // Show all statuses when "all" is selected
        
        if (selectedTab === "pending") {
          return approval.status === "pending" || approval.status === "pending_approval";
        }
        
        if (selectedTab === "approved") {
          return approval.status === "approved";
        }
        
        if (selectedTab === "rejected") {
          return approval.status === "rejected";
        }
        
        // For type tabs (quotation, cost_analysis, etc.)
        return approval.type === selectedTab;
      })();

      const matchesSearch =
        searchQuery === "" ||
        approval.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.bookingNo?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        filterPriority === "all" || approval.priority === filterPriority;

      return matchesTab && matchesSearch && matchesPriority;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle different data types
      if (sortField === "amount") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === "submittedDate") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
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

  const pendingCount = stats.pendingApprovals;
  const approvedCount = stats.approved;
  const rejectedCount = stats.rejected;

  const handleViewDetails = async (approval: ApprovalItem) => {
    try {
      setLoading(true);
      const fullDetails = await ApprovalsAPI.getQuotationDetails(approval.id);
      
      const mergedData = {
        ...fullDetails,
        id: approval.id, // Keep the original id
        type: approval.type,
        referenceNo: approval.referenceNo,
        clientName: approval.clientName || fullDetails.client_name,
        amount: approval.amount,
        currency: approval.currency,
        submittedBy: approval.submittedBy,
        submittedDate: approval.submittedDate,
        status: approval.status,
        priority: approval.priority,
        bookingNo: approval.bookingNo,
        serviceType: approval.serviceType || fullDetails.service_type_name,
      };
      
      setSelectedApproval(mergedData as any);
      setActionType("view");
      setIsDialogOpen(true);
      setComments("");
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approval: ApprovalItem) => {
    try {
      setLoading(true);
      const fullDetails = await ApprovalsAPI.getQuotationDetails(approval.id);
      
      const mergedData = {
        ...fullDetails,
        id: approval.id, // Keep the original id
        type: approval.type,
        referenceNo: approval.referenceNo,
        clientName: approval.clientName || fullDetails.client_name,
        amount: approval.amount,
        currency: approval.currency,
        submittedBy: approval.submittedBy,
        submittedDate: approval.submittedDate,
        status: approval.status,
        priority: approval.priority,
        bookingNo: approval.bookingNo,
        serviceType: approval.serviceType || fullDetails.service_type_name,
      };
      
      setSelectedApproval(mergedData as any);
      setActionType("approve");
      setIsDialogOpen(true);
      setComments("");
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (approval: ApprovalItem) => {
    try {
      setLoading(true);
      const fullDetails = await ApprovalsAPI.getQuotationDetails(approval.id);
      
      const mergedData = {
        ...fullDetails,
        id: approval.id, // Keep the original id
        type: approval.type,
        referenceNo: approval.referenceNo,
        clientName: approval.clientName || fullDetails.client_name,
        amount: approval.amount,
        currency: approval.currency,
        submittedBy: approval.submittedBy,
        submittedDate: approval.submittedDate,
        status: approval.status,
        priority: approval.priority,
        bookingNo: approval.bookingNo,
        serviceType: approval.serviceType || fullDetails.service_type_name,
      };
      
      setSelectedApproval(mergedData as any);
      setActionType("reject");
      setIsDialogOpen(true);
      setComments("");
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAction = async () => {
    if (!selectedApproval) return;

    if (actionType === "reject" && !comments.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setSubmitting(true);
    
    const approvalInfo = {
      type: selectedApproval.type,
      referenceNo: selectedApproval.referenceNo,
      action: actionType
    };

    // Check if this is an override (admin changing already approved/rejected)
    const isOverride = selectedApproval.status !== 'pending_approval' && 
                       selectedApproval.status !== 'pending';

    try {
      console.log(`📄 Starting ${actionType} for ${approvalInfo.referenceNo}${isOverride ? ' (OVERRIDE)' : ''}...`);
      
      if (actionType === "approve") {
        await ApprovalsAPI.approveQuotation(selectedApproval.id, comments, isOverride);
        console.log("✅ Approve API call successful");
      } else if (actionType === "reject") {
        await ApprovalsAPI.rejectQuotation(selectedApproval.id, comments, isOverride);
        console.log("✅ Reject API call successful");
      }

      console.log("📄 Refreshing data...");
      await Promise.all([fetchApprovals(), fetchStats()]);
      console.log("✅ Data refresh complete");

      setIsDialogOpen(false);
      setSelectedApproval(null);
      setComments("");

      setTimeout(() => {
        const overrideText = isOverride ? ' (Admin Override)' : '';
        alert(
          `${getTypeLabel(approvalInfo.type)} ${approvalInfo.referenceNo} has been ${approvalInfo.action === "approve" ? "approved" : "rejected"} successfully!${overrideText}`
        );
      }, 100);

    } catch (error: any) {
      console.error("❌ Error submitting action:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${actionType} ${getTypeLabel(approvalInfo.type)}`;
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle stat card clicks
  const handleStatCardClick = (status: string) => {
    setSelectedTab(status);
  };

  // Check if user can override (is admin)
  const canOverride = currentUser?.role === 'admin';

  // Check if action buttons should be shown
  const shouldShowActionButtons = (approval: ApprovalItem) => {
    const isPending = approval.status === 'pending' || approval.status === 'pending_approval';
    return isPending || canOverride;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Approvals Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review and process pending transactions requiring approval
          </p>
        </div>
      </div>

      {/* Stats Cards - NOW CLICKABLE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatCardClick("pending")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {pendingCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatCardClick("approved")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {approvedCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatCardClick("rejected")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {rejectedCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatCardClick("all")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by reference no, client name, or booking no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[180px]">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="quotation">Quotations</TabsTrigger>
              <TabsTrigger value="cost_analysis">Cost Analysis</TabsTrigger>
              <TabsTrigger value="soa">SOA</TabsTrigger>
              <TabsTrigger value="service_invoice">Service Invoice</TabsTrigger>
              <TabsTrigger value="cash_advance">Cash Advance</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading approvals...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("referenceNo")}
                    >
                      Reference No {getSortIcon("referenceNo")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("clientName")}
                    >
                      Client Name {getSortIcon("clientName")}
                    </TableHead>
                    <TableHead>Booking No</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("amount")}
                    >
                      Amount {getSortIcon("amount")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("submittedBy")}
                    >
                      Submitted By {getSortIcon("submittedBy")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("submittedDate")}
                    >
                      Date {getSortIcon("submittedDate")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("priority")}
                    >
                      Priority {getSortIcon("priority")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-gray-500"
                      >
                        No approvals found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(approval.type)}
                            <span className="text-sm font-medium">
                              {getTypeLabel(approval.type)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {approval.referenceNo}
                        </TableCell>
                        <TableCell>{approval.clientName}</TableCell>
                        <TableCell>{approval.bookingNo || "-"}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {approval.serviceType || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {approval.currency} {approval.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>{approval.submittedBy}</TableCell>
                        <TableCell>
                          {new Date(approval.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              getPriorityColor(approval.priority)
                            )}
                          >
                            {approval.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              getStatusColor(approval.status)
                            )}
                          >
                            {approval.status === 'pending_approval' ? 'pending' : approval.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(approval)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            {shouldShowActionButtons(approval) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(approval)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title={
                                    approval.status !== 'pending' && approval.status !== 'pending_approval'
                                      ? 'Admin Override - Change to Approved'
                                      : 'Approve'
                                  }
                                >
                                  {approval.status !== 'pending' && approval.status !== 'pending_approval' ? (
                                    <ShieldCheckIcon className="h-4 w-4" />
                                  ) : (
                                    <CheckCircleIcon className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReject(approval)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title={
                                    approval.status !== 'pending' && approval.status !== 'pending_approval'
                                      ? 'Admin Override - Change to Rejected'
                                      : 'Reject'
                                  }
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "view" && "View Transaction Details"}
              {actionType === "approve" && (
                selectedApproval?.status !== 'pending' && selectedApproval?.status !== 'pending_approval'
                  ? "Override to Approved (Admin)"
                  : "Approve Transaction"
              )}
              {actionType === "reject" && (
                selectedApproval?.status !== 'pending' && selectedApproval?.status !== 'pending_approval'
                  ? "Override to Rejected (Admin)"
                  : "Reject Transaction"
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            {selectedApproval && (
              <div className="space-y-6">
                {/* Transaction Summary */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Type</p>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(selectedApproval.type)}
                          <p className="font-semibold text-gray-900">
                            {getTypeLabel(selectedApproval.type)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Reference No</p>
                        <p className="font-semibold text-gray-900">
                          {selectedApproval.referenceNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Client Name</p>
                        <p className="font-semibold text-gray-900">
                          {selectedApproval.clientName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Booking No</p>
                        <p className="font-semibold text-gray-900">
                          {selectedApproval.bookingNo || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Service Type</p>
                        <p className="font-semibold text-gray-900">
                          {selectedApproval.serviceType || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Amount</p>
                        <p className="font-semibold text-gray-900">
                          {selectedApproval.currency}{" "}
                          {selectedApproval.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Submitted By</p>
                        <p className="font-semibold text-gray-900">
                          {selectedApproval.submittedBy}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Submitted Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(
                            selectedApproval.submittedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Status</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            getStatusColor(selectedApproval.status)
                          )}
                        >
                          {selectedApproval.status === 'pending_approval' ? 'pending' : selectedApproval.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Priority</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            getPriorityColor(selectedApproval.priority)
                          )}
                        >
                          {selectedApproval.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Override Warning for Admin */}
                {actionType !== "view" && 
                 selectedApproval.status !== 'pending' && 
                 selectedApproval.status !== 'pending_approval' && (
                  <Card className="border-2 bg-amber-50 border-amber-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="h-5 w-5 mt-0.5 text-amber-700" />
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">
                            Admin Override
                          </p>
                          <p className="text-sm text-amber-800">
                            You are about to override a quotation that is currently <strong>{selectedApproval.status}</strong>.
                            This action will change the status and will be logged in the approval history with an override marker.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Detailed Transaction View */}
                {actionType === "view" && (
                  <ApprovalTransactionDetails
                    transaction={selectedApproval}
                    type={selectedApproval.type}
                  />
                )}

                {/* Action Warning */}
                {actionType !== "view" && (
                  <Card
                    className={cn(
                      "border-2",
                      actionType === "approve"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircleIcon
                          className={cn(
                            "h-5 w-5 mt-0.5",
                            actionType === "approve"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        />
                        <div>
                          <p
                            className={cn(
                              "font-semibold mb-1",
                              actionType === "approve"
                                ? "text-green-900"
                                : "text-red-900"
                            )}
                          >
                            {actionType === "approve"
                              ? "Approve Transaction"
                              : "Reject Transaction"}
                          </p>
                          <p
                            className={cn(
                              "text-sm",
                              actionType === "approve"
                                ? "text-green-700"
                                : "text-red-700"
                            )}
                          >
                            {actionType === "approve"
                              ? "By approving this transaction, you confirm that all details are correct and the transaction can proceed to the next stage."
                              : "By rejecting this transaction, you are indicating that there are issues that need to be addressed before it can be approved."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments */}
                {actionType !== "view" && (
                  <div>
                    <Label htmlFor="comments">
                      Comments / Remarks{" "}
                      {actionType === "reject" && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder={
                        actionType === "approve"
                          ? "Add any approval notes or comments (optional)..."
                          : "Please provide a reason for rejection (required)..."
                      }
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={submitting}
            >
              {actionType === "view" ? "Close" : "Cancel"}
            </Button>
            {actionType === "approve" && (
              <Button
                onClick={handleSubmitAction}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    {selectedApproval?.status !== 'pending' && selectedApproval?.status !== 'pending_approval'
                      ? 'Overriding...'
                      : 'Approving...'}
                  </>
                ) : (
                  <>
                    {selectedApproval?.status !== 'pending' && selectedApproval?.status !== 'pending_approval' ? (
                      <>
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Override to Approved
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Approve Transaction
                      </>
                    )}
                  </>
                )}
              </Button>
            )}
            {actionType === "reject" && (
              <Button
                onClick={handleSubmitAction}
                disabled={!comments.trim() || submitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    {selectedApproval?.status !== 'pending' && selectedApproval?.status !== 'pending_approval'
                      ? 'Overriding...'
                      : 'Rejecting...'}
                  </>
                ) : (
                  <>
                    {selectedApproval?.status !== 'pending' && selectedApproval?.status !== 'pending_approval' ? (
                      <>
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Override to Rejected
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        Reject Transaction
                      </>
                    )}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}