import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TruckIcon,
  LayoutDashboardIcon,
  ShipIcon,
  FileTextIcon,
  ClipboardListIcon,
  DollarSignIcon,
  BarChart3Icon,
  SettingsIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface NavigationSidebarProps {
  user?: any;
  onLogout?: () => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  badge?: number;
  children?: MenuItem[];
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/dashboard",
  },
  {
    id: "quotations",
    label: "Quotations",
    icon: FileTextIcon,
    path: "/quotations",
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: ShipIcon,
    children: [
      {
        id: "import-booking",
        label: "Import Booking",
        icon: ShipIcon,
        path: "/import/booking",
      },
      {
        id: "domestic-booking",
        label: "Domestic Booking",
        icon: TruckIcon,
        path: "/domestic/booking",
      },
    ],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: ClipboardListIcon,
    children: [
      {
        id: "monitoring-all",
        label: "All Shipments",
        icon: ClipboardListIcon,
        path: "/monitoring",
      },
      {
        id: "monitoring-import",
        label: "Import Monitoring",
        icon: ShipIcon,
        path: "/monitoring/import",
      },
      {
        id: "monitoring-domestic",
        label: "Domestic Monitoring",
        icon: TruckIcon,
        path: "/monitoring/domestic",
      },
    ],
  },
  {
    id: "cash-advance",
    label: "Cash Advance",
    icon: DollarSignIcon,
    path: "/cash-advance",
    roles: ["booking", "accounting", "finance", "admin"],
  },
  {
    id: "rfp",
    label: "RFP",
    icon: FileTextIcon,
    children: [
      {
        id: "rfp-entry",
        label: "RFP Entry",
        icon: FileTextIcon,
        path: "/rfp/entry",
        roles: ["booking", "accounting", "admin"],
      },
      {
        id: "rfp-summary",
        label: "RFP Summary",
        icon: BarChart3Icon,
        path: "/rfp/summary",
        roles: ["accounting", "finance", "admin"],
      },
    ],

    roles: ["booking", "accounting", "finance", "admin"],
  },
  {
    id: "approvals",
    label: "Approvals",
    icon: CheckCircleIcon,
    path: "/approvals",
    roles: ["head", "finance", "admin"],
  },
  {
    id: "billing",
    label: "Billing",
    icon: FileTextIcon,
    children: [
      {
        id: "billing-overview",
        label: "Billing Overview",
        icon: FileTextIcon,
        path: "/billing",
        roles: ["accounting", "admin"],
      },
      {
        id: "collection-monitoring",
        label: "Collection Monitoring",
        icon: ClipboardListIcon,
        path: "/collection-monitoring",
        roles: ["accounting", "finance", "admin"],
      },
    ],

    roles: ["accounting", "finance", "admin"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3Icon,
    children: [
      {
        id: "reports-all",
        label: "All Reports",
        icon: BarChart3Icon,
        path: "/reports",
      },
      {
        id: "reports-financial",
        label: "Financial Reports",
        icon: DollarSignIcon,
        path: "/reports/financial",
      },
      {
        id: "reports-operational",
        label: "Operational Reports",
        icon: ClipboardListIcon,
        path: "/reports/operational",
      },
      {
        id: "reports-client",
        label: "Client Reports",
        icon: UsersIcon,
        path: "/reports/client",
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    icon: SettingsIcon,
    children: [
      {
        id: "users",
        label: "User Management",
        icon: UsersIcon,
        path: "/admin/users",
        roles: ["admin"],
      },
      {
        id: "master-setup",
        label: "Master Setup",
        icon: SettingsIcon,
        path: "/admin/master-setup",
        roles: ["admin", "head"],
      },
    ],

    roles: ["admin", "head"],
  },
];

export function NavigationSidebar({
  user,
  className,
}: NavigationSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "bookings",
    "rfp",
    "administration",
  ]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const hasPermission = (item: MenuItem) => {
    if (!item.roles || !user) return true;
    return item.roles.includes(user.role);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    // Handle exact matches and nested routes
    if (location.pathname === path) return true;
    // Handle dynamic routes (e.g., /quotations/123)
    if (
      path.includes("/:") &&
      location.pathname.startsWith(path.split("/:")[0])
    )
      return true;
    return false;
  };

  const isParentActive = (item: MenuItem): boolean => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isActive(child.path));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!hasPermission(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = hasChildren ? isParentActive(item) : isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal",
              level > 0 && "ml-4",
              active &&
                "bg-gradient-to-r from-[#2E3B8E]/10 to-[#4A5FC1]/10 text-[#2E3B8E] border-l-4 border-[#FF6B35]"
            )}
            onClick={() => toggleExpanded(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />

            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto mr-2">
                {item.badge}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Only render as Link if there's a valid path
    if (!item.path) {
      return (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal",
            level > 0 && "ml-4",
            active && "bg-blue-50 text-blue-700"
          )}
          disabled
        >
          <item.icon className="mr-2 h-4 w-4" />

          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </Button>
      );
    }

    return (
      <Link key={item.id} to={item.path}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal",
            level > 0 && "ml-4",
            active && "bg-blue-50 text-blue-700"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />

          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-[#2E3B8E] to-[#4A5FC1]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5">
            <img
              src="https://assets.polymet.ai/deaf-yellow-688558"
              alt="SBCLC Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-base text-white leading-tight">
              SAVE AND BEST
            </h2>
            <p className="text-[10px] text-orange-400 font-semibold tracking-wide">
              CARGO LOGISTICS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
}
