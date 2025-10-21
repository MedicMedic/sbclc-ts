import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  TruckIcon,
  FileTextIcon,
  DollarSignIcon,
} from "lucide-react";

interface DomesticStatusIndicatorsProps {
  record: any;
  className?: string;
}

export function DomesticStatusIndicators({
  record,
  className = "",
}: DomesticStatusIndicatorsProps) {
  // Determine the status of each key milestone
  const isDelivered = !!(
    record.dateReceived ||
    record.deliverToWarehouse ||
    record.actualTimeArrival
  );

  const isChopsigned = !!(
    record.chopsignStatus === "completed" ||
    record.chopsingStatus === "completed" ||
    record.podDate
  );

  const isBilled = !!(
    record.billed ||
    record.billingsStatus === "completed" ||
    record.billingStatus === "completed"
  );

  // Determine if ready for billing (delivered and chopsigned but not billed)
  const isReadyForBilling = isDelivered && isChopsigned && !isBilled;

  // Get overall status priority
  const getOverallStatus = () => {
    if (isBilled) {
      return {
        status: "completed",
        priority: "low",
        color: "bg-green-100 text-green-800",
        label: "✅ COMPLETED",
        description: "All processes completed",
      };
    }

    if (isReadyForBilling) {
      return {
        status: "ready_billing",
        priority: "high",
        color: "bg-blue-100 text-blue-800",
        label: "💰 READY FOR BILLING",
        description: "Delivered & Chopsigned - Ready to bill",
      };
    }

    if (isDelivered && isChopsigned) {
      return {
        status: "processing",
        priority: "medium",
        color: "bg-yellow-100 text-yellow-800",
        label: "⏳ PROCESSING",
        description: "Delivered & Chopsigned - Processing billing",
      };
    }

    if (isDelivered) {
      return {
        status: "delivered",
        priority: "medium",
        color: "bg-orange-100 text-orange-800",
        label: "📦 DELIVERED",
        description: "Delivered - Awaiting chopsign",
      };
    }

    return {
      status: "in_transit",
      priority: "low",
      color: "bg-gray-100 text-gray-800",
      label: "🚛 IN TRANSIT",
      description: "In transit to destination",
    };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Overall Status Badge */}
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium text-center ${overallStatus.color}`}
        title={overallStatus.description}
      >
        {overallStatus.label}
      </div>

      {/* Individual Status Indicators */}
      <div className="flex flex-wrap gap-1">
        {/* Delivery Status */}
        <Badge
          variant={isDelivered ? "default" : "secondary"}
          className={`text-xs ${
            isDelivered
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-300 text-gray-600"
          }`}
          title={isDelivered ? "Delivered successfully" : "Not delivered yet"}
        >
          <TruckIcon className="h-3 w-3 mr-1" />

          {isDelivered ? "Delivered" : "Pending"}
        </Badge>

        {/* Chopsign Status */}
        <Badge
          variant={isChopsigned ? "default" : "secondary"}
          className={`text-xs ${
            isChopsigned
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 text-gray-600"
          }`}
          title={isChopsigned ? "Chopsign completed" : "Chopsign pending"}
        >
          <FileTextIcon className="h-3 w-3 mr-1" />

          {isChopsigned ? "Chopsigned" : "Pending"}
        </Badge>

        {/* Billing Status */}
        <Badge
          variant={isBilled ? "default" : "secondary"}
          className={`text-xs ${
            isBilled
              ? "bg-purple-600 hover:bg-purple-700"
              : isReadyForBilling
                ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                : "bg-gray-300 text-gray-600"
          }`}
          title={
            isBilled
              ? "Billing completed"
              : isReadyForBilling
                ? "Ready for billing"
                : "Billing pending"
          }
        >
          <DollarSignIcon className="h-3 w-3 mr-1" />

          {isBilled ? "Billed" : isReadyForBilling ? "Ready" : "Pending"}
        </Badge>
      </div>

      {/* Priority Indicator */}
      {overallStatus.priority === "high" && (
        <div className="text-xs text-center font-medium text-blue-700">
          ACTION REQUIRED
        </div>
      )}
    </div>
  );
}
