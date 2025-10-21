import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  PackageIcon,
  MonitorIcon,
  DollarSignIcon,
  CreditCardIcon,
  WalletIcon,
  CheckCircleIcon,
  BarChartIcon,
  UsersIcon,
  SettingsIcon,
  LockIcon,
  CheckIcon,
  XIcon,
  SaveIcon,
} from "lucide-react";
import client from "@/api/client";
import { useToast } from "@/components/ui/use-toast";

interface UserPermissionsManagerProps {
  userRole: string;
  editable?: boolean;
  onPermissionsChange?: (permissions: Record<string, string[]>) => void;
}

const modules = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    description: "View system overview and statistics",
    actions: ["view", "edit"],
  },
  {
    id: "quotations",
    name: "Quotations",
    icon: FileTextIcon,
    description: "Manage quotations and pricing",
    actions: ["view", "create", "edit", "delete", "approve"],
  },
  {
    id: "bookings",
    name: "Bookings",
    icon: PackageIcon,
    description: "Manage import and domestic bookings",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    id: "monitoring",
    name: "Monitoring",
    icon: MonitorIcon,
    description: "Track shipments and deliveries",
    actions: ["view", "edit", "export"],
  },
  {
    id: "cash_advance",
    name: "Cash Advance",
    icon: DollarSignIcon,
    description: "Manage cash advance requests",
    actions: ["view", "create", "edit", "delete", "approve", "disburse"],
  },
  {
    id: "billing",
    name: "Billing",
    icon: CreditCardIcon,
    description: "Generate and manage invoices",
    actions: ["view", "create", "edit", "delete", "approve"],
  },
  {
    id: "collection_monitoring",
    name: "Collection Monitoring",
    icon: WalletIcon,
    description: "Track payments and collections",
    actions: ["view", "edit", "export"],
  },
  {
    id: "approvals",
    name: "Approvals",
    icon: CheckCircleIcon,
    description: "Approve or reject transactions",
    actions: ["view", "approve", "reject"],
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChartIcon,
    description: "Generate and view reports",
    actions: ["view", "export"],
  },
  {
    id: "admin_users",
    name: "User Management",
    icon: UsersIcon,
    description: "Manage system users and roles",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    id: "master_setup",
    name: "Master Setup",
    icon: SettingsIcon,
    description: "Configure system master data",
    actions: ["view", "create", "edit", "delete"],
  },
];

const actionLabels: Record<string, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
  reject: "Reject",
  export: "Export",
  disburse: "Disburse",
};

