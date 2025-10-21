import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  TruckIcon,
  ShipIcon,
  PackageIcon,
  FileTextIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
} from "lucide-react";

interface StatusMilestone {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "delayed" | "skipped";
  expectedDate?: string;
  actualDate?: string;
  duration?: number;
  dependencies?: string[];
  alerts?: StatusAlert[];
}

interface StatusAlert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface DetailedStatusTrackerProps {
  bookingId: string;
  type: "import" | "domestic";
  currentStatus: string;
  milestones?: StatusMilestone[];
  onStatusUpdate?: (milestone: string, status: any) => void;
  className?: string;
}

export function DetailedStatusTracker({
  bookingId,
  type,
  currentStatus,
  milestones: propMilestones,
  onStatusUpdate,
  className = "",
}: DetailedStatusTrackerProps) {
  const [selectedMilestone, setSelectedMilestone] =
    useState<StatusMilestone | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  // Default milestones based on type
  const defaultImportMilestones: StatusMilestone[] = [
    {
      id: "booking_created",
      name: "Booking Created",
      description: "Initial booking and documentation setup",
      status: "completed",
      actualDate: "2024-01-15",
      duration: 1,
    },
    {
      id: "vessel_departure",
      name: "Vessel Departure",
      description: "Cargo loaded and vessel departed from origin port",
      status: "completed",
      actualDate: "2024-01-16",
      duration: 1,
    },
    {
      id: "in_transit",
      name: "In Transit",
      description: "Cargo in transit to destination port",
      status: "completed",
      actualDate: "2024-01-17",
      duration: 14,
    },
    {
      id: "vessel_arrival",
      name: "Vessel Arrival (ETA/ATA)",
      description: "Vessel arrived at destination port",
      status: "completed",
      expectedDate: "2024-01-20",
      actualDate: "2024-01-20",
      duration: 1,
    },
    {
      id: "storage_start",
      name: "Storage Start",
      description: "Container moved to port storage area",
      status: "completed",
      actualDate: "2024-01-21",
      duration: 1,
    },
    {
      id: "demurrage_start",
      name: "Demurrage Start",
      description: "Free time expired, demurrage charges begin",
      status: "in_progress",
      expectedDate: "2024-01-24",
      duration: 1,
      alerts: [
        {
          id: "alert_001",
          type: "warning",
          message:
            "Demurrage will start in 2 days. Expedite customs clearance.",
          timestamp: "2024-01-22 10:30",
          acknowledged: false,
        },
      ],
    },
    {
      id: "docs_received",
      name: "Original Documents Received",
      description: "All required shipping documents received",
      status: "in_progress",
      expectedDate: "2024-01-22",
      duration: 1,
    },
    {
      id: "boc_entry",
      name: "BOC Entry Filed",
      description: "Customs entry filed with Bureau of Customs",
      status: "pending",
      expectedDate: "2024-01-23",
      duration: 1,
      dependencies: ["docs_received"],
    },
    {
      id: "assessment",
      name: "Customs Assessment",
      description: "Customs duties and taxes assessed",
      status: "pending",
      expectedDate: "2024-01-24",
      duration: 2,
      dependencies: ["boc_entry"],
    },
    {
      id: "do_released",
      name: "Delivery Order Released",
      description: "DO issued by shipping line for cargo release",
      status: "pending",
      expectedDate: "2024-01-25",
      duration: 1,
      dependencies: ["assessment"],
    },
    {
      id: "pullout_port",
      name: "Pullout from Port",
      description: "Container pulled out from port terminal",
      status: "pending",
      expectedDate: "2024-01-26",
      duration: 1,
      dependencies: ["do_released"],
    },
    {
      id: "deliver_warehouse",
      name: "Deliver to Warehouse",
      description: "Container delivered to consignee warehouse",
      status: "pending",
      expectedDate: "2024-01-27",
      duration: 1,
      dependencies: ["pullout_port"],
    },
    {
      id: "unloading",
      name: "Unloading",
      description: "Cargo unloaded at destination",
      status: "pending",
      expectedDate: "2024-01-28",
      duration: 1,
      dependencies: ["deliver_warehouse"],
    },
    {
      id: "empty_pullout",
      name: "Empty Container Pullout",
      description: "Empty container returned to depot",
      status: "pending",
      expectedDate: "2024-01-29",
      duration: 1,
      dependencies: ["unloading"],
    },
    {
      id: "billed",
      name: "Billing Completed",
      description: "Final billing and invoicing completed",
      status: "pending",
      expectedDate: "2024-01-30",
      duration: 1,
      dependencies: ["empty_pullout"],
    },
  ];

  const defaultDomesticMilestones: StatusMilestone[] = [
    {
      id: "booking_created",
      name: "Booking Created",
      description: "Domestic booking and route planning completed",
      status: "completed",
      actualDate: "2024-01-20",
      duration: 1,
    },
    {
      id: "dispatched",
      name: "Dispatched",
      description: "Vehicle dispatched for pickup",
      status: "completed",
      actualDate: "2024-01-20",
      duration: 1,
    },
    {
      id: "pickup",
      name: "Pickup Completed",
      description: "Cargo picked up from origin",
      status: "completed",
      actualDate: "2024-01-20",
      duration: 2,
    },
    {
      id: "in_transit",
      name: "In Transit",
      description: "Cargo in transit to destination",
      status: "in_progress",
      expectedDate: "2024-01-22",
      duration: 2,
    },
    {
      id: "delivery",
      name: "Delivery",
      description: "Cargo delivered to consignee",
      status: "pending",
      expectedDate: "2024-01-22",
      duration: 1,
      dependencies: ["in_transit"],
    },
    {
      id: "pod_received",
      name: "POD Received",
      description: "Proof of delivery received and verified",
      status: "pending",
      expectedDate: "2024-01-23",
      duration: 1,
      dependencies: ["delivery"],
    },
    {
      id: "billed",
      name: "Billing Completed",
      description: "Final billing and invoicing completed",
      status: "pending",
      expectedDate: "2024-01-25",
      duration: 1,
      dependencies: ["pod_received"],
    },
  ];

  const milestones =
    propMilestones ||
    (type === "import" ? defaultImportMilestones : defaultDomesticMilestones);

  const getStatusIcon = (status: StatusMilestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;

      case "in_progress":
        return <ClockIcon className="h-5 w-5 text-blue-600 animate-pulse" />;

      case "delayed":
        return <AlertTriangleIcon className="h-5 w-5 text-red-600" />;

      case "skipped":
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;

      default:
        return <div className="h-5 w-5 rounded-full bg-gray-200" />;
    }
  };

  const getStatusColor = (status: StatusMilestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "delayed":
        return "bg-red-500";
      case "skipped":
        return "bg-gray-300";
      default:
        return "bg-gray-200";
    }
  };

  const getMilestoneIcon = (milestoneId: string) => {
    if (milestoneId.includes("vessel") || milestoneId.includes("ship")) {
      return <ShipIcon className="h-4 w-4" />;
    }
    if (
      milestoneId.includes("truck") ||
      milestoneId.includes("dispatch") ||
      milestoneId.includes("delivery")
    ) {
      return <TruckIcon className="h-4 w-4" />;
    }
    if (
      milestoneId.includes("docs") ||
      milestoneId.includes("boc") ||
      milestoneId.includes("entry")
    ) {
      return <FileTextIcon className="h-4 w-4" />;
    }
    if (milestoneId.includes("warehouse") || milestoneId.includes("port")) {
      return <MapPinIcon className="h-4 w-4" />;
    }
    return <PackageIcon className="h-4 w-4" />;
  };

  const calculateProgress = () => {
    const completedCount = milestones.filter(
      (m) => m.status === "completed"
    ).length;
    return (completedCount / milestones.length) * 100;
  };

  const getAllAlerts = () => {
    return milestones
      .flatMap((m) => m.alerts || [])
      .filter((alert) => !alert.acknowledged);
  };

  const acknowledgeAlert = (alertId: string) => {
    // In a real app, this would update the alert status
    console.log("Acknowledging alert:", alertId);
  };

  const updateMilestoneStatus = (
    milestoneId: string,
    newStatus: StatusMilestone["status"]
  ) => {
    onStatusUpdate?.(milestoneId, {
      status: newStatus,
      timestamp: new Date().toISOString(),
    });
  };

  const progress = calculateProgress();
  const alerts = getAllAlerts();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <PackageIcon className="h-5 w-5" />

              <span>Status Tracking - {bookingId}</span>
            </CardTitle>
            {alerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAlerts(true)}
                className="relative"
              >
                <BellIcon className="h-4 w-4 mr-2" />
                Alerts
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {alerts.length}
                </Badge>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="w-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>
                  Completed:{" "}
                  {milestones.filter((m) => m.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>
                  In Progress:{" "}
                  {milestones.filter((m) => m.status === "in_progress").length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span>
                  Pending:{" "}
                  {milestones.filter((m) => m.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>
                  Delayed:{" "}
                  {milestones.filter((m) => m.status === "delayed").length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start space-x-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  {getStatusIcon(milestone.status)}
                  {index < milestones.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-2 ${getStatusColor(milestone.status)}`}
                    ></div>
                  )}
                </div>

                {/* Milestone Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getMilestoneIcon(milestone.id)}
                      <h4 className="font-medium">{milestone.name}</h4>
                      <Badge
                        variant={
                          milestone.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {milestone.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMilestone(milestone)}
                        >
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{milestone.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            {milestone.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">
                                Status
                              </Label>
                              <div className="flex items-center space-x-2 mt-1">
                                {getStatusIcon(milestone.status)}
                                <span className="capitalize">
                                  {milestone.status.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Duration
                              </Label>
                              <p className="mt-1">
                                {milestone.duration} day(s)
                              </p>
                            </div>
                            {milestone.expectedDate && (
                              <div>
                                <Label className="text-sm font-medium">
                                  Expected Date
                                </Label>
                                <p className="mt-1">{milestone.expectedDate}</p>
                              </div>
                            )}
                            {milestone.actualDate && (
                              <div>
                                <Label className="text-sm font-medium">
                                  Actual Date
                                </Label>
                                <p className="mt-1">{milestone.actualDate}</p>
                              </div>
                            )}
                          </div>

                          {milestone.dependencies &&
                            milestone.dependencies.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium">
                                  Dependencies
                                </Label>
                                <div className="mt-1 space-y-1">
                                  {milestone.dependencies.map((dep) => {
                                    const depMilestone = milestones.find(
                                      (m) => m.id === dep
                                    );
                                    return (
                                      <div
                                        key={dep}
                                        className="flex items-center space-x-2"
                                      >
                                        {depMilestone &&
                                          getStatusIcon(depMilestone.status)}
                                        <span className="text-sm">
                                          {depMilestone?.name || dep}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          {milestone.alerts && milestone.alerts.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">
                                Alerts
                              </Label>
                              <div className="mt-1 space-y-2">
                                {milestone.alerts.map((alert) => (
                                  <div
                                    key={alert.id}
                                    className="flex items-start space-x-2 p-2 border rounded"
                                  >
                                    <AlertTriangleIcon className="h-4 w-4 text-orange-500 mt-0.5" />

                                    <div className="flex-1">
                                      <p className="text-sm">{alert.message}</p>
                                      <p className="text-xs text-gray-500">
                                        {alert.timestamp}
                                      </p>
                                    </div>
                                    {!alert.acknowledged && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          acknowledgeAlert(alert.id)
                                        }
                                      >
                                        Acknowledge
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-4 border-t">
                            <Button
                              size="sm"
                              onClick={() =>
                                updateMilestoneStatus(milestone.id, "completed")
                              }
                              disabled={milestone.status === "completed"}
                            >
                              Mark Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateMilestoneStatus(milestone.id, "delayed")
                              }
                              disabled={milestone.status === "completed"}
                            >
                              Mark Delayed
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {milestone.description}
                  </p>

                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {milestone.expectedDate && (
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-3 w-3" />

                        <span>Expected: {milestone.expectedDate}</span>
                      </div>
                    )}
                    {milestone.actualDate && (
                      <div className="flex items-center space-x-1">
                        <CheckCircleIcon className="h-3 w-3" />

                        <span>Actual: {milestone.actualDate}</span>
                      </div>
                    )}
                    {milestone.alerts && milestone.alerts.length > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <BellIcon className="h-3 w-3" />

                        <span>{milestone.alerts.length} alert(s)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts Dialog */}
      <Dialog open={showAlerts} onOpenChange={setShowAlerts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Active Alerts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-gray-600">No active alerts.</p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <AlertTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />

                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.timestamp}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
