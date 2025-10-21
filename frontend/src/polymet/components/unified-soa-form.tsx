import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PrinterIcon,
  SaveIcon,
  SendIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
  DownloadIcon,
  ShipIcon,
  TruckIcon,
} from "lucide-react";
import { cn } from "@/hooks/lib/utils";

interface UnifiedSOAFormProps {
  bookingId?: string;
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  onPrint?: (data: any) => void;
  initialData?: any;
}

interface ParticularItem {
  id: string;
  description: string;
  amount: number;
}

export function UnifiedSOAForm({
  bookingId,
  onSubmit,
  onSave,
  onPrint,
  initialData,
}: UnifiedSOAFormProps) {
  const [billingMode, setBillingMode] = useState<"import" | "domestic">(
    "import"
  );
  const [showCostAnalysisSelector, setShowCostAnalysisSelector] =
    useState(false);
  const [selectedCostAnalysis, setSelectedCostAnalysis] = useState<string>("");
  const [loadedFromCostAnalysis, setLoadedFromCostAnalysis] = useState(false);

  // Mock cost analysis data (for Import)
  const mockCostAnalysisData = [
    {
      id: "CA-2024-001",
      soaNumber: "SOA-2024-001",
      bookingId: "BK-2024-001",
      status: "approved",
      createdDate: "2024-01-15",
      approvedDate: "2024-01-18",
      billToCompany: "GENTLE SUPREME PHILIPPINES INC.",
      particularsItems: [
        { id: "item_001", description: "Port Charges", amount: 195.0 },
        { id: "item_002", description: "Customs Duties", amount: 1250.0 },
        { id: "item_003", description: "Documentation Fee", amount: 150.0 },
      ],

      totals: { particulars: 1595.0 },
    },
    {
      id: "CA-2024-002",
      soaNumber: "SOA-2024-002",
      bookingId: "BK-2024-002",
      status: "approved",
      createdDate: "2024-01-20",
      approvedDate: "2024-01-22",
      billToCompany: "ABC TRADING CORPORATION",
      particularsItems: [
        { id: "item_001", description: "Brokerage Fee", amount: 2500.0 },
        { id: "item_002", description: "Storage Charges", amount: 800.0 },
        { id: "item_003", description: "Handling Fee", amount: 350.0 },
      ],

      totals: { particulars: 3650.0 },
    },
  ];

  // Mock domestic quotations data (for Domestic)
  const mockDomesticQuotations = [
    {
      id: "QT-DOM-2024-001",
      bookingId: "BK-DOM-2024-001",
      status: "approved",
      createdDate: "2024-01-15",
      approvedDate: "2024-01-18",
      clientName: "Metro Logistics Corp",
      serviceType: "Domestic Trucking",
      receiptedItems: [
        { id: "item_001", description: "Fuel Charges", amount: 3500.0 },
        { id: "item_002", description: "Toll Fees", amount: 850.0 },
        { id: "item_003", description: "Parking Fees", amount: 200.0 },
      ],

      totals: { receipted: 4550.0 },
    },
    {
      id: "QT-DOM-2024-002",
      bookingId: "BK-DOM-2024-002",
      status: "approved",
      createdDate: "2024-01-20",
      approvedDate: "2024-01-22",
      clientName: "Global Freight Solutions",
      serviceType: "Domestic Forwarding",
      receiptedItems: [
        {
          id: "item_001",
          description: "Port Handling Charges",
          amount: 2200.0,
        },
        { id: "item_002", description: "Documentation Fee", amount: 500.0 },
        { id: "item_003", description: "Loading/Unloading", amount: 1800.0 },
      ],

      totals: { receipted: 4500.0 },
    },
  ];

  const [formData, setFormData] = useState({
    // Company Information
    companyName: "SAVE AND BEST CARGO LOGISTICS CORPORATION",
    vatRegNo: "Vat Reg. TIN No. 008 - 107 - 502 - 000",
    telephone: "Telephone No. (045) 404 - 8343",

    // Document Information
    soaNumber: "SOA 2025 - FWDC 0000",
    date: new Date().toISOString().split("T")[0],

    // Bill To Information
    billToCompany: "GENTLE SUPREME PHILIPPINES INC.",
    billToAddress:
      "Songkat Building M-14 West Service Road\nSouth Expressway Paranaque City, Manila",

    // Billing Reference
    billingReference: {
      proNo: "0000-25",
      blNumber: "ARM0403053",
      cntrNo: "CIRU1973673",
      port: "MANILA",
      entryNo: "C - 265412",
      invoiceNo: "500035590",
    },

    // Description of Goods
    goodsDescription:
      "1x20 'FCL 300 BOX NOODLE MISEDRAP MISOGANG ASLI 4085GR - BUNDLE\n150 BOX NOODLE MISEDRAP GOSENG AYAM KRISPI 4085GR\n405 BOX NOODLE MISEDRAP KOREAN SPICE CHICKEN 40PCS\n500 BOX NOODLE MISEDRAP KOREAN SOFT 40PCS",

    // Particulars Items
    particularsItems: [
      {
        id: "item_001",
        description: "Port Charges",
        amount: 195.0,
      },
      {
        id: "item_002",
        description: "Customs Duties",
        amount: 1250.0,
      },
      {
        id: "item_003",
        description: "Documentation Fee",
        amount: 150.0,
      },
    ],

    // Totals
    totals: {
      particulars: 1595.0,
    },

    // Prepared By
    preparedBy: "Joel De Vera",
    certifiedBy: "SBCLC Accounting Department",
    receivedBy: "Signature over printed Name",

    // Additional Fields
    remarks: "",
    status: "draft",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const loadCostAnalysisData = (costAnalysisId: string) => {
    const costAnalysis = mockCostAnalysisData.find(
      (ca) => ca.id === costAnalysisId
    );

    if (costAnalysis) {
      setFormData((prev) => ({
        ...prev,
        billToCompany: costAnalysis.billToCompany,
        particularsItems: costAnalysis.particularsItems.map((item) => ({
          ...item,
          id: `loaded_${item.id}`,
        })),
        totals: costAnalysis.totals,
        soaNumber: `${costAnalysis.soaNumber}-SOA`,
      }));

      setSelectedCostAnalysis(costAnalysisId);
      setLoadedFromCostAnalysis(true);
      setShowCostAnalysisSelector(false);

      alert(
        `Cost Analysis ${costAnalysisId} loaded successfully! Data has been populated into the SOA form.`
      );
    }
  };

  const loadDomesticQuotation = (quotationId: string) => {
    const quotation = mockDomesticQuotations.find((q) => q.id === quotationId);

    if (quotation) {
      setFormData((prev) => ({
        ...prev,
        billToCompany: quotation.clientName,
        particularsItems: quotation.receiptedItems.map((item) => ({
          ...item,
          id: `loaded_${item.id}`,
        })),
        totals: { particulars: quotation.totals.receipted },
        soaNumber: `${quotation.id}-SOA`,
      }));

      setSelectedCostAnalysis(quotationId);
      setLoadedFromCostAnalysis(true);
      setShowCostAnalysisSelector(false);

      alert(
        `Domestic Quotation ${quotationId} loaded successfully! Receipted items have been populated into the SOA form.`
      );
    }
  };

  const clearLoadedData = () => {
    setSelectedCostAnalysis("");
    setLoadedFromCostAnalysis(false);
    setFormData({
      companyName: "SAVE AND BEST CARGO LOGISTICS CORPORATION",
      vatRegNo: "Vat Reg. TIN No. 008 - 107 - 502 - 000",
      telephone: "Telephone No. (045) 404 - 8343",
      soaNumber: "SOA 2025 - FWDC 0000",
      date: new Date().toISOString().split("T")[0],
      billToCompany: "GENTLE SUPREME PHILIPPINES INC.",
      billToAddress:
        "Songkat Building M-14 West Service Road\nSouth Expressway Paranaque City, Manila",
      billingReference: {
        proNo: "0000-25",
        blNumber: "ARM0403053",
        cntrNo: "CIRU1973673",
        port: "MANILA",
        entryNo: "C - 265412",
        invoiceNo: "500035590",
      },
      goodsDescription:
        "1x20 'FCL 300 BOX NOODLE MISEDRAP MISOGANG ASLI 4085GR - BUNDLE\n150 BOX NOODLE MISEDRAP GOSENG AYAM KRISPI 4085GR\n405 BOX NOODLE MISEDRAP KOREAN SPICE CHICKEN 40PCS\n500 BOX NOODLE MISEDRAP KOREAN SOFT 40PCS",
      particularsItems: [
        { id: "item_001", description: "Port Charges", amount: 195.0 },
        { id: "item_002", description: "Customs Duties", amount: 1250.0 },
        { id: "item_003", description: "Documentation Fee", amount: 150.0 },
      ],

      totals: { particulars: 1595.0 },
      preparedBy: "Joel De Vera",
      certifiedBy: "SBCLC Accounting Department",
      receivedBy: "Signature over printed Name",
      remarks: "",
      status: "draft",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const addParticularItem = () => {
    const newItem: ParticularItem = {
      id: `item_${Date.now()}`,
      description: "",
      amount: 0,
    };

    setFormData((prev) => ({
      ...prev,
      particularsItems: [...prev.particularsItems, newItem],
    }));
  };

  const updateParticularItem = (
    id: string,
    field: keyof ParticularItem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      particularsItems: prev.particularsItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeParticularItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      particularsItems: prev.particularsItems.filter((item) => item.id !== id),
    }));
  };

  const calculateTotals = () => {
    const particularsTotal = formData.particularsItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      totals: {
        particulars: particularsTotal,
      },
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.particularsItems]);

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      bookingId,
      billingMode,
      submittedAt: new Date().toISOString(),
      status: "pending_approval",
    };

    onSubmit?.(submitData);
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      bookingId,
      billingMode,
      savedAt: new Date().toISOString(),
    };

    onSave?.(saveData);
  };

  const handlePrint = () => {
    const printData = {
      ...formData,
      bookingId,
      billingMode,
    };

    onPrint?.(printData);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white">
      {/* Header with Mode Selector */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 border-b">
        <div>
          <h2 className="text-2xl font-bold">Statement of Account (SOA)</h2>
          <p className="text-gray-600">
            Unified SOA form for Import and Domestic billing
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loadedFromCostAnalysis && (
            <Badge variant="secondary" className="text-sm">
              Loaded from: {selectedCostAnalysis}
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            {formData.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Billing Mode Selector */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <Label className="text-lg font-semibold text-blue-900 mb-3 block">
          Select Billing Type
        </Label>
        <RadioGroup
          value={billingMode}
          onValueChange={(value: "import" | "domestic") => {
            setBillingMode(value);
            if (value === "domestic") {
              clearLoadedData();
            }
          }}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="import" id="import" />

            <Label
              htmlFor="import"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ShipIcon className="h-4 w-4 text-blue-600" />

              <span className="font-medium">Import Billing</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="domestic" id="domestic" />

            <Label
              htmlFor="domestic"
              className="flex items-center gap-2 cursor-pointer"
            >
              <TruckIcon className="h-4 w-4 text-orange-600" />

              <span className="font-medium">Domestic Billing</span>
            </Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-gray-600 mt-2">
          {billingMode === "import"
            ? "Import mode: Load data from approved cost analysis"
            : "Domestic mode: Manual data entry (loading disabled)"}
        </p>
      </div>

      {/* Cost Analysis Loader Section - Only for Import */}
      {billingMode === "import" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Load Cost Analysis Data
              </h3>
              <p className="text-sm text-green-600">
                Load data from approved cost analysis to populate SOA fields
                automatically
              </p>
            </div>
            <div className="flex gap-2">
              {!showCostAnalysisSelector && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCostAnalysisSelector(true)}
                  className="bg-white"
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Load Cost Analysis
                </Button>
              )}
              {loadedFromCostAnalysis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLoadedData}
                  className="bg-white text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear Loaded Data
                </Button>
              )}
            </div>
          </div>

          {showCostAnalysisSelector && (
            <div className="bg-white p-4 rounded border">
              <div className="mb-3">
                <Label className="text-sm font-medium">
                  Select Approved Cost Analysis:
                </Label>
              </div>
              <div className="space-y-2">
                {mockCostAnalysisData
                  .filter((ca) => ca.status === "approved")
                  .map((costAnalysis) => (
                    <div
                      key={costAnalysis.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => loadCostAnalysisData(costAnalysis.id)}
                    >
                      <div>
                        <div className="font-medium">
                          {costAnalysis.id} - {costAnalysis.soaNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {costAnalysis.billToCompany} • Approved:{" "}
                          {costAnalysis.approvedDate} • Total: ₱
                          {costAnalysis.totals.particulars.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {costAnalysis.status.toUpperCase()}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCostAnalysisSelector(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Domestic Quotation Loader Section - Only for Domestic */}
      {billingMode === "domestic" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Load Domestic Quotation
              </h3>
              <p className="text-sm text-green-600">
                Load receipted items from approved domestic quotation to
                populate SOA fields
              </p>
            </div>
            <div className="flex gap-2">
              {!showCostAnalysisSelector && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCostAnalysisSelector(true)}
                  className="bg-white"
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Load Quotation
                </Button>
              )}
              {loadedFromCostAnalysis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLoadedData}
                  className="bg-white text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear Loaded Data
                </Button>
              )}
            </div>
          </div>

          {showCostAnalysisSelector && (
            <div className="bg-white p-4 rounded border">
              <div className="mb-3">
                <Label className="text-sm font-medium">
                  Select Approved Domestic Quotation:
                </Label>
              </div>
              <div className="space-y-2">
                {mockDomesticQuotations
                  .filter((q) => q.status === "approved")
                  .map((quotation) => (
                    <div
                      key={quotation.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => loadDomesticQuotation(quotation.id)}
                    >
                      <div>
                        <div className="font-medium">
                          {quotation.id} - {quotation.serviceType}
                        </div>
                        <div className="text-sm text-gray-600">
                          {quotation.clientName} • Approved:{" "}
                          {quotation.approvedDate} • Total: ₱
                          {quotation.totals.receipted.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {quotation.status.toUpperCase()}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCostAnalysisSelector(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Layout */}
      <div className="p-6 space-y-6">
        {/* Company Header Section */}
        <div className="border-2 border-gray-800 p-4">
          <div className="flex items-center justify-between">
            {/* Company Logo and Name */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                S&B
              </div>
              <div>
                <div className="text-xl font-bold text-blue-800">
                  SAVE AND BEST
                </div>
                <div className="text-lg font-bold text-orange-500">
                  CARGO LOGISTICS CORPORATION
                </div>
                <div className="text-xs mt-1 space-y-1">
                  <div>{formData.vatRegNo}</div>
                  <div>{formData.telephone}</div>
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center">
              <h1 className="text-xl font-bold underline">
                STATEMENT OF
                <br />
                ACCOUNT
              </h1>
              <div className="border-2 border-gray-800 p-2 mt-3 font-bold">
                <Input
                  value={formData.soaNumber}
                  onChange={(e) =>
                    handleInputChange("soaNumber", e.target.value)
                  }
                  className="text-center font-bold border-0 p-0 h-auto bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bill To and Billing Reference Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bill To */}
          <div className="border-2 border-gray-800">
            <div className="bg-blue-100 p-2 text-center font-bold border-b border-gray-800">
              Bill To:
            </div>
            <div className="p-3 space-y-2">
              <Input
                value={formData.billToCompany}
                onChange={(e) =>
                  handleInputChange("billToCompany", e.target.value)
                }
                className="font-bold text-sm border-0 p-0 h-auto bg-transparent"
                placeholder="Company Name"
              />

              <Textarea
                value={formData.billToAddress}
                onChange={(e) =>
                  handleInputChange("billToAddress", e.target.value)
                }
                className="text-xs border-0 p-0 bg-transparent resize-none"
                rows={3}
                placeholder="Company Address"
              />
            </div>
          </div>

          {/* Billing Reference */}
          <div className="border-2 border-gray-800">
            <div className="bg-blue-100 p-2 text-center font-bold border-b border-gray-800">
              Billing Reference:
            </div>
            <div className="p-3">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-bold w-24">PRO No.:</td>
                    <td>
                      <Input
                        value={formData.billingReference.proNo}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "proNo",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="PRO Number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">DATE:</td>
                    <td>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">BL NUMBER:</td>
                    <td>
                      <Input
                        value={formData.billingReference.blNumber}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "blNumber",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="BL Number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">CNTR No.:</td>
                    <td>
                      <Input
                        value={formData.billingReference.cntrNo}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "cntrNo",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="Container Number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">PORT:</td>
                    <td>
                      <Input
                        value={formData.billingReference.port}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "port",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="Port"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">ENTRY No.:</td>
                    <td>
                      <Input
                        value={formData.billingReference.entryNo}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "entryNo",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="Entry Number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">INVOICE No.:</td>
                    <td>
                      <Input
                        value={formData.billingReference.invoiceNo}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingReference",
                            "invoiceNo",
                            e.target.value
                          )
                        }
                        className="border-0 p-0 h-auto bg-transparent text-sm"
                        placeholder="Invoice Number"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Description of Goods */}
        <div>
          <div className="bg-blue-100 p-2 text-center font-bold border-2 border-gray-800 border-b-0">
            Description of Goods
          </div>
          <div className="border-2 border-gray-800 p-3">
            <Textarea
              value={formData.goodsDescription}
              onChange={(e) =>
                handleInputChange("goodsDescription", e.target.value)
              }
              className="w-full border-0 p-0 bg-transparent resize-none"
              rows={4}
              placeholder="Enter description of goods/services..."
            />
          </div>
        </div>

        {/* Particulars Table */}
        <div>
          <div className="bg-blue-100 p-2 text-center font-bold border-2 border-gray-800 border-b-0">
            PARTICULARS
          </div>
          <table className="w-full border-2 border-gray-800 border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-800 p-2 text-center font-bold w-2/3">
                  PARTICULARS
                </th>
                <th className="border border-gray-800 p-2 text-center font-bold w-1/3">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.particularsItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-800 p-2">
                    <div className="flex items-center space-x-2">
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateParticularItem(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="flex-1 border-0 p-0 bg-transparent resize-none text-sm"
                        rows={1}
                        placeholder="Enter service description..."
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticularItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1 h-auto"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="border border-gray-800 p-2 text-right">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) =>
                        updateParticularItem(
                          item.id,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="text-right border-0 p-0 h-auto bg-transparent font-bold"
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-800 p-2" colSpan={2}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParticularItem}
                    className="w-full"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-800 p-2 text-center font-bold">
                  TOTAL AMOUNT
                </td>
                <td className="border border-gray-800 p-2 text-right font-bold">
                  PHP {formData.totals.particulars.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="font-bold mb-2">Prepared by:</div>
            <div className="border-b border-gray-800 h-12 mb-2"></div>
            <Input
              value={formData.preparedBy}
              onChange={(e) => handleInputChange("preparedBy", e.target.value)}
              className="text-center border-0 p-0 h-auto bg-transparent font-bold"
              placeholder="Name"
            />
          </div>

          <div className="text-center">
            <div className="font-bold mb-2">Certified true and correct by:</div>
            <div className="border-b border-gray-800 h-12 mb-2"></div>
            <Input
              value={formData.certifiedBy}
              onChange={(e) => handleInputChange("certifiedBy", e.target.value)}
              className="text-center border-0 p-0 h-auto bg-transparent font-bold"
              placeholder="Name"
            />
          </div>

          <div className="text-center">
            <div className="font-bold mb-2">Received by:</div>
            <div className="border-b border-gray-800 h-12 mb-2"></div>
            <Input
              value={formData.receivedBy}
              onChange={(e) => handleInputChange("receivedBy", e.target.value)}
              className="text-center border-0 p-0 h-auto bg-transparent font-bold"
              placeholder="Signature over printed Name"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button variant="outline" onClick={handleSave}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save
        </Button>

        <Button variant="outline" onClick={handlePrint}>
          <PrinterIcon className="h-4 w-4 mr-2" />
          Print
        </Button>

        <Button onClick={handleSubmit}>
          <SendIcon className="h-4 w-4 mr-2" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
