import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  Loader2,
} from "lucide-react";
import masterdataApi from "@/api/masterdataApi";
import { useToast } from "@/hooks/use-toast";

interface MilestonesSetupSectionProps {
  onAdd?: (type: string) => void;
  onView?: (item: any, type: string) => void;
  onEdit?: (item: any, type: string) => void;
  onDelete?: (id: string, type: string) => void;
}

export function MilestonesSetupSection({
  onAdd,
  onView,
  onEdit,
  onDelete,
}: MilestonesSetupSectionProps) {
  const [activeTab, setActiveTab] = useState("import");
  const [loading, setLoading] = useState(false);
  const [importMilestones, setImportMilestones] = useState<any[]>([]);
  const [truckingMilestones, setTruckingMilestones] = useState<any[]>([]);
  const [forwardingMilestones, setForwardingMilestones] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMilestones(activeTab);
  }, [activeTab]);

  const fetchMilestones = async (serviceType: string) => {
    setLoading(true);
    try {
      const response = await masterdataApi.milestones.getAll(serviceType);
      const milestones = response.data;

      const sorted = milestones.sort(
        (a: any, b: any) => a.sequence_order - b.sequence_order
      );

      switch (serviceType) {
        case "import":
          setImportMilestones(sorted);
          break;
        case "domestic_trucking":
          setTruckingMilestones(sorted);
          break;
        case "domestic_forwarding":
          setForwardingMilestones(sorted);
          break;
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
      toast({
        title: "Error",
        description: "Failed to load milestones. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type: string) => {
    onAdd?.(type);
  };

  const handleView = (milestone: any, baseType: string) => {
    const transformedMilestone = {
      ...milestone,
      name: milestone.milestone_name,
      code: milestone.milestone_code,
      order: milestone.sequence_order,
      estimatedDays: milestone.estimated_days,
      notifyBefore: milestone.notify_before_days,
      required: milestone.is_required === 1,
      active: milestone.is_active === 1,
    };

    const typeMap: Record<string, string> = {
      import: "import-milestone",
      trucking: "trucking-milestone",
      forwarding: "forwarding-milestone",
    };

    const dialogType = typeMap[baseType] || "import-milestone";
    onView?.(transformedMilestone, dialogType);
  };

  const handleEdit = (milestone: any, baseType: string) => {
    const transformedMilestone = {
      ...milestone,
      name: milestone.milestone_name,
      code: milestone.milestone_code,
      order: milestone.sequence_order,
      estimatedDays: milestone.estimated_days,
      notifyBefore: milestone.notify_before_days,
      required: milestone.is_required === 1,
      active: milestone.is_active === 1,
    };

    const typeMap: Record<string, string> = {
      import: "import-milestone",
      trucking: "trucking-milestone",
      forwarding: "forwarding-milestone",
    };

    const dialogType = typeMap[baseType] || "import-milestone";
    onEdit?.(transformedMilestone, dialogType);
  };

  const handleDelete = async (id: string, type: string, serviceType: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    setLoading(true);
    try {
      await masterdataApi.milestones.delete(id);
      toast({
        title: "Success",
        description: "Milestone deleted successfully!",
      });
      fetchMilestones(serviceType);
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Error",
        description: "Failed to delete milestone. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMilestoneCard = (
    milestone: any,
    type: string,
    serviceType: string
  ) => (
    <Card key={milestone.milestone_id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e40af] text-white font-semibold text-sm">
              {milestone.sequence_order}
            </div>
            <div>
              <CardTitle className="text-base">
                {milestone.milestone_name}
              </CardTitle>
              <Badge variant="outline" className="mt-1">
                {milestone.milestone_code}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(milestone, type)}
              disabled={loading}
              title="View details"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(milestone, type)}
              disabled={loading}
              title="Edit"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDelete(milestone.milestone_id, `${type} milestone`, serviceType)
              }
              disabled={loading}
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {milestone.description || "No description"}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-xs text-gray-500">Required</span>
                <p className="text-sm font-medium">
                  {milestone.is_required ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-xs text-gray-500">Est. Days</span>
                <p className="text-sm font-medium">
                  {milestone.estimated_days || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-xs text-gray-500">Notify Before</span>
                <p className="text-sm font-medium">
                  {milestone.notify_before_days || 0} day
                  {milestone.notify_before_days !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-4" />
              <div>
                <span className="text-xs text-gray-500">Status</span>
                <Badge
                  className={
                    milestone.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {milestone.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderImportMilestones = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Import Milestones</h3>
          <p className="text-sm text-gray-600">
            Manage milestone tracking for import brokerage and forwarding
          </p>
        </div>
        <Button
          onClick={() => handleAdd("import-milestone")}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1e40af]" />
        </div>
      ) : importMilestones.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <AlertCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No import milestones found</p>
          <Button
            onClick={() => handleAdd("import-milestone")}
            variant="outline"
            className="mt-4"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First Milestone
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {importMilestones.map((milestone) =>
            renderMilestoneCard(milestone, "import", "import")
          )}
        </div>
      )}
    </div>
  );

  const renderTruckingMilestones = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Domestic Trucking Milestones
          </h3>
          <p className="text-sm text-gray-600">
            Manage milestone tracking for domestic trucking services
          </p>
        </div>
        <Button
          onClick={() => handleAdd("trucking-milestone")}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1e40af]" />
        </div>
      ) : truckingMilestones.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <AlertCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No trucking milestones found</p>
          <Button
            onClick={() => handleAdd("trucking-milestone")}
            variant="outline"
            className="mt-4"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First Milestone
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {truckingMilestones.map((milestone) =>
            renderMilestoneCard(milestone, "trucking", "domestic_trucking")
          )}
        </div>
      )}
    </div>
  );

  const renderForwardingMilestones = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Domestic Forwarding Milestones
          </h3>
          <p className="text-sm text-gray-600">
            Manage milestone tracking for domestic forwarding services
          </p>
        </div>
        <Button
          onClick={() => handleAdd("forwarding-milestone")}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1e40af]" />
        </div>
      ) : forwardingMilestones.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <AlertCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No forwarding milestones found</p>
          <Button
            onClick={() => handleAdd("forwarding-milestone")}
            variant="outline"
            className="mt-4"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First Milestone
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forwardingMilestones.map((milestone) =>
            renderMilestoneCard(milestone, "forwarding", "domestic_forwarding")
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Milestone Configuration</h3>
        <p className="text-sm text-gray-600">
          Configure milestone tracking for different service types
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            Import
          </TabsTrigger>
          <TabsTrigger
            value="domestic_trucking"
            className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
          >
            Domestic Trucking
          </TabsTrigger>
          <TabsTrigger
            value="domestic_forwarding"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Domestic Forwarding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import">{renderImportMilestones()}</TabsContent>
        <TabsContent value="domestic_trucking">
          {renderTruckingMilestones()}
        </TabsContent>
        <TabsContent value="domestic_forwarding">
          {renderForwardingMilestones()}
        </TabsContent>
      </Tabs>
    </div>
  );
}