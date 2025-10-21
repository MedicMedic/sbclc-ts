import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusIcon,
  SearchIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  EditIcon,
  BanknoteIcon,
} from "lucide-react";
import { RFPEntryForm } from "@/polymet/components/rfp-entry-form";
import { RFPDisbursementDialog } from "@/polymet/components/rfp-disbursement-dialog";
import { rfpData } from "@/polymet/data/logistics-data";

export function RFPEntryPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRFP, setSelectedRFP] = useState<any>(null);
  const [isDisbursementDialogOpen, setIsDisbursementDialogOpen] =
    useState(false);
  const [disbursedRFPs, setDisbursedRFPs] = useState<Set<string>>(new Set());

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: any; icon: any }
    > = {
      draft: { label: "Draft", variant: "secondary", icon: FileTextIcon },
      pending: { label: "Pending", variant: "default", icon: ClockIcon },
      reviewed: {
        label: "Reviewed",
        variant: "default",
        icon: CheckCircleIcon,
      },
      approved: {
        label: "Approved",
        variant: "default",
        icon: CheckCircleIcon,
      },
      rejected: {
        label: "Rejected",
        variant: "destructive",
        icon: XCircleIcon,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />

        {config.label}
      </Badge>
    );
  };

  const filteredRFPs = rfpData.filter(
    (rfp) =>
      rfp.rfpNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.pageeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.requestingUnit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedRFP(null);
    setActiveTab("form");
  };

  const handleEdit = (rfp: any) => {
    setSelectedRFP(rfp);
    setActiveTab("form");
  };

  const handleView = (rfp: any) => {
    setSelectedRFP(rfp);
    setActiveTab("view");
  };

  const handleSubmit = (data: any) => {
    console.log("RFP submitted:", data);
    alert("RFP submitted for approval successfully!");
    setActiveTab("list");
    setSelectedRFP(null);
  };

  const handleSave = (data: any) => {
    console.log("RFP saved:", data);
    alert("RFP saved as draft successfully!");
    setActiveTab("list");
    setSelectedRFP(null);
  };

  const handlePrint = (data: any) => {
    console.log("RFP print:", data);
    window.print();
  };

  const handleDisburse = (rfp: any) => {
    setSelectedRFP(rfp);
    setIsDisbursementDialogOpen(true);
  };

  const handleDisbursementComplete = (data: any) => {
    console.log("Disbursement completed:", data);
    setDisbursedRFPs((prev) => new Set(prev).add(data.rfpId));
    alert(
      `Disbursement Successful!\n\nRFP: ${data.rfpNo}\nPayee: ${data.payeeName}\nNet Amount: ₱${data.netAmount.toLocaleString()}\nPayment Method: ${data.paymentMethod}`
    );
    setIsDisbursementDialogOpen(false);
    setSelectedRFP(null);
  };

  const isRFPDisbursed = (rfpId: string) => {
    return disbursedRFPs.has(rfpId);
  };

  const stats = {
    total: rfpData.length,
    pending: rfpData.filter((r) => r.status === "pending").length,
    approved: rfpData.filter((r) => r.status === "approved").length,
    draft: rfpData.filter((r) => r.status === "draft").length,
    disbursed: disbursedRFPs.size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Request for Payment (RFP)</h1>
          <p className="text-muted-foreground">
            Create and manage payment requests
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New RFP
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total RFPs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileTextIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
              <FileTextIcon className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disbursed</p>
                <p className="text-2xl font-bold">{stats.disbursed}</p>
              </div>
              <BanknoteIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">RFP List</TabsTrigger>
          <TabsTrigger value="form">
            {selectedRFP ? "Edit RFP" : "New RFP"}
          </TabsTrigger>
          {selectedRFP && <TabsTrigger value="view">View Details</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All RFP Entries</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                      placeholder="Search RFPs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[300px]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFP No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead>Requesting Unit</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prepared By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRFPs.map((rfp) => (
                    <TableRow key={rfp.id}>
                      <TableCell className="font-medium">{rfp.rfpNo}</TableCell>
                      <TableCell>
                        {new Date(rfp.rfpDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{rfp.pageeName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {rfp.requestingUnit}
                      </TableCell>
                      <TableCell>
                        ₱
                        {rfp.rfpAmount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(rfp.status)}</TableCell>
                      <TableCell>{rfp.preparedBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(rfp)}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          {rfp.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(rfp)}
                            >
                              <EditIcon className="w-4 h-4" />
                            </Button>
                          )}
                          {rfp.status === "approved" &&
                            !isRFPDisbursed(rfp.id) && (
                              <Button
                                size="sm"
                                onClick={() => handleDisburse(rfp)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <BanknoteIcon className="w-4 h-4 mr-1" />
                                Disburse
                              </Button>
                            )}
                          {isRFPDisbursed(rfp.id) && (
                            <Badge className="bg-green-600">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Disbursed
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRFPs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />

                  <p className="text-lg">No RFP entries found</p>
                  <p className="text-sm mt-2">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Create your first RFP entry to get started"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <RFPEntryForm
            onSubmit={handleSubmit}
            onSave={handleSave}
            onPrint={handlePrint}
            initialData={selectedRFP}
          />
        </TabsContent>

        <TabsContent value="view" className="mt-6">
          {selectedRFP && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>RFP Details - {selectedRFP.rfpNo}</CardTitle>
                  {getStatusBadge(selectedRFP.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Header Information */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Payee Name
                      </Label>
                      <p className="font-medium">{selectedRFP.pageeName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        RFP Date
                      </Label>
                      <p className="font-medium">
                        {new Date(selectedRFP.rfpDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Requesting Unit
                      </Label>
                      <p className="font-medium">
                        {selectedRFP.requestingUnit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Mode of Payment
                      </Label>
                      <p className="font-medium">{selectedRFP.modeOfPayment}</p>
                    </div>
                  </div>

                  {/* Particulars */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Particulars
                    </Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Charging</TableHead>
                          <TableHead>Invoice/IFD No.</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRFP.particulars.map((particular: any) => (
                          <TableRow key={particular.id}>
                            <TableCell>{particular.charging}</TableCell>
                            <TableCell>{particular.invoiceNo}</TableCell>
                            <TableCell>{particular.description}</TableCell>
                            <TableCell className="text-right">
                              ₱
                              {particular.amount.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold bg-muted">
                          <TableCell colSpan={3} className="text-right">
                            Total
                          </TableCell>
                          <TableCell className="text-right">
                            ₱
                            {selectedRFP.totalAmount.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Approval Information */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Prepared By
                      </Label>
                      <p className="font-medium">{selectedRFP.preparedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Reviewed By
                      </Label>
                      <p className="font-medium">
                        {selectedRFP.reviewedBy || "Pending"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Approved By
                      </Label>
                      <p className="font-medium">
                        {selectedRFP.approvedBy || "Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Approval History */}
                  {selectedRFP.approvalHistory &&
                    selectedRFP.approvalHistory.length > 0 && (
                      <div className="pt-6 border-t border-border">
                        <Label className="text-sm text-muted-foreground mb-2 block">
                          Approval History
                        </Label>
                        <div className="space-y-2">
                          {selectedRFP.approvalHistory.map(
                            (history: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                              >
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />

                                <div className="flex-1">
                                  <p className="font-medium">
                                    {history.approver}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {history.action} on{" "}
                                    {new Date(history.date).toLocaleString()}
                                  </p>
                                  {history.comments && (
                                    <p className="text-sm mt-1">
                                      {history.comments}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Disbursement Dialog */}
      <RFPDisbursementDialog
        rfp={selectedRFP}
        isOpen={isDisbursementDialogOpen}
        onClose={() => {
          setIsDisbursementDialogOpen(false);
          setSelectedRFP(null);
        }}
        onDisburse={handleDisbursementComplete}
      />
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}
