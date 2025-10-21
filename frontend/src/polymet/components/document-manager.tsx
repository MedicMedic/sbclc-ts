import React, { useState, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UploadIcon,
  FileIcon,
  XIcon,
  EyeIcon,
  DownloadIcon,
  FolderIcon,
  SearchIcon,
  FilterIcon,
  SortAscIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadDate: string;
  status: "uploaded" | "processing" | "verified" | "rejected";
  tags: string[];
  description?: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxFiles: number;
  acceptedTypes: string[];
}

interface DocumentManagerProps {
  files?: DocumentFile[];
  categories?: DocumentCategory[];
  onFileUpload?: (files: FileList, category: string) => void;
  onFileRemove?: (fileId: string) => void;
  onFilePreview?: (file: DocumentFile) => void;
  onFileDownload?: (file: DocumentFile) => void;
  className?: string;
}

export function DocumentManager({
  files = [],
  categories = [],
  onFileUpload,
  onFileRemove,
  onFilePreview,
  onFileDownload,
  className = "",
}: DocumentManagerProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Default categories if none provided
  const defaultCategories: DocumentCategory[] = [
    {
      id: "shipping_docs",
      name: "Shipping Documents",
      description: "Bill of Lading, Commercial Invoice, Packing List",
      required: true,
      maxFiles: 5,
      acceptedTypes: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
    },
    {
      id: "customs_docs",
      name: "Customs Documents",
      description:
        "Import Permit, Certificate of Origin, Inspection Certificate",
      required: true,
      maxFiles: 3,
      acceptedTypes: [".pdf", ".doc", ".docx"],
    },
    {
      id: "insurance_docs",
      name: "Insurance Documents",
      description: "Marine Insurance Policy, Certificate of Insurance",
      required: false,
      maxFiles: 2,
      acceptedTypes: [".pdf", ".doc", ".docx"],
    },
    {
      id: "other_docs",
      name: "Other Documents",
      description: "Additional supporting documents",
      required: false,
      maxFiles: 10,
      acceptedTypes: [
        ".pdf",
        ".doc",
        ".docx",
        ".jpg",
        ".jpeg",
        ".png",
        ".xlsx",
        ".xls",
      ],
    },
  ];

  const documentCategories =
    categories.length > 0 ? categories : defaultCategories;

  // Handle file upload with progress simulation
  const handleFileUpload = async (
    fileList: FileList | null,
    categoryId: string
  ) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      onFileUpload?.(fileList, categoryId);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Filter and sort files
  const filteredFiles = files
    .filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || file.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "date":
        default:
          return (
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          );
      }
    });

  // Get status color
  const getStatusColor = (status: DocumentFile["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: DocumentFile["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircleIcon className="h-3 w-3" />;

      case "rejected":
        return <AlertCircleIcon className="h-3 w-3" />;

      default:
        return <InfoIcon className="h-3 w-3" />;
    }
  };

  // Handle file preview
  const handlePreview = (file: DocumentFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
    onFilePreview?.(file);
  };

  // Get category statistics
  const getCategoryStats = (categoryId: string) => {
    const categoryFiles = files.filter((file) => file.category === categoryId);
    const category = documentCategories.find((cat) => cat.id === categoryId);
    return {
      count: categoryFiles.length,
      maxFiles: category?.maxFiles || 0,
      required: category?.required || false,
    };
  };

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            Document Manager
          </CardTitle>
          <CardDescription>
            Upload, organize, and manage all booking documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <FilterIcon className="mr-2 h-4 w-4" />

                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {documentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SortAscIcon className="mr-2 h-4 w-4" />

                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Areas by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentCategories.map((category) => {
              const stats = getCategoryStats(category.id);
              const isAtLimit = stats.count >= category.maxFiles;

              return (
                <Card key={category.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {category.name}
                        {category.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </CardTitle>
                      <Badge
                        variant={
                          stats.required && stats.count === 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {stats.count}/{category.maxFiles}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        multiple
                        accept={category.acceptedTypes.join(",")}
                        onChange={(e) =>
                          handleFileUpload(e.target.files, category.id)
                        }
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[category.id] = el)}
                        disabled={isUploading || isAtLimit}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          fileInputRefs.current[category.id]?.click()
                        }
                        disabled={isUploading || isAtLimit}
                        className="w-full"
                      >
                        <UploadIcon className="mr-2 h-4 w-4" />

                        {isAtLimit ? "Limit Reached" : "Upload Files"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Accepted: {category.acceptedTypes.join(", ")}
                      </p>
                    </div>

                    {/* Files in this category */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {files
                        .filter((file) => file.category === category.id)
                        .map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 bg-muted rounded text-xs"
                          >
                            <FileIcon className="h-4 w-4 flex-shrink-0" />

                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </span>
                                <Badge
                                  className={`text-xs px-1 py-0 ${getStatusColor(file.status)}`}
                                >
                                  {getStatusIcon(file.status)}
                                  <span className="ml-1">{file.status}</span>
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreview(file)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <EyeIcon className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Preview</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onFileDownload?.(file)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <DownloadIcon className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onFileRemove?.(file.id)}
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Document Summary */}
          {files.length > 0 && (
            <Alert>
              <InfoIcon className="h-4 w-4" />

              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>
                    {files.length} document(s) uploaded • Total size:{" "}
                    {formatFileSize(
                      files.reduce((total, file) => total + file.size, 0)
                    )}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {files.filter((f) => f.status === "verified").length}{" "}
                      verified
                    </Badge>
                    <Badge variant="outline">
                      {files.filter((f) => f.status === "processing").length}{" "}
                      processing
                    </Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* File Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Document Preview</DialogTitle>
                <DialogDescription>
                  {previewFile?.name} •{" "}
                  {previewFile && formatFileSize(previewFile.size)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {previewFile && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(previewFile.status)}>
                        {getStatusIcon(previewFile.status)}
                        <span className="ml-1">{previewFile.status}</span>
                      </Badge>
                      <Badge variant="outline">{previewFile.category}</Badge>
                    </div>

                    {previewFile.description && (
                      <div>
                        <Label className="text-sm font-medium">
                          Description
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {previewFile.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs font-medium">
                          Upload Date
                        </Label>
                        <p className="text-muted-foreground">
                          {new Date(previewFile.uploadDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">File Type</Label>
                        <p className="text-muted-foreground">
                          {previewFile.type}
                        </p>
                      </div>
                    </div>

                    {previewFile.tags && previewFile.tags.length > 0 && (
                      <div>
                        <Label className="text-xs font-medium">Tags</Label>
                        <div className="flex gap-1 mt-1">
                          {previewFile.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-muted p-4 rounded-lg text-center">
                      <FileIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />

                      <p className="text-sm text-muted-foreground">
                        Preview not available for this file type
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
