import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileTextIcon,
  DollarSignIcon,
  PackageIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  ShipIcon,
  TruckIcon,
} from "lucide-react";

interface TransactionDetailsProps {
  transaction: any;
  type: "quotation" | "cost_analysis" | "soa" | "service_invoice" | "cash_advance";
}

export function ApprovalTransactionDetails({
  transaction,
  type,
}: TransactionDetailsProps) {

  const renderQuotationDetails = () => (
    <div className="space-y-6">
      {/* Shipment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShipIcon className="h-5 w-5" />
            Shipment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Origin</p>
              <p className="font-semibold">{transaction.origin || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Destination</p>
              <p className="font-semibold">{transaction.destination || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Service Type</p>
              <p className="font-semibold">{transaction.service_type_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Quotation Date</p>
              <p className="font-semibold">
                {transaction.quotation_date 
                  ? new Date(transaction.quotation_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Valid Until</p>
              <p className="font-semibold">
                {transaction.valid_until 
                  ? new Date(transaction.valid_until).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Exchange Rate</p>
              <p className="font-semibold">
                {transaction.exchange_rate || 1.0}
              </p>
            </div>
          </div>

          {transaction.service_description && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-gray-600 mb-1">Service Description</p>
                <p className="font-semibold">{transaction.service_description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Client Contact Information */}
      {(transaction.contact_person || transaction.contact_position || transaction.address || transaction.contact_no) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {transaction.contact_person && (
                <div>
                  <p className="text-gray-600 mb-1">Contact Person</p>
                  <p className="font-semibold">{transaction.contact_person}</p>
                </div>
              )}
              {transaction.contact_position && (
                <div>
                  <p className="text-gray-600 mb-1">Position</p>
                  <p className="font-semibold">{transaction.contact_position}</p>
                </div>
              )}
              {transaction.consignee_position && (
                <div>
                  <p className="text-gray-600 mb-1">Consignee Position</p>
                  <p className="font-semibold">{transaction.consignee_position}</p>
                </div>
              )}
              {transaction.contact_no && (
                <div>
                  <p className="text-gray-600 mb-1">Contact Number</p>
                  <p className="font-semibold">{transaction.contact_no}</p>
                </div>
              )}
              {transaction.address && (
                <div className="col-span-2">
                  <p className="text-gray-600 mb-1">Address</p>
                  <p className="font-semibold">{transaction.address}</p>
                </div>
              )}
              {transaction.payment_term && (
                <div>
                  <p className="text-gray-600 mb-1">Payment Terms</p>
                  <p className="font-semibold">{transaction.payment_term}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Items */}
      {transaction.items && transaction.items.length > 0 && (
        <>
          {/* Receipted Items */}
          {transaction.items.filter((item: any) => item.category === "receipted").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipted Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaction.items
                      .filter((item: any) => item.category === "receipted")
                      .map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>{item.warehouse || "-"}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.currency} {parseFloat(item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.currency} {parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow className="bg-blue-50 font-semibold">
                      <TableCell colSpan={4}>Subtotal (Receipted)</TableCell>
                      <TableCell className="text-right">
                        {transaction.base_currency} {parseFloat(transaction.receipted_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Non-Receipted Items */}
          {transaction.items.filter((item: any) => item.category === "non-receipted").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Non-Receipted Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaction.items
                      .filter((item: any) => item.category === "non-receipted")
                      .map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {item.container_size && `Container: ${item.container_size}`}
                            {item.equipment_type && ` | Equipment: ${item.equipment_type}`}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.currency} {parseFloat(item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.currency} {parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow className="bg-blue-50 font-semibold">
                      <TableCell colSpan={4}>Subtotal (Non-Receipted)</TableCell>
                      <TableCell className="text-right">
                        {transaction.base_currency} {parseFloat(transaction.non_receipted_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Grand Total */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">Grand Total</p>
            <p className="text-2xl font-bold text-green-700">
              {transaction.base_currency} {parseFloat(transaction.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {transaction.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded border text-sm whitespace-pre-wrap">
              {transaction.notes}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prepared/Approved By */}
      <div className="grid grid-cols-2 gap-6">
        {transaction.prepared_by && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prepared By</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{transaction.prepared_by}</p>
            </CardContent>
          </Card>
        )}
        {transaction.approved_by && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Approved By</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{transaction.approved_by}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderCostAnalysisDetails = () => (
    <div className="space-y-6">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <p className="text-center text-yellow-800">
            Cost Analysis details will be implemented when the Cost Analysis module is ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderSOADetails = () => (
    <div className="space-y-6">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <p className="text-center text-yellow-800">
            SOA details will be implemented when the SOA module is ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderServiceInvoiceDetails = () => (
    <div className="space-y-6">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <p className="text-center text-yellow-800">
            Service Invoice details will be implemented when the Service Invoice module is ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCashAdvanceDetails = () => (
    <div className="space-y-6">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <p className="text-center text-yellow-800">
            Cash Advance details will be implemented when the Cash Advance module is ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {type === "quotation" && renderQuotationDetails()}
      {type === "cost_analysis" && renderCostAnalysisDetails()}
      {type === "soa" && renderSOADetails()}
      {type === "service_invoice" && renderServiceInvoiceDetails()}
      {type === "cash_advance" && renderCashAdvanceDetails()}
    </div>
  );
}