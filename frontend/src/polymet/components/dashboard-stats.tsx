import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUpIcon,
  ShipIcon,
  ClockIcon,
  DollarSignIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  TruckIcon,
  FileTextIcon,
  PlusIcon,
  ArrowRightIcon,
  PackageIcon,
  AlertCircleIcon,
  CalendarIcon,
} from "lucide-react";
import {
  dashboardStats,
  bookings,
  bookingStatuses,
} from "@/polymet/data/logistics-data";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<any>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUpIcon
              className={`h-3 w-3 mr-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            />

            <span
              className={`text-xs ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentBookingsProps {
  bookings: any[];
  className?: string;
}

function RecentBookings({ bookings, className }: RecentBookingsProps) {
  const getStatusColor = (status: string) => {
    const statusConfig = bookingStatuses.find((s) => s.id === status);
    return statusConfig?.color || "gray";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20";
      case "quotation_sent":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20";
      case "approved":
        return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20";
      case "delivered":
        return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20";
      case "pending":
        return "bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActionButton = (booking: any) => {
    if (booking.status === "quotation_sent") {
      return (
        <Link to="/approvals">
          <Button size="sm" variant="outline" className="text-xs">
            Review
          </Button>
        </Link>
      );
    }
    if (booking.status === "in_transit") {
      return (
        <Link to="/monitoring">
          <Button size="sm" variant="outline" className="text-xs">
            Track
          </Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </div>
          <Link to="/monitoring">
            <Button variant="ghost" size="sm" className="text-[#1e40af]">
              View All <ArrowRightIcon className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    booking.type.includes("trucking") ||
                    booking.type.includes("forwarding")
                      ? "bg-[#f97316]/10"
                      : "bg-[#1e40af]/10"
                  }`}
                >
                  {booking.type.includes("trucking") ||
                  booking.type.includes("forwarding") ? (
                    <TruckIcon className="w-5 h-5 text-[#f97316]" />
                  ) : (
                    <ShipIcon className="w-5 h-5 text-[#1e40af]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{booking.id}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {booking.consignee || booking.client}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getStatusBadgeClass(booking.status)}
                >
                  {booking.status.replace("_", " ")}
                </Badge>
                {getActionButton(booking)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface UrgentTasksProps {
  tasks: any[];
  className?: string;
}

function UrgentTasks({ tasks, className }: UrgentTasksProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: AlertTriangleIcon,
          color: "text-[#ef4444]",
          bgColor: "bg-[#ef4444]/10",
          badgeClass: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
        };
      case "medium":
        return {
          icon: ClockIcon,
          color: "text-[#f59e0b]",
          bgColor: "bg-[#f59e0b]/10",
          badgeClass: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
        };
      default:
        return {
          icon: CheckCircleIcon,
          color: "text-[#10b981]",
          bgColor: "bg-[#10b981]/10",
          badgeClass: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
        };
    }
  };

  const getTaskAction = (task: any) => {
    if (task.description.includes("ETA update")) {
      return (
        <Link to="/monitoring">
          <Button size="sm" variant="outline" className="text-xs">
            Update
          </Button>
        </Link>
      );
    }
    if (task.description.includes("approval")) {
      return (
        <Link to="/approvals">
          <Button size="sm" variant="outline" className="text-xs">
            Review
          </Button>
        </Link>
      );
    }
    return (
      <Button size="sm" variant="outline" className="text-xs">
        View
      </Button>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Action Required</CardTitle>
            <CardDescription>
              Items requiring immediate attention
            </CardDescription>
          </div>
          <AlertTriangleIcon className="h-5 w-5 text-[#f97316]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const config = getPriorityConfig(task.priority);
            const Icon = config.icon;
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor}`}
                  >
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.description}</p>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${config.badgeClass}`}
                    >
                      {task.priority} priority
                    </Badge>
                  </div>
                </div>
                <div>{getTaskAction(task)}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate actionable metrics
  const activeShipments = bookings.filter(
    (b) => b.status === "in_transit" || b.status === "approved"
  ).length;
  const pendingApprovals = bookings.filter(
    (b) => b.status === "quotation_sent"
  ).length;
  const deliveredToday = bookings.filter(
    (b) =>
      b.status === "delivered" &&
      b.deliveryDate === new Date().toISOString().split("T")[0]
  ).length;
  const overdueDeliveries = bookings.filter(
    (b) => b.status === "in_transit" && b.eta && new Date(b.eta) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to SBCLC Logistics Management System
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/import-booking">
            <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Import Booking
            </Button>
          </Link>
          <Link to="/domestic-booking">
            <Button
              variant="outline"
              className="border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10"
            >
              <TruckIcon className="mr-2 h-4 w-4" />
              New Domestic Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics - Simple and Actionable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/monitoring">
          <Card className="border-l-4 border-l-[#1e40af] hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Shipments
              </CardTitle>
              <ShipIcon className="h-4 w-4 text-[#1e40af]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1e40af]">
                {activeShipments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently in transit
              </p>
              <div className="flex items-center mt-2 text-xs text-[#1e40af]">
                View all <ArrowRightIcon className="ml-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/approvals">
          <Card className="border-l-4 border-l-[#f97316] hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <ClockIcon className="h-4 w-4 text-[#f97316]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#f97316]">
                {pendingApprovals}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires your action
              </p>
              <div className="flex items-center mt-2 text-xs text-[#f97316]">
                Review now <ArrowRightIcon className="ml-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-[#10b981]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivered Today
            </CardTitle>
            <PackageIcon className="h-4 w-4 text-[#10b981]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#10b981]">
              {deliveredToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed deliveries
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ef4444]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Deliveries
            </CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-[#ef4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#ef4444]">
              {overdueDeliveries}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Past ETA date</p>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings bookings={dashboardStats.recentBookings} />

        <UrgentTasks tasks={dashboardStats.urgentTasks} />
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
              <CardDescription>Important activities for today</CardDescription>
            </div>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1e40af]" />

                <div>
                  <p className="text-sm font-medium">Expected Arrivals</p>
                  <p className="text-xs text-muted-foreground">
                    2 shipments arriving today
                  </p>
                </div>
              </div>
              <Link to="/monitoring">
                <Button variant="ghost" size="sm" className="text-[#1e40af]">
                  View
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#f97316]" />

                <div>
                  <p className="text-sm font-medium">Pending Quotations</p>
                  <p className="text-xs text-muted-foreground">
                    3 quotations need to be sent
                  </p>
                </div>
              </div>
              <Link to="/quotations">
                <Button variant="ghost" size="sm" className="text-[#f97316]">
                  Create
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />

                <div>
                  <p className="text-sm font-medium">Cash Advance Requests</p>
                  <p className="text-xs text-muted-foreground">
                    1 request awaiting approval
                  </p>
                </div>
              </div>
              <Link to="/cash-advance">
                <Button variant="ghost" size="sm" className="text-[#10b981]">
                  Review
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
