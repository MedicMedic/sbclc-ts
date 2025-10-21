import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BellIcon,
  AlertTriangleIcon,
  ClockIcon,
  TruckIcon,
  ShipIcon,
  CheckCircleIcon,
  XIcon,
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react";

interface Notification {
  id: string;
  type: "urgent" | "warning" | "info" | "success";
  category: "customs" | "delivery" | "schedule" | "document" | "general";
  title: string;
  message: string;
  bookingId: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  priority: "high" | "medium" | "low";
}

interface MonitoringNotificationsProps {
  notifications?: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
  onTakeAction?: (notification: Notification) => void;
  className?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "urgent",
    category: "customs",
    title: "Customs Examination Required",
    message:
      "Container MSKU1234567 has been selected for physical examination. Immediate attention required.",
    bookingId: "BK001",
    timestamp: "2024-01-23T10:30:00Z",
    isRead: false,
    actionRequired: true,
    priority: "high",
  },
  {
    id: "notif_002",
    type: "warning",
    category: "schedule",
    title: "Delivery Delay Alert",
    message:
      "Trucking delivery for ABC Trading Corp is running 2 hours behind schedule due to traffic.",
    bookingId: "TRK-001",
    timestamp: "2024-01-23T09:15:00Z",
    isRead: false,
    actionRequired: true,
    priority: "medium",
  },
  {
    id: "notif_003",
    type: "info",
    category: "document",
    title: "Documents Received",
    message:
      "Original shipping documents have been received and processed for BL MAEU12345678.",
    bookingId: "BK002",
    timestamp: "2024-01-23T08:45:00Z",
    isRead: true,
    actionRequired: false,
    priority: "low",
  },
  {
    id: "notif_004",
    type: "success",
    category: "delivery",
    title: "Delivery Completed",
    message:
      "Container successfully delivered to XYZ Logistics Inc. POD received and processed.",
    bookingId: "BK003",
    timestamp: "2024-01-23T07:20:00Z",
    isRead: false,
    actionRequired: false,
    priority: "low",
  },
  {
    id: "notif_005",
    type: "urgent",
    category: "customs",
    title: "Demurrage Alert",
    message:
      "Container storage period expires in 24 hours. Immediate release required to avoid additional charges.",
    bookingId: "BK004",
    timestamp: "2024-01-23T06:00:00Z",
    isRead: false,
    actionRequired: true,
    priority: "high",
  },
];

export function MonitoringNotifications({
  notifications = mockNotifications,
  onMarkAsRead,
  onDismiss,
  onTakeAction,
  className = "",
}: MonitoringNotificationsProps) {
  const [notificationList, setNotificationList] = useState(notifications);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch new notifications from the server
      console.log("Checking for new notifications...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notificationList.filter((n) => !n.isRead).length;
  const urgentCount = notificationList.filter(
    (n) => n.type === "urgent" && !n.isRead
  ).length;
  const actionRequiredCount = notificationList.filter(
    (n) => n.actionRequired && !n.isRead
  ).length;

  const getNotificationIcon = (type: string, category: string) => {
    if (type === "urgent")
      return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;

    if (category === "delivery")
      return <TruckIcon className="h-4 w-4 text-blue-500" />;

    if (category === "customs")
      return <ShipIcon className="h-4 w-4 text-orange-500" />;

    if (category === "schedule")
      return <ClockIcon className="h-4 w-4 text-yellow-500" />;

    if (category === "document")
      return <CalendarIcon className="h-4 w-4 text-green-500" />;

    return <BellIcon className="h-4 w-4 text-gray-500" />;
  };

  const getNotificationBadge = (type: string) => {
    const badges = {
      urgent: { variant: "destructive" as const, label: "Urgent" },
      warning: {
        variant: "secondary" as const,
        label: "Warning",
        className: "bg-orange-100 text-orange-800",
      },
      info: { variant: "secondary" as const, label: "Info" },
      success: {
        variant: "secondary" as const,
        label: "Success",
        className: "bg-green-100 text-green-800",
      },
    };

    const badge = badges[type as keyof typeof badges] || badges.info;
    return (
      <Badge variant={badge.variant} className={badge.className}>
        {badge.label}
      </Badge>
    );
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    onMarkAsRead?.(notificationId);
  };

  const handleDismiss = (notificationId: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== notificationId));
    onDismiss?.(notificationId);
  };

  const handleTakeAction = (notification: Notification) => {
    setSelectedNotification(notification);
    onTakeAction?.(notification);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const recentNotifications = notificationList
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 3);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Notification Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Urgent Alerts
                </p>
                <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Action Required
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {actionRequiredCount}
                </p>
              </div>
              <AlertCircleIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Unread</p>
                <p className="text-2xl font-bold text-blue-600">
                  {unreadCount}
                </p>
              </div>
              <BellIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BellIcon className="h-5 w-5" />

              <span>Recent Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllNotifications(true)}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BellIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />

                <p>No recent notifications</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    notification.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(
                      notification.type,
                      notification.category
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {getNotificationBadge(notification.type)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Booking: {notification.bookingId}</span>
                          <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
                        {notification.actionRequired && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTakeAction(notification)}
                            className="text-xs"
                          >
                            Take Action
                          </Button>
                        )}
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs"
                          >
                            <CheckCircleIcon className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(notification.id)}
                          className="text-xs"
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Notifications Dialog */}
      <Dialog
        open={showAllNotifications}
        onOpenChange={setShowAllNotifications}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {notificationList.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  notification.isRead
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-blue-200"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(
                    notification.type,
                    notification.category
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {getNotificationBadge(notification.type)}
                        {notification.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Booking: {notification.bookingId}</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        <span className="capitalize">
                          {notification.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {notification.actionRequired && (
                        <Button
                          size="sm"
                          onClick={() => handleTakeAction(notification)}
                        >
                          Take Action
                        </Button>
                      )}
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
