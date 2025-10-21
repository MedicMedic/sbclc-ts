import React, { useState, useEffect } from "react";
import masterdataApi from "@/api/masterdataApi.ts";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { users } from "@/polymet/data/logistics-data";

interface ApprovalRule {
  id: string;
  transactionType: string;
  department: string;
  minAmount: number;
  maxAmount: number;
  approvers: ApproverLevel[];
  active: boolean;
}

interface ApproverLevel {
  level: number;
  role: string;
  userId?: string;
  required: boolean;
  canDelegate: boolean;
}

export function ApproverMatrixSetup() {
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [activeTab, setActiveTab] = useState("quotation");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const transactionTypes = [
    { id: "quotation", name: "Quotation", icon: "📋" },
    { id: "cost_analysis", name: "Cost Analysis", icon: "📊" },
    { id: "cash_advance", name: "Cash Advance", icon: "💰" },
    { id: "soa", name: "Statement of Account", icon: "📄" },
    { id: "service_invoice", name: "Service Invoice", icon: "🧾" },
    { id: "booking", name: "Booking", icon: "📦" },
  ];

  const departments = [
    "All Departments",
    "Booking",
    "Operations",
    "Customs",
    "Finance",
    "Accounting",
    "Management",
  ];

  const roles = [
    { id: "supervisor", name: "Supervisor" },
    { id: "manager", name: "Department Manager" },
    { id: "head", name: "Department Head" },
    { id: "finance_manager", name: "Finance Manager" },
    { id: "cfo", name: "Chief Financial Officer" },
    { id: "ceo", name: "Chief Executive Officer" },
  ];

  const [formData, setFormData] = useState<ApprovalRule>({
    id: "",
    transactionType: "",
    department: "All Departments",
    minAmount: 0,
    maxAmount: 999999999,
    approvers: [{ level: 1, role: "", required: true, canDelegate: false }],
    active: true,
  });

  // ================================
  // Fetch & Sync with Backend
  // ================================
  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await masterdataApi.approvalMatrix.getAll();
      setRules(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load approval rules.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // ================================
  // Form Handlers
  // ================================
  const handleAddApproverLevel = () => {
    setFormData({
      ...formData,
      approvers: [
        ...formData.approvers,
        {
          level: formData.approvers.length + 1,
          role: "",
          required: true,
          canDelegate: false,
        },
      ],
    });
  };

  const handleRemoveApproverLevel = (level: number) => {
    setFormData({
      ...formData,
      approvers: formData.approvers
        .filter((a) => a.level !== level)
        .map((a, index) => ({ ...a, level: index + 1 })),
    });
  };

  const handleUpdateApprover = (level: number, field: string, value: any) => {
    setFormData({
      ...formData,
      approvers: formData.approvers.map((a) =>
        a.level === level ? { ...a, [field]: value } : a
      ),
    });
  };

  const handleSave = async () => {
    try {
      if (editingRule) {
        await masterdataApi.approvalMatrix.update(editingRule.id, formData);
        toast({
          title: "Success",
          description: "Approval rule updated successfully.",
        });
      } else {
        await masterdataApi.approvalMatrix.create(formData);
        toast({
          title: "Success",
          description: "Approval rule created successfully.",
        });
      }
      resetForm();
      fetchRules();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save approval rule.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowDialog(true);
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this approval rule?")) return;
    try {
      await masterdataApi.approvalMatrix.delete(ruleId);
      toast({
        title: "Success",
        description: "Approval rule deleted successfully.",
      });
      fetchRules();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete approval rule.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (ruleId: string) => {
    try {
      const rule = rules.find((r) => r.id === ruleId);
      if (!rule) return;
      await masterdataApi.approvalMatrix.update(ruleId, {
        ...rule,
        active: !rule.active,
      });
      toast({
        title: "Success",
        description: "Rule status updated.",
      });
      fetchRules();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      transactionType: "",
      department: "All Departments",
      minAmount: 0,
      maxAmount: 999999999,
      approvers: [{ level: 1, role: "", required: true, canDelegate: false }],
      active: true,
    });
    setEditingRule(null);
    setShowDialog(false);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 999999999) return "No Limit";
    return `₱${amount.toLocaleString()}`;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string }> = {
      supervisor: { color: "bg-blue-600", label: "Supervisor" },
      manager: { color: "bg-purple-600", label: "Manager" },
      head: { color: "bg-orange-600", label: "Dept Head" },
      finance_manager: { color: "bg-green-600", label: "Finance Mgr" },
      cfo: { color: "bg-red-600", label: "CFO" },
      ceo: { color: "bg-gray-800", label: "CEO" },
    };
    const config = roleConfig[role] || { color: "bg-gray-600", label: role };
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  // ================================
  // UI Rendering
  // ================================
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Approver Matrix Setup
          </h2>
          <p className="text-gray-600">
            Configure approval workflows by transaction type and amount
            thresholds
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Approval Rule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#1e40af]">
          <CardContent className="p-4 flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5 text-[#1e40af]" />
            <div>
              <div className="text-2xl font-bold text-[#1e40af]">
                {rules.length}
              </div>
              <div className="text-sm text-gray-600">Total Rules</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4 flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {rules.filter((r) => r.active).length}
              </div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#f97316]">
          <CardContent className="p-4 flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-[#f97316]" />
            <div>
              <div className="text-2xl font-bold text-[#f97316]">
                {transactionTypes.length}
              </div>
              <div className="text-sm text-gray-600">Transaction Types</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#3b82f6]">
          <CardContent className="p-4 flex items-center space-x-2">
            <AlertCircleIcon className="h-5 w-5 text-[#3b82f6]" />
            <div>
              <div className="text-2xl font-bold text-[#3b82f6]">
                {rules.filter((r) => !r.active).length}
              </div>
              <div className="text-sm text-gray-600">Inactive Rules</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Rules by Transaction Type */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Rules Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full">
              {transactionTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id}>
                  <span className="mr-1">{type.icon}</span>
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {transactionTypes.map((type) => {
              const filtered = rules.filter(
                (r) => r.transactionType === type.id
              );
              return (
                <TabsContent key={type.id} value={type.id} className="mt-6">
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-center text-gray-500 py-10">
                        Loading rules...
                      </p>
                    ) : filtered.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No approval rules configured for {type.name}</p>
                        <Button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              transactionType: type.id,
                            });
                            setShowDialog(true);
                          }}
                          variant="outline"
                          className="mt-4"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add First Rule
                        </Button>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Amount Range</TableHead>
                            <TableHead>Approval Levels</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((rule) => (
                            <TableRow key={rule.id}>
                              <TableCell>
                                <Badge variant="outline">
                                  {rule.department}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{formatAmount(rule.minAmount)}</div>
                                  <div className="text-gray-500">
                                    to {formatAmount(rule.maxAmount)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {rule.approvers.map((approver) => (
                                    <div
                                      key={approver.level}
                                      className="flex items-center space-x-1"
                                    >
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        L{approver.level}
                                      </Badge>
                                      {getRoleBadge(approver.role)}
                                      {approver.required && (
                                        <span className="text-red-500 text-xs">
                                          *
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                {rule.active ? (
                                  <Badge className="bg-green-600">Active</Badge>
                                ) : (
                                  <Badge variant="secondary">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(rule)}
                                  >
                                    <EditIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleActive(rule.id)
                                    }
                                  >
                                    {rule.active ? (
                                      <XCircleIcon className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(rule.id)}
                                    className="text-red-600"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Approval Rule" : "Add Approval Rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Transaction Type</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, transactionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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

            {/* Amount Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Amount (₱)</Label>
                <Input
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Maximum Amount (₱)</Label>
                <Input
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxAmount: parseFloat(e.target.value) || 999999999,
                    })
                  }
                  placeholder="No limit"
                />
              </div>
            </div>

            {/* Approval Levels */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Approval Levels</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddApproverLevel}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Level
                </Button>
              </div>

              <div className="space-y-4">
                {formData.approvers.map((approver) => (
                  <Card key={approver.level} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-[#1e40af]">
                          Level {approver.level}
                        </Badge>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Role</Label>
                          <Select
                            value={approver.role}
                            onValueChange={(value) =>
                              handleUpdateApprover(
                                approver.level,
                                "role",
                                value
                              )
                            }
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
                          <Label className="text-xs">
                            Specific User (Optional)
                          </Label>
                          <Select
                            value={approver.userId || ""}
                            onValueChange={(value) =>
                              handleUpdateApprover(
                                approver.level,
                                "userId",
                                value || undefined
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any user with role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">
                                Any user with role
                              </SelectItem>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${approver.level}`}
                            checked={approver.required}
                            onChange={(e) =>
                              handleUpdateApprover(
                                approver.level,
                                "required",
                                e.target.checked
                              )
                            }
                            className="rounded"
                          />
                          <label
                            htmlFor={`required-${approver.level}`}
                            className="text-sm"
                          >
                            Required
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`delegate-${approver.level}`}
                            checked={approver.canDelegate}
                            onChange={(e) =>
                              handleUpdateApprover(
                                approver.level,
                                "canDelegate",
                                e.target.checked
                              )
                            }
                            className="rounded"
                          />
                          <label
                            htmlFor={`delegate-${approver.level}`}
                            className="text-sm"
                          >
                            Can Delegate
                          </label>
                        </div>
                      </div>
                      {formData.approvers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveApproverLevel(approver.level)
                          }
                          className="text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#1e40af] hover:bg-[#1e3a8a]"
              >
                {editingRule ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