export function UserPermissionsManager({
  userRole,
  editable = false,
  onPermissionsChange,
}: UserPermissionsManagerProps) {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch permissions from backend
  useEffect(() => {
    fetchPermissions();
  }, [userRole]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/api/roles/${userRole}/permissions`);
      const rolePerms = response.data; // { module_id: [actions] }
      setPermissions(rolePerms);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast({
        title: "Failed to load permissions",
        description: "Could not fetch role permissions from server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (moduleId: string, action: string): boolean => {
    const modulePerms = permissions[moduleId];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  };

  const togglePermission = (moduleId: string, action: string) => {
    if (!editable) return;

    setPermissions((prev) => {
      const modulePerms = prev[moduleId] || [];
      const newModulePerms = modulePerms.includes(action)
        ? modulePerms.filter((a) => a !== action)
        : [...modulePerms, action];

      const updated = {
        ...prev,
        [moduleId]: newModulePerms,
      };

      setHasChanges(true);
      return updated;
    });
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      await client.put(`/api/roles/${userRole}/permissions`, {
        permissions,
      });

      toast({
        title: "Permissions updated",
        description: `Role permissions for ${userRole} have been saved successfully.`,
      });

      setHasChanges(false);
      if (onPermissionsChange) {
        onPermissionsChange(permissions);
      }
    } catch (error) {
      console.error("Failed to save permissions:", error);
      toast({
        title: "Failed to save permissions",
        description: "Could not update role permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getAccessLevel = (moduleId: string): string => {
    const modulePerms = permissions[moduleId];
    if (!modulePerms || modulePerms.length === 0) return "No Access";

    const hasView = modulePerms.includes("view");
    const hasCreate = modulePerms.includes("create");
    const hasEdit = modulePerms.includes("edit");
    const hasDelete = modulePerms.includes("delete");
    const hasApprove = modulePerms.includes("approve");

    if (hasDelete || hasApprove) return "Full Access";
    if (hasEdit) return "Edit Access";
    if (hasCreate) return "Create Access";
    if (hasView) return "View Only";
    return "No Access";
  };

  const getAccessBadgeColor = (level: string): string => {
    switch (level) {
      case "Full Access":
        return "bg-green-600 text-white";
      case "Edit Access":
        return "bg-blue-600 text-white";
      case "Create Access":
        return "bg-purple-600 text-white";
      case "View Only":
        return "bg-gray-600 text-white";
      default:
        return "bg-red-600 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-[#1e40af]" />
            Module Permissions
          </h3>
          <div className="text-sm text-gray-600 mt-1">
            Configure access control for role: <Badge className="ml-2">{userRole}</Badge>
            {editable && (
              <span className="ml-2 text-xs text-orange-600">
                (Editable - Click checkboxes to modify)
              </span>
            )}
          </div>
        </div>
        {editable && hasChanges && (
          <Button
            onClick={savePermissions}
            disabled={saving}
            className="bg-[#1e40af] hover:bg-[#1e3a8a]"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                modules.filter((m) => getAccessLevel(m.id) === "Full Access")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Full Access</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {
                modules.filter((m) => getAccessLevel(m.id) === "Edit Access")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Edit Access</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {
                modules.filter(
                  (m) => getAccessLevel(m.id) === "Create Access"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Create Access</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {
                modules.filter((m) => getAccessLevel(m.id) === "View Only")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">View Only</div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-[#1e40af]" />
            Module Permissions
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Configure access control for role:{" "}
            <Badge className="ml-2 bg-[#1e40af] text-white capitalize">
              {userRole}
            </Badge>
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Module</TableHead>
                  <TableHead className="w-[150px]">Access Level</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                  <TableHead className="text-center">Approve</TableHead>
                  <TableHead className="text-center">Reject</TableHead>
                  <TableHead className="text-center">Export</TableHead>
                  <TableHead className="text-center">Disburse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => {
                  const Icon = module.icon;
                  const accessLevel = getAccessLevel(module.id);

                  return (
                    <TableRow key={module.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-[#1e40af]" />
                          <div>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-xs text-gray-500">
                              {module.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccessBadgeColor(accessLevel)}>
                          {accessLevel}
                        </Badge>
                      </TableCell>
                      {[
                        "view",
                        "create",
                        "edit",
                        "delete",
                        "approve",
                        "reject",
                        "export",
                        "disburse",
                      ].map((action) => {
                        const hasAccess = hasPermission(module.id, action);
                        const isActionAvailable =
                          module.actions.includes(action);

                        return (
                          <TableCell key={action} className="text-center">
                            {isActionAvailable ? (
                              editable ? (
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={hasAccess}
                                    onCheckedChange={() =>
                                      togglePermission(module.id, action)
                                    }
                                    className="data-[state=checked]:bg-[#1e40af]"
                                  />
                                </div>
                              ) : hasAccess ? (
                                <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <XIcon className="h-5 w-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-l-4 border-l-[#1e40af]">
        <CardHeader>
          <CardTitle className="text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {editable ? (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox checked className="data-[state=checked]:bg-[#1e40af]" />
                  <span className="text-sm">Permission Granted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={false} />
                  <span className="text-sm">Permission Denied</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Permission Granted</span>
                </div>
                <div className="flex items-center gap-2">
                  <XIcon className="h-5 w-5 text-red-400" />
                  <span className="text-sm">Permission Denied</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-300 font-bold">-</span>
              <span className="text-sm">Not Applicable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}