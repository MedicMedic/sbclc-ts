import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, TrashIcon } from "lucide-react";
import { User } from "@/polymet/pages/admin-users";
import { Switch } from "@/components/ui/switch";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: "active" | "inactive" | "suspended") => void;
}

export const UserTable: React.FC<Props> = ({ users, onEdit, onDelete, onToggleStatus }) => (
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
      {users.map((u) => (
        <TableRow key={u.id}>
          <TableCell>
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
          </TableCell>
          <TableCell>
            <Badge>{u.role}</Badge>
          </TableCell>
          <TableCell>{u.department}</TableCell>
          <TableCell>
            <Badge className={u.status === "active" ? "bg-green-600" : "bg-gray-400"}>
              {u.status}
            </Badge>
          </TableCell>
          <TableCell className="text-sm">{u.lastLogin}</TableCell>
          <TableCell className="text-sm">{u.createdAt}</TableCell>
          <TableCell className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(u)}>
              <EditIcon className="h-4 w-4" />
            </Button>
            <Switch
              checked={u.status === "active"}
              onCheckedChange={() => onToggleStatus(u.id, u.status)}
            />

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              onClick={() => onDelete(u.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
