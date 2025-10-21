import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { PrinterIcon, DownloadIcon, CalendarIcon } from "lucide-react";
import { rfpData } from "@/polymet/data/logistics-data";

interface RFPSummaryReportProps {
  selectedDate?: string;
  onPrint?: () => void;
  onExport?: () => void;
}

export function RFPSummaryReport({
  selectedDate,
  onPrint,
  onExport,
}: RFPSummaryReportProps) {
  const [reportDate, setReportDate] = useState(
    selectedDate || new Date().toISOString().split("T")[0]
  );

  // Filter RFPs by selected date
  const filteredRFPs = rfpData.filter((rfp) => rfp.rfpDate === reportDate);

  // Group by category (IMPORT vs LOCAL)
  const importRFPs = filteredRFPs.filter((rfp) =>
    rfp.particulars.some((p) => p.unitPort.includes("IMPORT"))
  );
  const localRFPs = filteredRFPs.filter(
    (rfp) => !rfp.particulars.some((p) => p.unitPort.includes("IMPORT"))
  );

  const calculateCategoryTotal = (rfps: typeof filteredRFPs) => {
    return rfps.reduce((sum, rfp) => sum + rfp.totalAmount, 0);
  };

  const importTotal = calculateCategoryTotal(importRFPs);
  const localTotal = calculateCategoryTotal(localRFPs);
  const grandTotal = importTotal + localTotal;

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  const handleExport = () => {
    // Export logic here
    onExport?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Filter and Actions - Hidden on print */}
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Report Date:</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="max-w-xs"
                />

                <Button variant="outline" size="icon">
                  <CalendarIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PrinterIcon className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print-friendly Report */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="text-center border-b border-border pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SB</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-blue-900">
                SAVE AND BEST
              </h1>
              <p className="text-base text-orange-500 font-semibold">
                CARGO LOGISTICS CORPORATION
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            3rd Floor, LEODEGARIO Commercial Bldg., Brookeside Lane,
          </p>
          <p className="text-sm text-muted-foreground">
            Brgy., San Francisco Gen. Trias Cavite
          </p>
          <h2 className="text-2xl font-bold mt-4">
            DAILY BUDGET REQUESTS FOR {formatDate(reportDate)}
          </h2>
        </CardHeader>

        <CardContent className="pt-6">
          {/* IMPORT Section */}
          {importRFPs.length > 0 && (
            <div className="mb-8">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="font-bold">Payee</TableHead>
                    <TableHead className="font-bold">Acct. No.</TableHead>
                    <TableHead className="font-bold">
                      IMPORT - Particulars
                    </TableHead>
                    <TableHead className="font-bold text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importRFPs.map((rfp) =>
                    rfp.particulars.map((particular, idx) => (
                      <TableRow key={`${rfp.id}-${particular.id}`}>
                        {idx === 0 && (
                          <>
                            <TableCell
                              rowSpan={rfp.particulars.length}
                              className="align-top"
                            >
                              {rfp.pageeName}
                            </TableCell>
                            <TableCell
                              rowSpan={rfp.particulars.length}
                              className="align-top"
                            >
                              {rfp.modeOfPayment === "Cash"
                                ? "CASH"
                                : rfp.modeOfPayment}
                            </TableCell>
                          </>
                        )}
                        <TableCell>{particular.description}</TableCell>
                        {idx === 0 && (
                          <TableCell
                            rowSpan={rfp.particulars.length}
                            className="align-top text-right"
                          >
                            {particular.amount.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                  <TableRow className="bg-muted font-bold">
                    <TableCell colSpan={3} className="text-right">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-right">
                      {importTotal.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* LOCAL Section */}
          {localRFPs.length > 0 && (
            <div className="mb-8">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="font-bold">Payee</TableHead>
                    <TableHead className="font-bold">Acct. No.</TableHead>
                    <TableHead className="font-bold">
                      LOCAL - Particulars
                    </TableHead>
                    <TableHead className="font-bold text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localRFPs.map((rfp) =>
                    rfp.particulars.map((particular, idx) => (
                      <TableRow key={`${rfp.id}-${particular.id}`}>
                        {idx === 0 && (
                          <>
                            <TableCell
                              rowSpan={rfp.particulars.length}
                              className="align-top"
                            >
                              {rfp.pageeName}
                            </TableCell>
                            <TableCell
                              rowSpan={rfp.particulars.length}
                              className="align-top"
                            >
                              {rfp.modeOfPayment === "Cash"
                                ? "CASH"
                                : rfp.modeOfPayment}
                            </TableCell>
                          </>
                        )}
                        <TableCell>{particular.description}</TableCell>
                        {idx === 0 && (
                          <TableCell
                            rowSpan={rfp.particulars.length}
                            className="align-top text-right"
                          >
                            {particular.amount.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                  <TableRow className="bg-muted font-bold">
                    <TableCell colSpan={3} className="text-right">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-right">
                      {localTotal.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Grand Total */}
          <div className="border-t-2 border-border pt-4">
            <Table>
              <TableBody>
                <TableRow className="bg-muted">
                  <TableCell
                    colSpan={3}
                    className="text-right font-bold text-lg"
                  >
                    TOTAL
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    ₱{" "}
                    {grandTotal.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-border">
            <div className="text-center">
              <div className="mb-2">
                <p className="font-semibold">Checked by:</p>
              </div>
              <div className="border-b-2 border-border pb-1 mb-2 min-h-[60px]"></div>
              <p className="font-bold">Martes V. Lopez</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <p className="font-semibold">Approved by:</p>
              </div>
              <div className="border-b-2 border-border pb-1 mb-2 min-h-[60px]"></div>
              <p className="font-bold">Chris Tolentin Jr.</p>
            </div>
          </div>

          {/* No Data Message */}
          {filteredRFPs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">
                No RFP requests found for {formatDate(reportDate)}
              </p>
              <p className="text-sm mt-2">
                Please select a different date or create new RFP entries.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
