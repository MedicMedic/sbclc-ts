import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  HelpCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  TrendingUpIcon,
  BookOpenIcon,
  ZapIcon,
  TargetIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  ArrowRightIcon,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedTime: string;
  dependencies?: string[];
  tips?: string[];
}

interface MonitoringWorkflowAssistantProps {
  type: "import" | "domestic";
  selectedBookings?: string[];
  onActionSuggestion?: (action: string, data: any) => void;
  className?: string;
}

export function MonitoringWorkflowAssistant({
  type,
  selectedBookings = [],
  onActionSuggestion,
  className = "",
}: MonitoringWorkflowAssistantProps) {
  const [activeTab, setActiveTab] = useState("workflow");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Workflow steps based on type
  const importWorkflowSteps: WorkflowStep[] = [
    {
      id: "vessel_arrival",
      title: "Vessel Arrival Confirmation",
      description: "Confirm vessel arrival and container discharge",
      status: "completed",
      priority: "high",
      estimatedTime: "2-4 hours",
      tips: [
        "Check shipping line website for real-time updates",
        "Coordinate with port operations for discharge schedule",
        "Prepare customs documentation in advance",
      ],
    },
    {
      id: "customs_clearance",
      title: "Customs Clearance Process",
      description: "Submit documents and process customs clearance",
      status: "in_progress",
      priority: "urgent",
      estimatedTime: "1-3 days",
      dependencies: ["vessel_arrival"],
      tips: [
        "Ensure all documents are complete before submission",
        "Monitor for any examination requirements",
        "Prepare for potential duty assessments",
      ],
    },
    {
      id: "container_release",
      title: "Container Release & Delivery",
      description: "Release containers and arrange delivery",
      status: "pending",
      priority: "high",
      estimatedTime: "4-8 hours",
      dependencies: ["customs_clearance"],
      tips: [
        "Coordinate with trucking company for pickup",
        "Verify delivery address and contact details",
        "Prepare delivery receipts and POD forms",
      ],
    },
    {
      id: "documentation",
      title: "Final Documentation",
      description: "Complete all documentation and billing",
      status: "pending",
      priority: "medium",
      estimatedTime: "2-4 hours",
      dependencies: ["container_release"],
      tips: [
        "Collect all original documents",
        "Prepare final billing statement",
        "Archive documents for future reference",
      ],
    },
  ];

  const domesticWorkflowSteps: WorkflowStep[] = [
    {
      id: "booking_confirmation",
      title: "Booking Confirmation",
      description: "Confirm booking details and schedule",
      status: "completed",
      priority: "high",
      estimatedTime: "30 minutes",
      tips: [
        "Verify pickup and delivery addresses",
        "Confirm cargo details and special requirements",
        "Schedule appropriate vehicle type",
      ],
    },
    {
      id: "dispatch_coordination",
      title: "Dispatch Coordination",
      description: "Coordinate with driver and schedule pickup",
      status: "in_progress",
      priority: "high",
      estimatedTime: "1-2 hours",
      dependencies: ["booking_confirmation"],
      tips: [
        "Brief driver on cargo handling requirements",
        "Provide contact details for pickup/delivery",
        "Ensure proper documentation is prepared",
      ],
    },
    {
      id: "transit_monitoring",
      title: "Transit Monitoring",
      description: "Monitor shipment progress and updates",
      status: "pending",
      priority: "medium",
      estimatedTime: "Ongoing",
      dependencies: ["dispatch_coordination"],
      tips: [
        "Maintain regular contact with driver",
        "Monitor GPS tracking if available",
        "Be prepared for route changes or delays",
      ],
    },
    {
      id: "delivery_completion",
      title: "Delivery Completion",
      description: "Confirm delivery and collect POD",
      status: "pending",
      priority: "high",
      estimatedTime: "30 minutes",
      dependencies: ["transit_monitoring"],
      tips: [
        "Verify cargo condition upon delivery",
        "Collect signed proof of delivery",
        "Update system with delivery confirmation",
      ],
    },
  ];

  const currentSteps =
    type === "import" ? importWorkflowSteps : domesticWorkflowSteps;

  // Performance metrics
  const performanceMetrics = {
    import: {
      avgProcessingTime: "3.2 days",
      onTimeDelivery: "94%",
      customsClearanceRate: "98%",
      customerSatisfaction: "4.7/5",
    },
    domestic: {
      avgProcessingTime: "1.8 days",
      onTimeDelivery: "96%",
      deliveryAccuracy: "99%",
      customerSatisfaction: "4.8/5",
    },
  };

  const currentMetrics = performanceMetrics[type];

  // Best practices
  const bestPractices = {
    import: [
      {
        title: "Document Preparation",
        description: "Prepare all customs documents before vessel arrival",
        impact: "Reduces clearance time by 40%",
      },
      {
        title: "Proactive Communication",
        description: "Maintain regular contact with all stakeholders",
        impact: "Improves customer satisfaction by 25%",
      },
      {
        title: "Real-time Tracking",
        description: "Use tracking systems for container monitoring",
        impact: "Reduces delays by 30%",
      },
    ],

    domestic: [
      {
        title: "Route Optimization",
        description: "Plan efficient routes to minimize transit time",
        impact: "Reduces delivery time by 20%",
      },
      {
        title: "Driver Communication",
        description: "Maintain regular contact with drivers",
        impact: "Improves delivery accuracy by 15%",
      },
      {
        title: "Preventive Maintenance",
        description: "Regular vehicle maintenance prevents breakdowns",
        impact: "Reduces delays by 35%",
      },
    ],
  };

  const currentBestPractices = bestPractices[type];

  // Quick actions based on context
  const getQuickActions = () => {
    const actions = [];

    if (selectedBookings.length > 0) {
      actions.push({
        title: "Bulk Status Update",
        description: `Update status for ${selectedBookings.length} selected bookings`,
        action: "bulk_update",
        icon: ZapIcon,
      });
    }

    if (type === "import") {
      actions.push(
        {
          title: "Check Vessel Schedule",
          description: "View latest vessel arrival information",
          action: "vessel_schedule",
          icon: CalendarIcon,
        },
        {
          title: "Customs Status Check",
          description: "Check customs clearance status",
          action: "customs_check",
          icon: FileTextIcon,
        }
      );
    } else {
      actions.push(
        {
          title: "Driver Assignment",
          description: "Assign drivers to pending bookings",
          action: "driver_assignment",
          icon: UsersIcon,
        },
        {
          title: "Route Optimization",
          description: "Optimize delivery routes",
          action: "route_optimization",
          icon: TargetIcon,
        }
      );
    }

    return actions;
  };

  const quickActions = getQuickActions();

  const getStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;

      case "in_progress":
        return <ClockIcon className="h-5 w-5 text-blue-600" />;

      case "blocked":
        return <AlertTriangleIcon className="h-5 w-5 text-red-600" />;

      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getPriorityColor = (priority: WorkflowStep["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateProgress = () => {
    const completedSteps = currentSteps.filter(
      (step) => step.status === "completed"
    ).length;
    return (completedSteps / currentSteps.length) * 100;
  };

  const handleActionClick = (action: string) => {
    onActionSuggestion?.(action, { type, selectedBookings });
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5" />
          {type === "import" ? "Import" : "Domestic"} Workflow Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="practices">Best Practices</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Process Progress</h3>
                <Badge variant="outline">
                  {Math.round(calculateProgress())}% Complete
                </Badge>
              </div>

              <Progress value={calculateProgress()} className="w-full" />

              <div className="space-y-3">
                {currentSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setExpandedStep(expandedStep === step.id ? null : step.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(step.status)}
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(step.priority)}>
                          {step.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {step.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {expandedStep === step.id && step.tips && (
                      <div className="mt-3 pt-3 border-t">
                        <h5 className="font-medium text-sm mb-2">
                          💡 Tips & Best Practices:
                        </h5>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <ArrowRightIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />

                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="h-4 w-4 text-blue-600" />

                    <span className="text-sm font-medium">
                      Avg Processing Time
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {currentMetrics.avgProcessingTime}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />

                    <span className="text-sm font-medium">
                      On-Time Delivery
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentMetrics.onTimeDelivery}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUpIcon className="h-4 w-4 text-purple-600" />

                    <span className="text-sm font-medium">
                      {type === "import"
                        ? "Clearance Rate"
                        : "Delivery Accuracy"}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {type === "import"
                      ? currentMetrics.customsClearanceRate
                      : currentMetrics.deliveryAccuracy}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TargetIcon className="h-4 w-4 text-orange-600" />

                    <span className="text-sm font-medium">
                      Customer Satisfaction
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {currentMetrics.customerSatisfaction}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="practices" className="space-y-4">
            <div className="space-y-3">
              {currentBestPractices.map((practice, index) => (
                <Alert key={index}>
                  <HelpCircleIcon className="h-4 w-4" />

                  <AlertDescription>
                    <div className="space-y-2">
                      <h4 className="font-medium">{practice.title}</h4>
                      <p className="text-sm">{practice.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        Impact: {practice.impact}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => handleActionClick(action.action)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />

                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-600">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
