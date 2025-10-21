import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  ShieldIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import client from "@/api/client";
import { useToast } from "@/components/ui/use-toast";

interface Role {
  role_id: number;
  role_code: string;
  role_name: string;
  description: string;
  is_active: number;
  user_count: number;
  created_at?: string;
  modules?: Record<string, string[]>;
}

interface RoleManagementProps {
  onRoleChange?: () => void;
  availableRoles?: Role[];
}

const availableModules = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "View system dashboard and statistics",
    permissions: ["view"],
  },
  {
    id: "quotations",
    name: "Quotations",
    description: "Manage quotations and pricing",
    permissions: ["view", "create", "edit", "delete", "approve"],
  },
  {
    id: "bookings",
    name: "Bookings",
    description: "Manage import and domestic bookings",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "monitoring",
    name: "Monitoring",
    description: "Track shipments and deliveries",
    permissions: ["view", "edit", "export"],
  },
  {
    id: "cash_advance",
    name: "Cash Advance",
    description: "Manage cash advance requests",
    permissions: ["view", "create", "edit", "delete", "approve", "disburse"],
  },
  {
    id: "billing",
    name: "Billing",
    description: "Generate and manage invoices",
    permissions: ["view", "create", "edit", "delete", "approve"],
  },
  {
    id: "collection_monitoring",
    name: "Collection Monitoring",
    description: "Track payments and collections",
    permissions: ["view", "edit", "export"],
  },
  {
    id: "approvals",
    name: "Approvals",
    description: "Approve transactions and requests",
    permissions: ["view", "approve", "reject"],
  },
  {
    id: "reports",
    name: "Reports",
    description: "Generate and view reports",
    permissions: ["view", "export"],
  },
  {
    id: "admin_users",
    name: "User Management",
    description: "Manage system users",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "master_setup",
    name: "Master Setup",
    description: "Configure system settings",
    permissions: ["view", "create", "edit", "delete"],
  },
];

const permissionLabels: Record<string, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
  reject: "Reject",
  export: "Export",
  disburse: "Disburse",
};

