// frontend/lib/permissions.ts
import client from "@/api/client";

export interface RolePermissions {
  [moduleId: string]: string[]; // e.g., { "dashboard": ["view", "edit"] }
}

// Map frontend permission IDs to backend action names
const permissionMapping: Record<string, string> = {
  read: "view",
  write: "create",
  write_own: "edit",
  approve: "approve",
  admin: "delete",
  all: "all",
};

// Reverse mapping for display purposes
const reverseMapping: Record<string, string> = {
  view: "read",
  create: "write",
  edit: "write_own",
  approve: "approve",
  delete: "admin",
  all: "all",
};

/**
 * Fetch permissions for a specific role from the backend
 */
export async function getRolePermissions(roleCode: string): Promise<string[]> {
  try {
    const response = await client.get(`/api/roles/${roleCode}/permissions`);
    const permissions: RolePermissions = response.data;

    // Convert backend format to frontend permission IDs
    const permissionIds = new Set<string>();

    Object.entries(permissions).forEach(([moduleId, actions]) => {
      actions.forEach((action) => {
        const frontendId = reverseMapping[action] || action;
        permissionIds.add(frontendId);
      });
    });

    return Array.from(permissionIds);
  } catch (error) {
    console.error("Failed to fetch role permissions:", error);
    return [];
  }
}

/**
 * Get all module permissions structured for the permission manager
 */
export async function getAllPermissions(): Promise<Record<string, Record<string, string[]>>> {
  try {
    const response = await client.get("/api/permissions");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all permissions:", error);
    return {};
  }
}

/**
 * Check if a role has a specific permission for a module
 */
export function hasPermission(
  rolePermissions: RolePermissions,
  moduleId: string,
  action: string
): boolean {
  const modulePerms = rolePermissions[moduleId];
  if (!modulePerms) return false;
  return modulePerms.includes(action);
}

/**
 * Get permission categories for easier grouping
 */
export const permissionCategories = {
  basic: ["read", "write", "write_own"],
  advanced: ["approve", "admin"],
  all: ["all"],
};

/**
 * Convert frontend permission format to backend format
 */
export function convertToBackendPermissions(
  frontendPermissions: string[]
): Record<string, string[]> {
  // This would need module context to properly map permissions
  // For now, return a basic structure
  const result: Record<string, string[]> = {};
  
  // You'll need to customize this based on your actual module structure
  frontendPermissions.forEach((perm) => {
    const backendAction = permissionMapping[perm] || perm;
    // Add to all modules that support this action
    // This is a simplified version - you should maintain a proper module-action mapping
  });

  return result;
}