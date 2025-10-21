import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  ClockIcon,
  BarChart3Icon,
  PieChartIcon,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  ShipIcon,
  DollarSignIcon,
  UsersIcon,
} from "lucide-react";

interface InsightItem {
  id: string;
  type: "trend" | "alert" | "recommendation" | "milestone";
  title: string;
  description: string;
  value?: string | number;
  change?: number;
  priority: "low" | "medium" | "high" | "critical";
  actionable: boolean;
  category: string;
}

interface MonitoringInsightsPanelProps {
  type: "import" | "domestic";
  timeRange?: "today" | "week" | "month" | "quarter";
  onInsightAction?: (insight: InsightItem) => void;
  className?: string;
}

export function MonitoringInsightsPanel({
  type,
  timeRange = "week",
  onInsightAction,
  className = "",
}: MonitoringInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState("trends");

  // Generate insights based on type
  const generateInsights = (): InsightItem[] => {
    const baseInsights: InsightItem[] = [];

    if (type === "import") {
      baseInsights.push(
        {
          id: "customs_delay_trend",
          type: "trend",
          title: "Customs Clearance Delays Increasing",
          description:
            "Average clearance time increased by 15% this week due to new documentation requirements",
          value: "2.3 days",
          change: 15,
          priority: "high",
          actionable: true,
          category: "Operations",
        },
        {
          id: "vessel_schedule_alert",
          type: "alert",
          title: "Vessel Schedule Changes",
          description:
            "3 vessels have updated arrival times affecting 12 shipments",
          priority: "medium",
          actionable: true,
          category: "Schedule",
        },
        {
          id: "port_congestion",
          type: "recommendation",
          title: "Port Congestion Mitigation",
          description:
            "Consider alternative discharge ports for upcoming shipments to avoid 2-day delays",
          priority: "medium",
          actionable: true,
          category: "Planning",
        },
        {
          id: "documentation_compliance",
          type: "milestone",
          title: "Documentation Compliance Improved",
          description:
            "98% of shipments now have complete documentation on arrival",
          value: "98%",
          change: 5,
          priority: "low",
          actionable: false,
          category: "Compliance",
        }
      );
    } else {
      baseInsights.push(
        {
          id: "delivery_performance",
          type: "trend",
          title: "On-Time Delivery Performance",
          description:
            "Delivery performance improved by 8% with new route optimization",
          value: "96%",
          change: 8,
          priority: "low",
          actionable: false,
          category: "Performance",
        },
        {
          id: "fuel_cost_alert",
          type: "alert",
          title: "Fuel Cost Increase",
          description: "Fuel costs increased by 12% affecting delivery margins",
          value: "₱65/L",
          change: 12,
          priority: "high",
          actionable: true,
          category: "Cost",
        },
        {
          id: "driver_shortage",
          type: "recommendation",
          title: "Driver Resource Planning",
          description:
            "Peak season approaching - consider hiring 3 additional drivers",
          priority: "medium",
          actionable: true,
          category: "Resources",
        },
        {
          id: "customer_satisfaction",
          type: "milestone",
          title: "Customer Satisfaction High",
          description: "Customer satisfaction rating reached 4.8/5 this month",
          value: "4.8/5",
          change: 4,
          priority: "low",
          actionable: false,
          category: "Service",
        }
      );
    }

    return baseInsights;
  };

  const insights = generateInsights();

  // Performance metrics for charts
  const performanceData = {
    import: {
      weeklyTrends: [
        { day: "Mon", clearance: 85, delivery: 92, satisfaction: 4.6 },
        { day: "Tue", clearance: 88, delivery: 94, satisfaction: 4.7 },
        { day: "Wed", clearance: 82, delivery: 89, satisfaction: 4.5 },
        { day: "Thu", clearance: 90, delivery: 96, satisfaction: 4.8 },
        { day: "Fri", clearance: 87, delivery: 93, satisfaction: 4.7 },
      ],

      topIssues: [
        { issue: "Documentation Delays", count: 8, impact: "High" },
        { issue: "Port Congestion", count: 5, impact: "Medium" },
        { issue: "Customs Examination", count: 3, impact: "High" },
        { issue: "Weather Delays", count: 2, impact: "Low" },
      ],
    },
    domestic: {
      weeklyTrends: [
        { day: "Mon", onTime: 94, cost: 2800, satisfaction: 4.7 },
        { day: "Tue", onTime: 96, cost: 2950, satisfaction: 4.8 },
        { day: "Wed", onTime: 92, cost: 3100, satisfaction: 4.6 },
        { day: "Thu", onTime: 98, cost: 2750, satisfaction: 4.9 },
        { day: "Fri", onTime: 95, cost: 2900, satisfaction: 4.8 },
      ],

      topIssues: [
        { issue: "Traffic Delays", count: 12, impact: "Medium" },
        { issue: "Vehicle Breakdown", count: 4, impact: "High" },
        { issue: "Address Issues", count: 6, impact: "Low" },
        { issue: "Weather Conditions", count: 3, impact: "Medium" },
      ],
    },
  };

  const currentData = performanceData[type];

  // Key metrics summary
  const keyMetrics = {
    import: [
      {
        label: "Avg Clearance Time",
        value: "2.3 days",
        trend: "up",
        change: "+0.3",
      },
      { label: "Port Efficiency", value: "87%", trend: "down", change: "-2%" },
      { label: "Document Accuracy", value: "98%", trend: "up", change: "+1%" },
      { label: "Cost per TEU", value: "₱15,200", trend: "up", change: "+5%" },
    ],

    domestic: [
      { label: "On-Time Delivery", value: "96%", trend: "up", change: "+3%" },
      {
        label: "Avg Delivery Time",
        value: "1.8 days",
        trend: "down",
        change: "-0.2",
      },
      {
        label: "Fuel Efficiency",
        value: "8.5 km/L",
        trend: "down",
        change: "-0.3",
      },
      { label: "Cost per KM", value: "₱12.50", trend: "up", change: "+8%" },
    ],
  };

  const currentMetrics = keyMetrics[type];

  const getInsightIcon = (insightType: InsightItem["type"]) => {
    switch (insightType) {
      case "trend":
        return <TrendingUpIcon className="h-5 w-5 text-blue-600" />;

      case "alert":
        return <AlertTriangleIcon className="h-5 w-5 text-orange-600" />;

      case "recommendation":
        return <InfoIcon className="h-5 w-5 text-purple-600" />;

      case "milestone":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;

      default:
        return <InfoIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: InsightItem["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUpIcon className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDownIcon className="h-4 w-4 text-red-600" />
    );
  };

  const handleInsightAction = (insight: InsightItem) => {
    onInsightAction?.(insight);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3Icon className="h-5 w-5" />
          {type === "import" ? "Import" : "Domestic"} Monitoring Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {currentMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {metric.label}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div
                      className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {metric.change} from last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Weekly Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentData.weeklyTrends.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{day.day}</span>
                      <div className="flex items-center gap-4">
                        {type === "import" ? (
                          <>
                            <div className="text-sm">
                              Clearance:{" "}
                              <span className="font-medium">
                                {day.clearance}%
                              </span>
                            </div>
                            <div className="text-sm">
                              Delivery:{" "}
                              <span className="font-medium">
                                {day.delivery}%
                              </span>
                            </div>
                            <div className="text-sm">
                              Rating:{" "}
                              <span className="font-medium">
                                {day.satisfaction}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm">
                              On-Time:{" "}
                              <span className="font-medium">{day.onTime}%</span>
                            </div>
                            <div className="text-sm">
                              Cost:{" "}
                              <span className="font-medium">₱{day.cost}</span>
                            </div>
                            <div className="text-sm">
                              Rating:{" "}
                              <span className="font-medium">
                                {day.satisfaction}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-3">
              {insights
                .filter(
                  (insight) =>
                    insight.type === "alert" ||
                    insight.priority === "high" ||
                    insight.priority === "critical"
                )
                .map((insight) => (
                  <Alert
                    key={insight.id}
                    className="border-l-4 border-l-orange-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.description}
                          </p>
                          {insight.value && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{insight.value}</Badge>
                              {insight.change && (
                                <span
                                  className={`text-sm ${insight.change > 0 ? "text-red-600" : "text-green-600"}`}
                                >
                                  {insight.change > 0 ? "+" : ""}
                                  {insight.change}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                        {insight.actionable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInsightAction(insight)}
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {type === "import" ? (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Customs Clearance Rate</span>
                            <span>87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Documentation Accuracy</span>
                            <span>98%</span>
                          </div>
                          <Progress value={98} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>On-Time Delivery</span>
                            <span>94%</span>
                          </div>
                          <Progress value={94} className="h-2" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>On-Time Delivery</span>
                            <span>96%</span>
                          </div>
                          <Progress value={96} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Route Efficiency</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Customer Satisfaction</span>
                            <span>95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {type === "import" ? (
                        <ShipIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <TruckIcon className="h-4 w-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium">
                        Active Shipments
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {type === "import" ? "45" : "32"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Currently in progress
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSignIcon className="h-4 w-4 text-green-600" />

                      <span className="text-sm font-medium">
                        Revenue Impact
                      </span>
                    </div>
                    <div className="text-2xl font-bold">₱2.4M</div>
                    <div className="text-sm text-gray-600">This month</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Issues This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentData.topIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{issue.issue}</h4>
                        <p className="text-sm text-gray-600">
                          {issue.count} occurrences
                        </p>
                      </div>
                      <Badge
                        className={
                          issue.impact === "High"
                            ? "bg-red-100 text-red-800"
                            : issue.impact === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {issue.impact} Impact
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {insights
                .filter((insight) => insight.type === "recommendation")
                .map((insight) => (
                  <Alert key={insight.id}>
                    <InfoIcon className="h-4 w-4" />

                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm mt-1">{insight.description}</p>
                        </div>
                        {insight.actionable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInsightAction(insight)}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
