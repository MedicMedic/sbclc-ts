import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/polymet/pages/admin-users";
import client from "@/api/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<User>) => void;
  initialData?: User | null;
}

const roles = [
  { id: "admin", name: "System Administrator" },
  { id: "manager", name: "Department Manager" },
  { id: "supervisor", name: "Supervisor" },
  { id: "operator", name: "Operator" },
  { id: "viewer", name: "Viewer" },
];

const departments = [
  "Booking",
  "Operations",
  "Customs",
  "Finance",
  "Accounting",
  "IT",
  "Management",
];

const allPermissions = [
  { id: "read", name: "Read Access", description: "View data and reports" },
  { id: "write", name: "Write Access", description: "Create and edit records" },
  { id: "write_own", name: "Write Own", description: "Edit only own records" },
  { id: "approve", name: "Approval Rights", description: "Approve transactions" },
  { id: "admin", name: "Admin Access", description: "System administration" },
  { id: "all", name: "Full Access", description: "Complete system access" },
];

export const UserFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "active" as "active" | "inactive" | "suspended",
    permissions: [] as string[],
  });

  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        department: initialData.department,
        status: initialData.status,
        permissions: initialData.permissions || [],
      });
      // Fetch permissions for the initial role
      if (initialData.role) {
        fetchRolePermissions(initialData.role);
      }
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      status: "active",
      permissions: [],
    });
  };

  // ✅ Fetch permissions from backend when role changes
  const fetchRolePermissions = async (roleCode: string) => {
    setLoadingPermissions(true);
    try {
      const response = await client.get(`/api/roles/${roleCode}/permissions`);
      const rolePermissions = response.data; // { module_id: [actions] }
      
      // Convert backend format to frontend permission IDs
      const permissionIds = new Set<string>();
      
      // Map backend actions to frontend permission IDs
      const actionMapping: Record<string, string> = {
        view: "read",
        create: "write",
        edit: "write_own",
        approve: "approve",
        delete: "admin",
      };

      Object.entries(rolePermissions).forEach(([moduleId, actions]: [string, any]) => {
        actions.forEach((action: string) => {
          const frontendId = actionMapping[action] || action;
          permissionIds.add(frontendId);
        });
      });

      // Check if all permissions are granted (for "all" checkbox)
      const hasAllPerms = allPermissions
        .filter((p) => p.id !== "all")
        .every((p) => permissionIds.has(p.id));

      if (hasAllPerms) {
        permissionIds.add("all");
      }

      setFormData((prev) => ({
        ...prev,
        permissions: Array.from(permissionIds),
      }));
    } catch (error) {
      console.error("Failed to fetch role permissions:", error);
      setFormData((prev) => ({ ...prev, permissions: [] }));
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleRoleChange = (roleId: string) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
    fetchRolePermissions(roleId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      username: formData.email,
      lastLogin: initialData?.lastLogin || "Never",
      createdAt: initialData?.createdAt || new Date().toISOString().split("T")[0],
    };

    onSubmit(payload);
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Edit User - ${initialData.name}` : "Add New User"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="Enter email address"
                required
                disabled={!!initialData} // Disable email editing for existing users
              />
            </div>
          </div>

          {/* Role + Dept */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, department: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissions - READ ONLY based on role */}
          <div>
            <Label>
              Permissions 
              {loadingPermissions && (
                <span className="ml-2 text-sm text-gray-500">(Loading...)</span>
              )}
            </Label>
            <div className="text-xs text-gray-600 mb-2">
              Based on selected role - read only
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded border">
              {allPermissions.map((perm) => (
                <div key={perm.id} className="flex items-center space-x-2 opacity-75">
                  <input
                    type="checkbox"
                    id={perm.id}
                    checked={formData.permissions.includes(perm.id)}
                    readOnly
                    disabled
                    className="rounded cursor-not-allowed"
                  />
                  <label htmlFor={perm.id} className="text-sm cursor-not-allowed">
                    {perm.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              💡 Permissions are automatically assigned based on the user&apos;s role. 
              To modify permissions, change the role or update role permissions in the 
              Role Permissions tab.
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loadingPermissions}>
              {initialData ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};