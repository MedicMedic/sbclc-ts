import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3Icon,
  TrendingUpIcon,
  FileTextIcon,
  DownloadIcon,
  CalendarIcon,
  FilterIcon,
  DollarSignIcon,
  PackageIcon,
  TruckIcon,
  ShipIcon,
} from "lucide-react";
import { bookings, quotations } from "@/polymet/data/logistics-data";

export function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-01-31",
  });
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Calculate report data
  const getReportData = () => {
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);

      return (
        bookingDate >= fromDate &&
        bookingDate <= toDate &&
        (selectedService === "all" ||
          booking.serviceType === selectedService) &&
        (selectedStatus === "all" || booking.status === selectedStatus)
      );
    });

    const totalRevenue = filteredBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    );
    const totalBookings = filteredBookings.length;
    const avgBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    const serviceBreakdown = filteredBookings.reduce(
      (acc, booking) => {
        acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusBreakdown = filteredBookings.reduce(
      (acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      filteredBookings,
      totalRevenue,
      totalBookings,
      avgBookingValue,
      serviceBreakdown,
      statusBreakdown,
    };
  };

  const reportData = getReportData();

  const handleExport = (format: string, reportType: string) => {
    alert(`Exporting ${reportType} report in ${format} format...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive business intelligence and reporting
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Service Type</Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Import Brokerage">
                    Import Brokerage
                  </SelectItem>
                  <SelectItem value="Import Forwarding">
                    Import Forwarding
                  </SelectItem>
                  <SelectItem value="Domestic Trucking">
                    Domestic Trucking
                  </SelectItem>
                  <SelectItem value="Domestic Forwarding">
                    Domestic Forwarding
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger
            value="operational"
            className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
          >
            Operational
          </TabsTrigger>
          <TabsTrigger
            value="client"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Client Reports
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            Custom Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ₱{reportData.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSignIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#1e40af]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-[#1e40af]">
                      {reportData.totalBookings}
                    </p>
                  </div>
                  <PackageIcon className="h-8 w-8 text-[#1e40af]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#3b82f6]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg Booking Value
                    </p>
                    <p className="text-2xl font-bold text-[#3b82f6]">
                      ₱{Math.round(reportData.avgBookingValue).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-[#3b82f6]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#f97316]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Services
                    </p>
                    <p className="text-2xl font-bold text-[#f97316]">
                      {Object.keys(reportData.serviceBreakdown).length}
                    </p>
                  </div>
                  <BarChart3Icon className="h-8 w-8 text-[#f97316]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(reportData.serviceBreakdown).map(
                    ([service, count]) => (
                      <div
                        key={service}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {service.includes("Import") ? (
                            <ShipIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <TruckIcon className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm">{service}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(reportData.statusBreakdown).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm capitalize">{status}</span>
                        <Badge
                          variant="outline"
                          className={
                            status === "completed"
                              ? "border-green-600 text-green-600"
                              : status === "active"
                                ? "border-blue-600 text-blue-600"
                                : status === "pending"
                                  ? "border-yellow-600 text-yellow-600"
                                  : "border-red-600 text-red-600"
                          }
                        >
                          {count}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Analysis</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("PDF", "Revenue Analysis")}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Import Services</span>
                    <span className="font-semibold">
                      ₱{(reportData.totalRevenue * 0.6).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Domestic Services</span>
                    <span className="font-semibold">
                      ₱{(reportData.totalRevenue * 0.4).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="font-semibold">Total Revenue</span>
                    <span className="font-bold text-blue-600">
                      ₱{reportData.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cash Flow Summary</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("Excel", "Cash Flow")}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>Collections</span>
                    <span className="font-semibold text-green-600">
                      ₱{(reportData.totalRevenue * 0.8).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span>Outstanding</span>
                    <span className="font-semibold text-yellow-600">
                      ₱{(reportData.totalRevenue * 0.2).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span>Expenses</span>
                    <span className="font-semibold text-red-600">
                      ₱{(reportData.totalRevenue * 0.3).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operational Tab */}
        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Metrics</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("PDF", "Performance")}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>On-Time Delivery Rate</span>
                    <Badge className="bg-green-100 text-green-800">95%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <Badge className="bg-blue-100 text-blue-800">4.8/5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Processing Time</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      2.3 days
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Booking Completion Rate</span>
                    <Badge className="bg-orange-100 text-orange-800">92%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Capacity Utilization</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("Excel", "Capacity")}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Import Operations</span>
                    <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Domestic Trucking</span>
                    <Badge className="bg-green-100 text-green-800">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Warehouse Space</span>
                    <Badge className="bg-yellow-100 text-yellow-800">65%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Staff Utilization</span>
                    <Badge className="bg-purple-100 text-purple-800">88%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Client Reports Tab */}
        <TabsContent value="client" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Activity Reports</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("PDF", "Client Activity")}
                  >
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("Excel", "Client Activity")}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.filteredBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.serviceType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₱{booking.totalAmount?.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create custom reports with specific parameters and data
                  points.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3Icon className="h-6 w-6 mb-2" />
                    Revenue by Service
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUpIcon className="h-6 w-6 mb-2" />
                    Monthly Trends
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <PackageIcon className="h-6 w-6 mb-2" />
                    Shipment Analysis
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <CalendarIcon className="h-6 w-6 mb-2" />
                    Delivery Performance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
