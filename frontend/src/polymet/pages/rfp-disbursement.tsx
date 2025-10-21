import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BanknoteIcon,
  CheckCircle2Icon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  EyeIcon,
} from "lucide-react";
import { rfpData } from "@/polymet/data/logistics-data";
import { RFPDisbursementDialog } from "@/polymet/components/rfp-disbursement-dialog";

export function RFPDisbursementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRFP, setSelectedRFP] = useState<any>(null);
  const [isDisbursementDialogOpen, setIsDisbursementDialogOpen] =
    useState(false);
  const [disbursedRFPs, setDisbursedRFPs] = useState<Set<string>>(new Set());

  // Filter RFPs
  const filteredRFPs = rfpData.filter((rfp) => {
    const matchesSearch =
      rfp.rfpNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.pageeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" &&
        rfp.status === "approved" &&
        !disbursedRFPs.has(rfp.id)) ||
      (statusFilter === "disbursed" && disbursedRFPs.has(rfp.id));

    const matchesDate = !dateFilter || rfp.rfpDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

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
  };

  const isRFPDisbursed = (rfpId: string) => {
    return disbursedRFPs.has(rfpId);
  };

  const stats = {
    total: rfpData.filter((r) => r.status === "approved").length,
    pending: rfpData.filter(
      (r) => r.status === "approved" && !disbursedRFPs.has(r.id)
    ).length,
    disbursed: disbursedRFPs.size,
    totalAmount: rfpData
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + r.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">RFP Disbursement</h1>
        <p className="text-muted-foreground">
          Process and manage approved RFP disbursements
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved RFPs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CheckCircle2Icon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Disbursement
                </p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <BanknoteIcon className="w-8 h-8 text-yellow-600" />
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
              <CheckCircle2Icon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold">
                  ₱
                  {stats.totalAmount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <BanknoteIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label>Search RFP</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  placeholder="Search by RFP No. or Payee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Pending Disbursement</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date Filter</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />

                {dateFilter && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDateFilter("")}
                  >
                    <FilterIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFP Disbursement Table */}
      <Card>
        <CardHeader>
          <CardTitle>RFP Disbursement Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFP No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFPs.map((rfp) => {
                const isImport = rfp.particulars.some((p: any) =>
                  p.unitPort.includes("IMPORT")
                );
                const isDisbursed = isRFPDisbursed(rfp.id);
                const canDisburse = rfp.status === "approved" && !isDisbursed;

                return (
                  <TableRow key={rfp.id}>
                    <TableCell className="font-medium">{rfp.rfpNo}</TableCell>
                    <TableCell>
                      {new Date(rfp.rfpDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{rfp.pageeName}</TableCell>
                    <TableCell>
                      <Badge variant={isImport ? "default" : "secondary"}>
                        {isImport ? "IMPORT" : "LOCAL"}
                      </Badge>
                    </TableCell>
                    <TableCell>{rfp.modeOfPayment}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₱{" "}
                      {rfp.totalAmount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {isDisbursed ? (
                        <Badge className="bg-green-600">
                          <CheckCircle2Icon className="w-3 h-3 mr-1" />
                          Disbursed
                        </Badge>
                      ) : rfp.status === "approved" ? (
                        <Badge className="bg-blue-600">Approved</Badge>
                      ) : (
                        <Badge variant="secondary">{rfp.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {canDisburse && (
                          <Button
                            size="sm"
                            onClick={() => handleDisburse(rfp)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <BanknoteIcon className="w-4 h-4 mr-1" />
                            Disburse
                          </Button>
                        )}
                        {isDisbursed && (
                          <Badge className="bg-green-600">
                            <CheckCircle2Icon className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {!canDisburse && !isDisbursed && (
                          <Button size="sm" variant="outline" disabled>
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredRFPs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BanknoteIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />

              <p className="text-lg">No RFPs found</p>
              <p className="text-sm mt-2">
                {searchQuery || statusFilter !== "all" || dateFilter
                  ? "Try adjusting your filters"
                  : "No approved RFPs available for disbursement"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
