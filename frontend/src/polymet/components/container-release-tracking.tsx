import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PackageIcon,
  EditIcon,
  CheckIcon,
  XIcon,
  TruckIcon,
  CalendarIcon,
} from "lucide-react";

interface Container {
  id: string;
  containerNumber: string;
  containerSize: string;
  status: "pending" | "do_released" | "pulled_out" | "delivered" | "completed";
  doReleased: string;
  pulloutReport: string;
  deliveryToWarehouse: string;
  gating: string;
  emptyPullout: string;
  billed: string;
  remarks?: string;
}

interface ContainerReleaseTrackingProps {
  containers?: Container[];
  onContainersChange?: (containers: Container[]) => void;
  className?: string;
}

const containerStatuses = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
  {
    value: "do_released",
    label: "DO Released",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "pulled_out",
    label: "Pulled Out",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
  },
];

export function ContainerReleaseTracking({
  containers = [],
  onContainersChange,
  className = "",
}: ContainerReleaseTrackingProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditContainer = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string, updatedContainer: Partial<Container>) => {
    const updatedContainers = containers.map((container) =>
      container.id === id ? { ...container, ...updatedContainer } : container
    );
    onContainersChange?.(updatedContainers);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleStatusChange = (id: string, status: Container["status"]) => {
    const updatedContainers = containers.map((container) =>
      container.id === id ? { ...container, status } : container
    );
    onContainersChange?.(updatedContainers);
  };

  const getStatusBadge = (status: Container["status"]) => {
    const statusConfig = containerStatuses.find((s) => s.value === status);
    return (
      <Badge
        variant="secondary"
        className={statusConfig?.color || "bg-gray-100 text-gray-800"}
      >
        {statusConfig?.label || status}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            Container Release & Delivery Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {containers.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Container No.</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>DO Released</TableHead>
                    <TableHead>Pullout Report</TableHead>
                    <TableHead>Delivery to Warehouse</TableHead>
                    <TableHead>Gating</TableHead>
                    <TableHead>Empty Pullout</TableHead>
                    <TableHead>Billed</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {containers.map((container) => (
                    <ContainerReleaseRow
                      key={container.id}
                      container={container}
                      isEditing={editingId === container.id}
                      onEdit={() => handleEditContainer(container.id)}
                      onSave={(updatedContainer) =>
                        handleSaveEdit(container.id, updatedContainer)
                      }
                      onCancel={handleCancelEdit}
                      onStatusChange={(status) =>
                        handleStatusChange(container.id, status)
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <PackageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />

              <p>No containers to track</p>
              <p className="text-sm">
                Container information will be loaded from the booking
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Container Release Row Component for editing
interface ContainerReleaseRowProps {
  container: Container;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (container: Partial<Container>) => void;
  onCancel: () => void;
  onStatusChange: (status: Container["status"]) => void;
}

function ContainerReleaseRow({
  container,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onStatusChange,
}: ContainerReleaseRowProps) {
  const [editData, setEditData] = useState<Container>(container);

  const handleSave = () => {
    onSave(editData);
  };

  const getStatusBadge = (status: Container["status"]) => {
    const statusConfig = containerStatuses.find((s) => s.value === status);
    return (
      <Badge
        variant="secondary"
        className={statusConfig?.color || "bg-gray-100 text-gray-800"}
      >
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell className="font-mono text-sm">
          {container.containerNumber}
        </TableCell>
        <TableCell className="text-sm">{container.containerSize}</TableCell>
        <TableCell>
          <Select
            value={editData.status}
            onValueChange={(value) =>
              setEditData((prev) => ({
                ...prev,
                status: value as Container["status"],
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {containerStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.doReleased}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, doReleased: e.target.value }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.pulloutReport}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                pulloutReport: e.target.value,
              }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.deliveryToWarehouse}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                deliveryToWarehouse: e.target.value,
              }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.gating}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, gating: e.target.value }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.emptyPullout}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, emptyPullout: e.target.value }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.billed}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, billed: e.target.value }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Textarea
            value={editData.remarks}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, remarks: e.target.value }))
            }
            className="text-sm min-h-[60px]"
            placeholder="Optional remarks"
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 w-8 p-0"
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save changes</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 w-8 p-0"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-sm font-medium">
        {container.containerNumber}
      </TableCell>
      <TableCell className="text-sm">{container.containerSize}</TableCell>
      <TableCell>
        <Select value={container.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full border-none bg-transparent p-0 h-auto">
            {getStatusBadge(container.status)}
          </SelectTrigger>
          <SelectContent>
            {containerStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-sm">{container.doReleased || "-"}</TableCell>
      <TableCell className="text-sm">
        {container.pulloutReport || "-"}
      </TableCell>
      <TableCell className="text-sm">
        {container.deliveryToWarehouse || "-"}
      </TableCell>
      <TableCell className="text-sm">{container.gating || "-"}</TableCell>
      <TableCell className="text-sm">{container.emptyPullout || "-"}</TableCell>
      <TableCell className="text-sm">{container.billed || "-"}</TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-[150px]">
        <div className="truncate" title={container.remarks}>
          {container.remarks || "-"}
        </div>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit container details</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
