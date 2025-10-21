import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  MessageSquareIcon,
  CalendarIcon,
} from "lucide-react";
import { users } from "@/polymet/data/logistics-data";

interface ApprovalWorkflowProps {
  type: "quotation" | "cash-advance";
  item: any;
  currentUser?: any;
  onApprove?: (itemId: string, comments?: string) => void;
  onReject?: (itemId: string, comments: string) => void;
  onRequestRevision?: (itemId: string, comments: string) => void;
}

export function ApprovalWorkflow({
  type,
  item,
  currentUser,
  onApprove,
  onReject,
  onRequestRevision,
}: ApprovalWorkflowProps) {
  const [comments, setComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "revision":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-4 w-4" />;

      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;

      case "pending":
        return <ClockIcon className="h-4 w-4" />;

      case "revision":
        return <MessageSquareIcon className="h-4 w-4" />;

      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleAction = async (action: string) => {
    if (!comments.trim() && (action === "reject" || action === "revision")) {
      alert("Comments are required for rejection or revision requests");
      return;
    }

    setIsProcessing(true);

    try {
      switch (action) {
        case "approve":
          onApprove?.(item.id, comments);
          break;
        case "reject":
          onReject?.(item.id, comments);
          break;
        case "revision":
          onRequestRevision?.(item.id, comments);
          break;
      }
      setComments("");
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canApprove =
    currentUser?.role === "admin" || currentUser?.role === "manager";
  const isPending = item.status === "pending" || item.status === "revision";

  return (
    <div className="space-y-6">
      {/* Item Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {type === "quotation" ? "Quotation" : "Cash Advance"} Approval
            </CardTitle>
            <Badge className={getStatusColor(item.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(item.status)}
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">
                {type === "quotation" ? "Quotation ID" : "Request ID"}
              </Label>
              <p className="font-medium">{item.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Client
              </Label>
              <p className="font-medium">{item.clientName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Amount
              </Label>
              <p className="font-medium">
                {item.currency} {item.totalAmount?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          {type === "quotation" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Service Type
                </Label>
                <p className="font-medium">{item.serviceType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Route
                </Label>
                <p className="font-medium">
                  {item.origin} → {item.destination}
                </p>
              </div>
            </div>
          )}

          {type === "cash-advance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Purpose
                </Label>
                <p className="font-medium">{item.purpose}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Required Date
                </Label>
                <p className="font-medium">{item.requiredDate}</p>
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-500">
              Submitted By
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <UserIcon className="h-4 w-4 text-gray-400" />

              <span className="font-medium">{item.submittedBy}</span>
              <span className="text-sm text-gray-500">
                on {item.submittedDate}
              </span>
            </div>
          </div>

          {item.remarks && (
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Remarks
              </Label>
              <p className="text-sm bg-gray-50 p-3 rounded-md mt-1">
                {item.remarks}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval History */}
      {item.approvalHistory && item.approvalHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {item.approvalHistory.map((history: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(history.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {history.approver}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {history.action}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />

                        {history.date}
                      </span>
                    </div>
                    {history.comments && (
                      <p className="text-sm text-gray-600">
                        {history.comments}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Actions */}
      {canApprove && isPending && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="approval-comments">Comments</Label>
              <Textarea
                id="approval-comments"
                placeholder="Add comments for your decision..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleAction("approve")}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Approve
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAction("revision")}
                disabled={isProcessing}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                Request Revision
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAction("reject")}
                disabled={isProcessing}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!canApprove && (
        <Card>
          <CardContent className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Waiting for Approval
            </h3>
            <p className="text-gray-600">
              This {type} is pending approval from authorized personnel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Approval Summary Component
interface ApprovalSummaryProps {
  items: any[];
  type: "quotation" | "cash-advance";
  currentUser?: any;
}

export function ApprovalSummary({
  items,
  type,
  currentUser,
}: ApprovalSummaryProps) {
  const pendingItems = items.filter(
    (item) => item.status === "pending" || item.status === "revision"
  );
  const canApprove =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  if (!canApprove || pendingItems.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-orange-600" />
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          You have {pendingItems.length} {type}(s) waiting for your approval.
        </p>
        <div className="space-y-2">
          {pendingItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 bg-white rounded border"
            >
              <div>
                <span className="font-medium text-sm">{item.id}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.clientName}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.status}
              </Badge>
            </div>
          ))}
          {pendingItems.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              +{pendingItems.length - 3} more items
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
