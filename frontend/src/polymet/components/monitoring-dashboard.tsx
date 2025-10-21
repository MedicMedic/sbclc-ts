import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TruckIcon,
  ShipIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PackageIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";

interface MonitoringDashboardProps {
  type: "import" | "domestic" | "overview";
  data?: any;
  className?: string;
}

// Mock dashboard data
const mockDashboardData = {
  import: {
    totalShipments: 45,
    pending: 12,
    inTransit: 18,
    delivered: 15,
    delayed: 3,
    customsCleared: 28,
    documentsReceived: 35,
    avgProcessingTime: "3.2 days",
    onTimeDelivery: 87,
    trends: {
      shipmentsChange: 12,
      deliveryChange: -5,
    },
  },
  domestic: {
    totalBookings: 32,
    pending: 8,
    inTransit: 12,
    delivered: 10,
    delayed: 2,
    truckingBookings: 20,
    forwardingBookings: 12,
    avgDeliveryTime: "1.8 days",
    onTimeDelivery: 92,
    trends: {
      bookingsChange: 8,
      deliveryChange: 3,
    },
  },
};

export function MonitoringDashboard({
  type,
  data,
  className = "",
}: MonitoringDashboardProps) {
  const dashboardData = data || mockDashboardData;

  const renderImportDashboard = () => {
    const importData = dashboardData.import;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shipments */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Shipments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {importData.totalShipments}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUpIcon className="h-3 w-3 text-green-500" />

                  <span className="text-xs text-green-600">
                    +{importData.trends.shipmentsChange}% this month
                  </span>
                </div>
              </div>
              <ShipIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* In Transit */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {importData.inTransit}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active shipments</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Delivered */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {importData.delivered}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Delayed */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-red-600">
                  {importData.delayed}
                </p>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        {/* Customs Processing */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Customs Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Documents Received</span>
                  <span>
                    {importData.documentsReceived}/{importData.totalShipments}
                  </span>
                </div>
                <Progress
                  value={
                    (importData.documentsReceived / importData.totalShipments) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Customs Cleared</span>
                  <span>
                    {importData.customsCleared}/{importData.totalShipments}
                  </span>
                </div>
                <Progress
                  value={
                    (importData.customsCleared / importData.totalShipments) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {importData.avgProcessingTime}
                </p>
                <p className="text-sm text-gray-600">Avg Processing Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {importData.onTimeDelivery}%
                </p>
                <p className="text-sm text-gray-600">On-Time Delivery</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  {importData.trends.deliveryChange >= 0 ? (
                    <TrendingUpIcon className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${importData.trends.deliveryChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Math.abs(importData.trends.deliveryChange)}% vs last month
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDomesticDashboard = () => {
    const domesticData = dashboardData.domestic;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {domesticData.totalBookings}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUpIcon className="h-3 w-3 text-green-500" />

                  <span className="text-xs text-green-600">
                    +{domesticData.trends.bookingsChange}% this month
                  </span>
                </div>
              </div>
              <TruckIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* In Transit */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {domesticData.inTransit}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active deliveries</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Delivered */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {domesticData.delivered}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Delayed */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-red-600">
                  {domesticData.delayed}
                </p>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        {/* Service Breakdown */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Service Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TruckIcon className="h-4 w-4 text-orange-500" />

                  <span className="text-sm">Trucking Services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {domesticData.truckingBookings}
                  </span>
                  <Badge variant="secondary">
                    {Math.round(
                      (domesticData.truckingBookings /
                        domesticData.totalBookings) *
                        100
                    )}
                    %
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShipIcon className="h-4 w-4 text-blue-500" />

                  <span className="text-sm">Forwarding Services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {domesticData.forwardingBookings}
                  </span>
                  <Badge variant="secondary">
                    {Math.round(
                      (domesticData.forwardingBookings /
                        domesticData.totalBookings) *
                        100
                    )}
                    %
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {domesticData.avgDeliveryTime}
                </p>
                <p className="text-sm text-gray-600">Avg Delivery Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {domesticData.onTimeDelivery}%
                </p>
                <p className="text-sm text-gray-600">On-Time Delivery</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  {domesticData.trends.deliveryChange >= 0 ? (
                    <TrendingUpIcon className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${domesticData.trends.deliveryChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Math.abs(domesticData.trends.deliveryChange)}% vs last
                    month
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverviewDashboard = () => {
    const importData = dashboardData.import;
    const domesticData = dashboardData.domestic;
    const totalShipments =
      importData.totalShipments + domesticData.totalBookings;
    const totalInTransit = importData.inTransit + domesticData.inTransit;
    const totalDelivered = importData.delivered + domesticData.delivered;
    const totalDelayed = importData.delayed + domesticData.delayed;

    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Operations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalShipments}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Import + Domestic
                  </p>
                </div>
                <PackageIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalInTransit}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">In progress</p>
                </div>
                <ClockIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalDelivered}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues</p>
                  <p className="text-2xl font-bold text-red-600">
                    {totalDelayed}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Needs attention</p>
                </div>
                <AlertTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <ShipIcon className="h-5 w-5" />

                <span>Import Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Shipments</span>
                  <Badge variant="outline">{importData.totalShipments}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-Time Delivery</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {importData.onTimeDelivery}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Processing</span>
                  <Badge variant="outline">
                    {importData.avgProcessingTime}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <TruckIcon className="h-5 w-5" />

                <span>Domestic Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Bookings</span>
                  <Badge variant="outline">{domesticData.totalBookings}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-Time Delivery</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {domesticData.onTimeDelivery}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Delivery</span>
                  <Badge variant="outline">
                    {domesticData.avgDeliveryTime}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {type === "import" && renderImportDashboard()}
      {type === "domestic" && renderDomesticDashboard()}
      {type === "overview" && renderOverviewDashboard()}
    </div>
  );
}
