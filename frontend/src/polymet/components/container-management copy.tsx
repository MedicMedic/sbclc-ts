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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusIcon,
  TrashIcon,
  PackageIcon,
  EditIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

interface Container {
  id: string;
  containerNumber: string;
  containerSize: string;
  sku: string;
  quantity: number;
  status:
    | "pending"
    | "in_transit"
    | "arrived"
    | "customs_clearance"
    | "released"
    | "delivered";
  remarks?: string;
}

interface ContainerManagementProps {
  containers?: Container[];
  onContainersChange?: (containers: Container[]) => void;
  className?: string;
}

const containerSizes = [
  { value: "20ft", label: "20ft Standard" },
  { value: "40ft", label: "40ft Standard" },
  { value: "40ft_hc", label: "40ft High Cube" },
  { value: "45ft", label: "45ft High Cube" },
  { value: "20ft_ot", label: "20ft Open Top" },
  { value: "40ft_ot", label: "40ft Open Top" },
  { value: "20ft_fr", label: "20ft Flat Rack" },
  { value: "40ft_fr", label: "40ft Flat Rack" },
];

const containerStatuses = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
  {
    value: "in_transit",
    label: "In Transit",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "arrived", label: "Arrived", color: "bg-green-100 text-green-800" },
  {
    value: "customs_clearance",
    label: "Customs Clearance",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "released",
    label: "Released",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
  },
];

export function ContainerManagement({
  containers = [],
  onContainersChange,
  className = "",
}: ContainerManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContainer, setNewContainer] = useState<Partial<Container>>({
    containerNumber: "",
    containerSize: "",
    sku: "",
    quantity: 0,
    status: "pending",
    remarks: "",
  });

  const handleAddContainer = () => {
    if (
      !newContainer.containerNumber ||
      !newContainer.containerSize ||
      !newContainer.sku
    ) {
      return;
    }

    const container: Container = {
      id: `container_${Date.now()}`,
      containerNumber: newContainer.containerNumber || "",
      containerSize: newContainer.containerSize || "",
      sku: newContainer.sku || "",
      quantity: newContainer.quantity || 0,
      status: (newContainer.status as Container["status"]) || "pending",
      remarks: newContainer.remarks || "",
    };

    const updatedContainers = [...containers, container];
    onContainersChange?.(updatedContainers);

    // Reset form
    setNewContainer({
      containerNumber: "",
      containerSize: "",
      sku: "",
      quantity: 0,
      status: "pending",
      remarks: "",
    });
  };

  const handleRemoveContainer = (id: string) => {
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    onContainersChange?.(updatedContainers);
  };

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
            <PackageIcon className="h-5 w-5" />
            Container Management
          </CardTitle>
          <CardDescription>
            Add and manage multiple containers with detailed tracking
            information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Container Form */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
            <h4 className="font-medium">Add New Container</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-container-number">Container Number *</Label>
                <Input
                  id="new-container-number"
                  value={newContainer.containerNumber}
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      containerNumber: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g., MSKU1234567"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-container-size">Container Size *</Label>
                <Select
                  value={newContainer.containerSize}
                  onValueChange={(value) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      containerSize: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-sku">SKU *</Label>
                <Input
                  id="new-sku"
                  value={newContainer.sku}
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      sku: e.target.value,
                    }))
                  }
                  placeholder="e.g., PROD-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-quantity">Quantity</Label>
                <Input
                  id="new-quantity"
                  type="number"
                  min="0"
                  value={newContainer.quantity}
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select
                  value={newContainer.status}
                  onValueChange={(value) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      status: value as Container["status"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-remarks">Remarks</Label>
                <Input
                  id="new-remarks"
                  value={newContainer.remarks}
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  placeholder="Optional remarks"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleAddContainer}
                disabled={
                  !newContainer.containerNumber ||
                  !newContainer.containerSize ||
                  !newContainer.sku
                }
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Container
              </Button>
            </div>
          </div>

          {/* Containers Table */}
          {containers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Containers ({containers.length})
                </h4>
                <div className="text-sm text-muted-foreground">
                  Total Quantity:{" "}
                  {containers.reduce((sum, c) => sum + c.quantity, 0)}
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Container Number</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {containers.map((container) => (
                      <ContainerRow
                        key={container.id}
                        container={container}
                        isEditing={editingId === container.id}
                        onEdit={() => handleEditContainer(container.id)}
                        onSave={(updatedContainer) =>
                          handleSaveEdit(container.id, updatedContainer)
                        }
                        onCancel={handleCancelEdit}
                        onRemove={() => handleRemoveContainer(container.id)}
                        onStatusChange={(status) =>
                          handleStatusChange(container.id, status)
                        }
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {containers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <PackageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />

              <p>No containers added yet</p>
              <p className="text-sm">
                Add your first container using the form above
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Container Row Component for editing
interface ContainerRowProps {
  container: Container;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (container: Partial<Container>) => void;
  onCancel: () => void;
  onRemove: () => void;
  onStatusChange: (status: Container["status"]) => void;
}

function ContainerRow({
  container,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onStatusChange,
}: ContainerRowProps) {
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
        <TableCell>
          <Input
            value={editData.containerNumber}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                containerNumber: e.target.value.toUpperCase(),
              }))
            }
            className="font-mono text-sm"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.containerSize}
            onValueChange={(value) =>
              setEditData((prev) => ({ ...prev, containerSize: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {containerSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            value={editData.sku}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, sku: e.target.value }))
            }
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            min="0"
            value={editData.quantity}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value) || 0,
              }))
            }
            className="text-sm"
          />
        </TableCell>
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
            value={editData.remarks}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, remarks: e.target.value }))
            }
            className="text-sm"
            placeholder="Optional"
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
      <TableCell className="font-mono text-sm">
        {container.containerNumber}
      </TableCell>
      <TableCell className="text-sm">
        {containerSizes.find((s) => s.value === container.containerSize)
          ?.label || container.containerSize}
      </TableCell>
      <TableCell className="text-sm">{container.sku}</TableCell>
      <TableCell className="text-sm">{container.quantity}</TableCell>
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
      <TableCell className="text-sm text-muted-foreground">
        {container.remarks || "-"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
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
              <p>Edit container</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove container</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
