import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  HelpCircleIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PhoneIcon,
  MailIcon,
  BookOpenIcon,
} from "lucide-react";

interface QuickTip {
  id: string;
  title: string;
  description: string;
  type: "tip" | "warning" | "info";
  category: string;
}

interface MonitoringHelpCenterSimpleProps {
  type: "import" | "domestic";
  className?: string;
}

export function MonitoringHelpCenterSimple({
  type,
  className = "",
}: MonitoringHelpCenterSimpleProps) {
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  // Quick tips based on monitoring type
  const quickTips: QuickTip[] =
    type === "import"
      ? [
          {
            id: "customs_status",
            title: "Monitor Customs Status",
            description:
              "Check customs clearance progress regularly. Green status means cleared, yellow means in progress, red means issues require attention.",
            type: "tip",
            category: "Operations",
          },
          {
            id: "vessel_delays",
            title: "Handle Vessel Delays",
            description:
              "When vessels are delayed, immediately update ETA and notify customers. Use bulk update for multiple affected shipments.",
            type: "warning",
            category: "Schedule",
          },
          {
            id: "document_prep",
            title: "Document Preparation",
            description:
              "Prepare all customs documents before vessel arrival to reduce clearance time by up to 40%.",
            type: "tip",
            category: "Documentation",
          },
          {
            id: "container_tracking",
            title: "Container Release Tracking",
            description:
              "Track container release status and coordinate with terminals. Set up alerts for containers approaching free time limits.",
            type: "info",
            category: "Operations",
          },
        ]
      : [
          {
            id: "dispatch_coordination",
            title: "Dispatch Coordination",
            description:
              "Assign appropriate vehicles and brief drivers on cargo requirements. Maintain regular communication during transit.",
            type: "tip",
            category: "Operations",
          },
          {
            id: "route_optimization",
            title: "Route Planning",
            description:
              "Group deliveries by area and consider traffic patterns. Proper route planning can reduce delivery time by 20-30%.",
            type: "tip",
            category: "Efficiency",
          },
          {
            id: "delivery_issues",
            title: "Handle Delivery Issues",
            description:
              "For delivery problems: verify addresses, reschedule if needed, arrange backup vehicles for breakdowns.",
            type: "warning",
            category: "Troubleshooting",
          },
          {
            id: "driver_communication",
            title: "Driver Communication",
            description:
              "Provide clear instructions and maintain regular check-ins. Use mobile apps for real-time updates when available.",
            type: "info",
            category: "Communication",
          },
        ];

  const getIcon = (tipType: QuickTip["type"]) => {
    switch (tipType) {
      case "tip":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;

      case "warning":
        return <AlertTriangleIcon className="h-4 w-4 text-orange-600" />;

      case "info":
        return <InfoIcon className="h-4 w-4 text-blue-600" />;

      default:
        return <HelpCircleIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertVariant = (tipType: QuickTip["type"]) => {
    switch (tipType) {
      case "warning":
        return "destructive";
      default:
        return "default";
    }
  };

  // Common workflow steps
  const workflowSteps =
    type === "import"
      ? [
          "1. Monitor vessel arrival and discharge",
          "2. Submit customs documentation",
          "3. Track customs clearance progress",
          "4. Coordinate container release",
          "5. Arrange delivery and collect POD",
        ]
      : [
          "1. Confirm booking and schedule",
          "2. Assign vehicle and driver",
          "3. Coordinate pickup",
          "4. Monitor transit progress",
          "5. Confirm delivery and collect POD",
        ];

  // Key performance indicators
  const kpis =
    type === "import"
      ? [
          {
            label: "Avg Clearance Time",
            target: "< 2 days",
            current: "2.3 days",
          },
          { label: "Documentation Accuracy", target: "> 95%", current: "98%" },
          { label: "On-Time Delivery", target: "> 90%", current: "94%" },
        ]
      : [
          { label: "On-Time Delivery", target: "> 95%", current: "96%" },
          { label: "Route Efficiency", target: "> 90%", current: "92%" },
          { label: "Customer Satisfaction", target: "> 4.5", current: "4.8/5" },
        ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5" />
          {type === "import" ? "Import" : "Domestic"} Monitoring Quick Help
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Tips */}
        <div>
          <h4 className="font-medium mb-3">💡 Quick Tips</h4>
          <div className="space-y-3">
            {quickTips.map((tip) => (
              <Alert key={tip.id} variant={getAlertVariant(tip.type)}>
                <div className="flex items-start gap-3">
                  {getIcon(tip.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{tip.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {tip.category}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      {tip.description}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>

        {/* Workflow Steps */}
        <div>
          <h4 className="font-medium mb-3">📋 Standard Workflow</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {workflowSteps.map((step, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div>
          <h4 className="font-medium mb-3">📊 Key Performance Targets</h4>
          <div className="grid grid-cols-1 gap-3">
            {kpis.map((kpi, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-sm">{kpi.label}</div>
                  <div className="text-xs text-gray-600">
                    Target: {kpi.target}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{kpi.current}</div>
                  <div className="text-xs text-gray-600">Current</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="font-medium mb-3">⚡ Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Bulk Status Update
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <AlertTriangleIcon className="h-4 w-4 mr-2" />
              Flag Issues
            </Button>
            {type === "import" ? (
              <>
                <Button variant="outline" size="sm" className="justify-start">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  Check Customs
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <HelpCircleIcon className="h-4 w-4 mr-2" />
                  Vessel Schedule
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="justify-start">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  Assign Driver
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <HelpCircleIcon className="h-4 w-4 mr-2" />
                  Route Optimizer
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">🆘 Need Help?</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <PhoneIcon className="h-3 w-3 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <MailIcon className="h-3 w-3 mr-2" />
              Email Help
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
