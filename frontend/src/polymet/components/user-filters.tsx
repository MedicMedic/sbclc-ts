import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

interface Props {
  filters: { search: string; role: string; status: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ search: string; role: string; status: string }>
  >;
}

const roles = ["admin", "manager", "supervisor", "operator", "viewer"];
const statuses = ["active", "inactive", "suspended"];

export const UserFilters: React.FC<Props> = ({ filters, setFilters }) => (
  <Card>
    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="pl-10"
        />
      </div>

      <Select
        value={filters.role}
        onValueChange={(v) => setFilters((f) => ({ ...f, role: v }))}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardContent>
  </Card>
);
