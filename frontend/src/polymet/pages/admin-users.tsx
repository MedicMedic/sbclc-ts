"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UserIcon,
  ShieldIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPermissionsManager } from "@/polymet/components/user-permissions-manager";
import { RoleManagement } from "@/polymet/components/role-management";
import client from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import { UserFormDialog } from "@/polymet/components/user-form-dialog";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

interface Role {
  role_id: number;
  role_code: string;
  role_name: string;
  description: string;
  is_active: number;
  user_count: number;
}

export function AdminUsersPage() {
  const { toast } = useToast();

  // State
  const [usersList, setUsersList] = useState<User[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activePermissionTab, setActivePermissionTab] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  /* ============================================================
     🔄 FETCH ROLES FROM BACKEND
  ============================================================ */
  const fetchRoles = async () => {
    try {
      const res = await client.get("/api/roles");
      const roles = res.data as Role[];
      setRolesList(roles);
      
      // Set default active tab to first role if not already set
      if (!activePermissionTab && roles.length > 0) {
        setActivePermissionTab(roles[0].role_code);
      }
    } catch (err) {
      console.error("❌ Failed to load roles:", err);
      toast({
        title: "Failed to load roles",
        description: "Check your connection or backend API.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
     📡 FETCH USERS FROM BACKEND
  ============================================================ */
  const fetchUsers = async () => {
    try {
      const res = await client.get("/api/users");
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const mapped = res.data.map((u: any) => ({
        id: u.user_id?.toString(),
        name: u.full_name,
        email: u.email,
        role: u.role,
        department: u.department || "—",
        status: u.is_active ? "active" : "inactive",
        lastLogin: u.last_login
          ? new Date(u.last_login + "Z").toLocaleString("en-US", {
              timeZone: userTimeZone,
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "Never",
        createdAt: u.created_at
          ? new Date(u.created_at + "Z").toLocaleString("en-US", {
              timeZone: userTimeZone,
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "—",
        permissions: u.permissions || [],
      }));

      setUsersList(mapped);
    } catch (err) {
      console.error("❌ Failed to load users:", err);
      toast({
        title: "Failed to load users",
        description: "Check your connection or backend API.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Refresh roles when tab changes or after role management operations
  const handleRoleManagementChange = () => {
    fetchRoles();
    setRefreshKey(prev => prev + 1); // Force refresh of permissions
  };

  /* ============================================================
     🔍 FILTER LOGIC
  ============================================================ */
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  /* ============================================================
     ➕ CREATE USER (Backend)
  ============================================================ */
  const handleCreateUser = async (data: Partial<User>) => {
    try {
      await client.post("/api/users", {
        email: data.email,
        full_name: data.name,
        role: data.role,
        department: data.department,
      });

      toast({
        title: "User created successfully",
        description: `${data.name} has been added.`,
      });

      fetchUsers();
    } catch (err: any) {
      console.error("❌ Error creating user:", err);
      toast({
        title: "Failed to create user",
        description:
          err?.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
     ✏️ UPDATE USER (Backend)
  ============================================================ */
  const handleEditUser = async (data: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await client.put(`/api/users/${selectedUser.id}`, {
        full_name: data.name,
        role: data.role,
        department: data.department,
        is_active: data.status === "active" ? 1 : 0,
      });

      toast({
        title: "User updated",
        description: `${data.name} was successfully updated.`,
      });

      fetchUsers();
    } catch (err) {
      console.error("❌ Error updating user:", err);
      toast({
        title: "Update failed",
        description: "Unable to update user. Try again later.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
     🗑️ DELETE USER (Backend)
  ============================================================ */
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await client.delete(`/api/users/${userId}`);
      toast({
        title: "User deleted",
        description: "The user has been removed.",
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      toast({
        title: "Delete failed",
        description: "Unable to remove user.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
     🔄 TOGGLE STATUS (Backend)
  ============================================================ */
  const handleToggleStatus = async (userId: string) => {
    const user = usersList.find((u) => u.id === userId);
    if (!user) return;

    const newIsActive = user.status === "active" ? 0 : 1;

    try {
      await client.put(`/api/users/${userId}`, { is_active: newIsActive });
      toast({
        title: `User ${newIsActive === 1 ? "Activated" : "Deactivated"}`,
        description: `The user has been marked as ${newIsActive === 1 ? "active" : "inactive"}.`,
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to toggle user status:", err);
      toast({
        title: "Failed to update status",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
     🎨 HELPER FUNCTIONS
  ============================================================ */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        variant: "default" as const,
        label: "Active",
        className: "bg-green-600",
      },
      inactive: { variant: "secondary" as const, label: "Inactive" },
      suspended: { variant: "destructive" as const, label: "Suspended" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "destructive" as const, label: "Admin" },
      manager: {
        variant: "default" as const,
        label: "Manager",
        className: "bg-purple-600",
      },
      supervisor: {
        variant: "default" as const,
        label: "Supervisor",
        className: "bg-blue-600",
      },
      operator: {
        variant: "default" as const,
        label: "Operator",
        className: "bg-orange-600",
      },
      viewer: { variant: "secondary" as const, label: "Viewer" },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  // Calculate statistics
  const stats = {
    total: usersList.length,
    active: usersList.filter((u) => u.status === "active").length,
    inactive: usersList.filter((u) => u.status === "inactive").length,
    admins: usersList.filter((u) => u.role === "admin").length,
  };

  /* ============================================================
     🖼️ RENDER
  ============================================================ */
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 max-w-2xl">
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="roles">Role Setup</TabsTrigger>
        <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage system users, roles, and permissions
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#1e40af]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-[#1e40af]" />
                <div>
                  <div className="text-2xl font-bold text-[#1e40af]">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-600">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#3b82f6]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-[#3b82f6]" />
                <div>
                  <div className="text-2xl font-bold text-[#3b82f6]">
                    {stats.inactive}
                  </div>
                  <div className="text-sm text-gray-600">Inactive Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#f97316]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ShieldIcon className="h-5 w-5 text-[#f97316]" />
                <div>
                  <div className="text-2xl font-bold text-[#f97316]">
                    {stats.admins}
                  </div>
                  <div className="text-sm text-gray-600">Administrators</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {rolesList.map((role) => (
                    <SelectItem key={role.role_code} value={role.role_code}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-sm">{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={() => handleToggleStatus(user.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
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

        {/* Create User Dialog */}
        <UserFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateUser}
        />

        {/* Edit User Dialog */}
        <UserFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={handleEditUser}
          initialData={selectedUser}
        />
      </TabsContent>

      <TabsContent value="roles" className="space-y-6">
        <RoleManagement 
          onRoleChange={handleRoleManagementChange}
          availableRoles={rolesList}
        />
      </TabsContent>

      <TabsContent value="permissions" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent mb-2">
              Role-Based Permissions
            </h2>
            <p className="text-gray-600">
              Configure module-level access control for different user roles. Changes are saved to the database.
            </p>
          </div>
          <Button
            onClick={() => {
              fetchRoles();
              setRefreshKey(prev => prev + 1);
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh Roles
          </Button>
        </div>

        {rolesList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShieldIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Roles Found
              </h3>
              <p className="text-gray-600 mb-4">
                Create roles in the "Role Setup" tab to configure their permissions here.
              </p>
              <Button
                onClick={() => {
                  const tabsList = document.querySelector('[value="roles"]') as HTMLElement;
                  tabsList?.click();
                }}
                className="bg-[#1e40af] hover:bg-[#1e3a8a]"
              >
                Go to Role Setup
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs 
            value={activePermissionTab} 
            onValueChange={setActivePermissionTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-5xl" style={{ gridTemplateColumns: `repeat(${rolesList.length}, minmax(0, 1fr))` }}>
              {rolesList.map((role) => (
                <TabsTrigger 
                  key={role.role_code} 
                  value={role.role_code}
                  className="capitalize"
                >
                  {role.role_name}
                </TabsTrigger>
              ))}
            </TabsList>

            {rolesList.map((role) => (
              <TabsContent key={role.role_code} value={role.role_code} className="mt-6">
                <UserPermissionsManager 
                  key={`${role.role_code}-${refreshKey}`}
                  userRole={role.role_code} 
                  editable={true} 
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </TabsContent>
    </Tabs>
  );
}