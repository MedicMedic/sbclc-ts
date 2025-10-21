import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageIcon, TruckIcon } from "lucide-react";

interface Container {
  id: string;
  containerNumber: string;
  containerSize: string;
  sku: string;
  quantity: number;
  status:
    | "pending"
    | "in_transit"
    | "arrived"
    | "customs_clearance"
    | "released"
    | "delivered";
  remarks?: string;
}

interface ContainerSummaryProps {
  containers: Container[];
  className?: string;
}

const containerStatuses = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
  {
    value: "in_transit",
    label: "In Transit",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "arrived", label: "Arrived", color: "bg-green-100 text-green-800" },
  {
    value: "customs_clearance",
    label: "Customs Clearance",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "released",
    label: "Released",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
  },
];

export function ContainerSummary({
  containers,
  className = "",
}: ContainerSummaryProps) {
  const getStatusBadge = (status: Container["status"]) => {
    const statusConfig = containerStatuses.find((s) => s.value === status);
    return (
      <Badge
        variant="secondary"
        className={`${statusConfig?.color || "bg-gray-100 text-gray-800"} text-xs`}
      >
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const totalQuantity = containers.reduce(
    (sum, container) => sum + container.quantity,
    0
  );
  const statusCounts = containers.reduce(
    (acc, container) => {
      acc[container.status] = (acc[container.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (containers.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <PackageIcon className="h-4 w-4" />
            Container Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No containers added</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <PackageIcon className="h-4 w-4" />
          Container Summary
        </CardTitle>
        <CardDescription className="text-xs">
          {containers.length} container{containers.length !== 1 ? "s" : ""} •
          Total Qty: {totalQuantity}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Overview */}
        <div className="flex flex-wrap gap-1">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              {getStatusBadge(status as Container["status"])}
              <span className="text-xs text-muted-foreground">({count})</span>
            </div>
          ))}
        </div>

        {/* Container List */}
        <div className="space-y-2">
          {containers.slice(0, 3).map((container) => (
            <div
              key={container.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <TruckIcon className="h-3 w-3 flex-shrink-0" />

                <span className="font-mono truncate">
                  {container.containerNumber}
                </span>
                <span className="text-muted-foreground">
                  ({container.containerSize})
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-muted-foreground">
                  {container.sku} × {container.quantity}
                </span>
                {getStatusBadge(container.status)}
              </div>
            </div>
          ))}

          {containers.length > 3 && (
            <div className="text-xs text-muted-foreground text-center py-1">
              +{containers.length - 3} more container
              {containers.length - 3 !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