export function RoleManagement({ onRoleChange }: RoleManagementProps) {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<{
    role_code: string;
    role_name: string;
    description: string;
    modules: Record<string, string[]>;
    is_active: boolean;
  }>({
    role_code: "",
    role_name: "",
    description: "",
    modules: {},
    is_active: true,
  });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const [rolesRes] = await Promise.all([client.get("/api/roles")]);
      
      const rolesWithPermissions = await Promise.all(
        rolesRes.data.map(async (role: Role) => {
          try {
            if (!role.role_code || role.role_code.trim() === '') {
              console.warn(`⚠️ Skipping role with invalid role_code:`, role);
              return { ...role, modules: {} };
            }
            
            const permsRes = await client.get(`/api/roles/${role.role_code}/permissions`);
            return { ...role, modules: permsRes.data };
          } catch (err) {
            console.warn(`⚠️ Failed to load permissions for ${role.role_code}:`, err);
            return { ...role, modules: {} };
          }
        })
      );

      setRoles(rolesWithPermissions);
    } catch (err) {
      console.error("❌ Failed to load roles:", err);
      toast({
        title: "Failed to load roles",
        description: "Could not fetch roles from server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    try {
      if (!formData.role_code || !formData.role_name) {
        toast({
          title: "Validation Error",
          description: "Role code and name are required.",
          variant: "destructive",
        });
        return;
      }

      if (!/^[a-z0-9_]+$/.test(formData.role_code)) {
        toast({
          title: "Validation Error",
          description: "Role code can only contain lowercase letters, numbers, and underscores.",
          variant: "destructive",
        });
        return;
      }

      if (formData.role_code.length < 3) {
        toast({
          title: "Validation Error",
          description: "Role code must be at least 3 characters long.",
          variant: "destructive",
        });
        return;
      }

      if (Object.keys(formData.modules).length === 0) {
        toast({
          title: "Validation Error",
          description: "Please assign at least one module permission.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await client.post("/api/roles", formData);
      
      toast({
        title: "Role created",
        description: `${formData.role_name} has been created successfully.`,
      });

      setShowCreateDialog(false);
      resetForm();
      fetchRoles();
      
      if (onRoleChange) {
        onRoleChange();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "An error occurred.";
      
      toast({
        title: "Failed to create role",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;

    try {
      await client.put(`/api/roles/${selectedRole.role_id}`, formData);
      
      toast({
        title: "Role updated",
        description: `${formData.role_name} has been updated successfully.`,
      });

      setShowEditDialog(false);
      setSelectedRole(null);
      resetForm();
      fetchRoles();
      
      if (onRoleChange) {
        onRoleChange();
      }
    } catch (err: any) {
      toast({
        title: "Failed to update role",
        description: err?.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteDialog(true);
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      await client.delete(`/api/roles/${selectedRole.role_id}`);
      
      toast({
        title: "Role deleted",
        description: `${selectedRole.role_name} has been permanently deleted.`,
      });

      setShowDeleteDialog(false);
      setSelectedRole(null);
      fetchRoles();
      
      if (onRoleChange) {
        onRoleChange();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "An error occurred while deleting the role.";
      
      toast({
        title: "Failed to delete role",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (errorMessage.includes("users are assigned")) {
        setShowDeleteDialog(false);
        setSelectedRole(null);
      }
    }
  };

  const handleToggleActive = async (roleId: number, currentStatus: number) => {
    try {
      await client.put(`/api/roles/${roleId}`, {
        is_active: currentStatus === 1 ? 0 : 1,
      });

      toast({
        title: "Status updated",
        description: "Role status has been updated.",
      });

      fetchRoles();
      
      if (onRoleChange) {
        onRoleChange();
      }
    } catch (err) {
      toast({
        title: "Failed to update status",
        description: "Could not update role status.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      role_code: "",
      role_name: "",
      description: "",
      modules: {},
      is_active: true,
    });
  };

  const openEditDialog = async (role: Role) => {
    try {
      const permsRes = await client.get(`/api/roles/${role.role_code}/permissions`);
      
      setSelectedRole(role);
      setFormData({
        role_code: role.role_code,
        role_name: role.role_name,
        description: role.description || "",
        modules: permsRes.data || {},
        is_active: role.is_active === 1,
      });
      setShowEditDialog(true);
    } catch (err) {
      toast({
        title: "Failed to load role",
        description: "Could not fetch role permissions.",
        variant: "destructive",
      });
    }
  };

  const toggleModulePermission = (moduleId: string, permission: string) => {
    const currentPermissions = formData.modules[moduleId] || [];
    const hasPermission = currentPermissions.includes(permission);

    const updatedPermissions = hasPermission
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];

    setFormData({
      ...formData,
      modules: {
        ...formData.modules,
        [moduleId]: updatedPermissions,
      },
    });
  };

  const toggleModuleAccess = (moduleId: string, enabled: boolean) => {
    if (enabled) {
      setFormData({
        ...formData,
        modules: {
          ...formData.modules,
          [moduleId]: ["view"],
        },
      });
    } else {
      const { [moduleId]: removed, ...rest } = formData.modules;
      setFormData({
        ...formData,
        modules: rest,
      });
    }
  };

  const getModuleAccessCount = (role: Role) => {
    return Object.keys(role.modules || {}).length;
  };

  const getPermissionCount = (role: Role) => {
    if (!role.modules) return 0;
    return Object.values(role.modules).reduce(
      (sum, perms) => sum + perms.length,
      0
    );
  };

  const stats = {
    total: roles.length,
    active: roles.filter((r) => r.is_active === 1).length,
    inactive: roles.filter((r) => r.is_active === 0).length,
    totalUsers: roles.reduce((sum, r) => sum + (r.user_count || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Role Management
          </h2>
          <p className="text-gray-600">
            Configure user roles and their module access permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#1e40af]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldIcon className="h-5 w-5 text-[#1e40af]" />
              <div>
                <div className="text-2xl font-bold text-[#1e40af]">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#f97316]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-5 w-5 text-[#f97316]" />
              <div>
                <div className="text-2xl font-bold text-[#f97316]">{stats.inactive}</div>
                <div className="text-sm text-gray-600">Inactive Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#3b82f6]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldIcon className="h-5 w-5 text-[#3b82f6]" />
              <div>
                <div className="text-2xl font-bold text-[#3b82f6]">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Assigned Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.role_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <ShieldIcon className="h-4 w-4 text-[#1e40af]" />
                      <span className="font-medium">{role.role_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate">
                      {role.description || "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getModuleAccessCount(role)} modules
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPermissionCount(role)} permissions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#3b82f6]">
                      {role.user_count || 0} users
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {role.is_active === 1 ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(role)}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={role.is_active === 1}
                        onCheckedChange={() => handleToggleActive(role.role_id, role.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(role)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        title="Permanently delete role"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role and configure its module access permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roleCode">Role Code</Label>
                <Input
                  id="roleCode"
                  value={formData.role_code}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    setFormData({ ...formData, role_code: value });
                  }}
                  placeholder="e.g., operations_manager"
                />
                <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and underscores only</p>
              </div>
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={formData.role_name}
                  onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                  placeholder="e.g., Operations Manager"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role's responsibilities and purpose"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">
                Module Access & Permissions
              </Label>
              <div className="space-y-4 border rounded-lg p-4 max-h-96 overflow-y-auto">
                {availableModules.map((module) => {
                  const hasAccess = !!formData.modules[module.id];
                  const modulePermissions = formData.modules[module.id] || [];

                  return (
                    <div key={module.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={hasAccess}
                            onCheckedChange={(checked) => toggleModuleAccess(module.id, checked)}
                          />
                          <div>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-sm text-gray-500">{module.description}</div>
                          </div>
                        </div>
                      </div>
                      {hasAccess && (
                        <div className="ml-11 flex flex-wrap gap-2">
                          {module.permissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                checked={modulePermissions.includes(permission)}
                                onCheckedChange={() => toggleModulePermission(module.id, permission)}
                              />
                              <Label className="text-sm cursor-pointer">
                                {permissionLabels[permission] || permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateRole}
                disabled={!formData.role_code || !formData.role_name || Object.keys(formData.modules).length === 0}
                className="bg-[#1e40af] hover:bg-[#1e3a8a]"
              >
                Create Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role - {selectedRole?.role_name}</DialogTitle>
            <DialogDescription>
              Modify role details and configure module access permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editRoleCode">Role Code</Label>
                <Input
                  id="editRoleCode"
                  value={formData.role_code}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="editRoleName">Role Name</Label>
                <Input
                  id="editRoleName"
                  value={formData.role_name}
                  onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                  placeholder="e.g., Operations Manager"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editRoleDescription">Description</Label>
              <Textarea
                id="editRoleDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role's responsibilities and purpose"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">
                Module Access & Permissions
              </Label>
              <div className="space-y-4 border rounded-lg p-4 max-h-96 overflow-y-auto">
                {availableModules.map((module) => {
                  const hasAccess = !!formData.modules[module.id];
                  const modulePermissions = formData.modules[module.id] || [];

                  return (
                    <div key={module.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={hasAccess}
                            onCheckedChange={(checked) => toggleModuleAccess(module.id, checked)}
                          />
                          <div>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-sm text-gray-500">{module.description}</div>
                          </div>
                        </div>
                      </div>
                      {hasAccess && (
                        <div className="ml-11 flex flex-wrap gap-2">
                          {module.permissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                checked={modulePermissions.includes(permission)}
                                onCheckedChange={() => toggleModulePermission(module.id, permission)}
                              />
                              <Label className="text-sm cursor-pointer">
                                {permissionLabels[permission] || permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedRole(null); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleEditRole}
                disabled={!formData.role_name || Object.keys(formData.modules).length === 0}
                className="bg-[#1e40af] hover:bg-[#1e3a8a]"
              >
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangleIcon className="h-5 w-5" />
              Permanently Delete Role?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-semibold mb-2">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-sm text-red-700">
                You are about to permanently delete the role:
              </p>
              <div className="mt-3 p-3 bg-white rounded border border-red-200">
                <div className="font-semibold text-gray-900">
                  {selectedRole?.role_name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Code: {selectedRole?.role_code}
                </div>
                {selectedRole && (
                  <div className="text-sm text-gray-600">
                    {getModuleAccessCount(selectedRole)} modules • {getPermissionCount(selectedRole)} permissions
                  </div>
                )}
              </div>
            </div>

            {selectedRole && selectedRole.user_count > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  👥 Users Assigned
                </p>
                <p className="text-sm text-yellow-700">
                  This role has <strong>{selectedRole.user_count} user(s)</strong> assigned to it.
                  You must reassign these users to another role before you can delete this role.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-gray-700 font-medium">
                This will permanently delete:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• The role definition</li>
                <li>• All associated permissions</li>
                <li>• All permission mappings</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedRole(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRole}
              disabled={selectedRole ? selectedRole.user_count > 0 : false}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {selectedRole && selectedRole.user_count > 0
                ? "Cannot Delete"
                : "Delete Permanently"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}