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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileTextIcon,
  HistoryIcon,
  CopyIcon,
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";

interface BookingActionsPanelProps {
  bookingData?: any;
  onLoadTemplate?: (templateId: string) => void;
  onSaveAsTemplate?: (templateName: string) => void;
  onDuplicate?: () => void;
  onShare?: (shareData: any) => void;
  className?: string;
}

interface BookingTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  createdDate: string;
  usageCount: number;
}

interface BookingHistory {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export function BookingActionsPanel({
  bookingData,
  onLoadTemplate,
  onSaveAsTemplate,
  onDuplicate,
  onShare,
  className = "",
}: BookingActionsPanelProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Mock templates data
  const templates: BookingTemplate[] = [
    {
      id: "tpl_001",
      name: "Standard Import Brokerage",
      description: "Standard template for import brokerage services",
      category: "import_brokerage",
      createdBy: "John Doe",
      createdDate: "2024-01-15",
      usageCount: 25,
    },
    {
      id: "tpl_002",
      name: "Express Import Processing",
      description: "Fast-track template for urgent imports",
      category: "import_brokerage",
      createdBy: "Jane Smith",
      createdDate: "2024-01-10",
      usageCount: 18,
    },
    {
      id: "tpl_003",
      name: "Bulk Container Import",
      description: "Template for multiple container imports",
      category: "import_forwarding",
      createdBy: "Mike Johnson",
      createdDate: "2024-01-08",
      usageCount: 12,
    },
  ];

  // Mock history data
  const history: BookingHistory[] = [
    {
      id: "hist_001",
      action: "Created",
      user: "John Doe",
      timestamp: "2024-01-20 09:30:00",
      details: "Initial booking creation",
    },
    {
      id: "hist_002",
      action: "Updated",
      user: "Jane Smith",
      timestamp: "2024-01-20 10:15:00",
      details: "Updated consignee information",
    },
    {
      id: "hist_003",
      action: "Document Uploaded",
      user: "Mike Johnson",
      timestamp: "2024-01-20 11:00:00",
      details: "Uploaded Bill of Lading",
    },
    {
      id: "hist_004",
      action: "Status Changed",
      user: "System",
      timestamp: "2024-01-20 14:30:00",
      details: "Status changed to 'In Progress'",
    },
  ];

  const handleLoadTemplate = (templateId: string) => {
    onLoadTemplate?.(templateId);
    setIsTemplateDialogOpen(false);
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveAsTemplate?.(templateName);
      setTemplateName("");
      setIsTemplateDialogOpen(false);
    }
  };

  const handleShare = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareData = {
      bookingNo: bookingData?.bookingNo,
      url: `${origin}/import/booking/${bookingData?.bookingNo}`,
      timestamp: new Date().toISOString(),
    };
    onShare?.(shareData);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <TooltipProvider>
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Templates, history, and additional booking tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Templates</Label>
            <div className="flex gap-2">
              <Dialog
                open={isTemplateDialogOpen}
                onOpenChange={setIsTemplateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Load Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Load Booking Template</DialogTitle>
                    <DialogDescription>
                      Select a template to pre-fill the booking form
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleLoadTemplate(template.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">
                                  {template.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {template.usageCount} uses
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <UserIcon className="h-3 w-3" />

                                {template.createdBy}
                                <CalendarIcon className="h-3 w-3 ml-2" />

                                {template.createdDate}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Separator />

                    {/* Save as Template */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Save Current Form as Template
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter template name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="flex-1"
                        />

                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="import_brokerage">
                              Import Brokerage
                            </SelectItem>
                            <SelectItem value="import_forwarding">
                              Import Forwarding
                            </SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleSaveTemplate}
                          disabled={!templateName.trim()}
                        >
                          <BookmarkIcon className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onDuplicate}>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a copy of this booking</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <ShareIcon className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share booking link</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator />

          {/* History */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Activity</Label>
            <Dialog
              open={isHistoryDialogOpen}
              onOpenChange={setIsHistoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <HistoryIcon className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Booking History</DialogTitle>
                  <DialogDescription>
                    Track all changes and activities for this booking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 border border-border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <ClockIcon className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{item.action}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.user}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.details}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Activity Summary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recent Activity</Label>
            <div className="space-y-2">
              {history.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-muted rounded text-xs"
                >
                  <ClockIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />

                  <span className="flex-1 truncate">
                    {item.action} by {item.user}
                  </span>
                  <span className="text-muted-foreground flex-shrink-0">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
