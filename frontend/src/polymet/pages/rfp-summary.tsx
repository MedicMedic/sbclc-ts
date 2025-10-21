import React from "react";
import { RFPSummaryReport } from "@/polymet/components/rfp-summary-report";

export function RFPSummaryPage() {
  const handlePrint = () => {
    console.log("Printing RFP summary report");
  };

  const handleExport = () => {
    console.log("Exporting RFP summary report");
    alert("Report exported successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">RFP Daily Summary Report</h1>
        <p className="text-muted-foreground">
          Print-only report showing all RFPs for a specific date
        </p>
      </div>

      {/* Summary Report */}
      <RFPSummaryReport onPrint={handlePrint} onExport={handleExport} />
    </div>
  );
}
