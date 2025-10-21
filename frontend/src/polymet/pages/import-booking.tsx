import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/polymet/components/booking-form";
import { EnhancedImportBookingForm } from "@/polymet/components/enhanced-import-booking-form";

import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  ShipIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
import {
  bookings,
  bookingStatuses,
  shippingLines,
  ports,
} from "@/polymet/data/logistics-data";

export function ImportBookingPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const [showSidebar, setShowSidebar] = useState(false);

  const importBookings = bookings.filter(
    (booking) =>
      booking.type.includes("import") &&
      (booking.consignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.billOfLading
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    const statusConfig = bookingStatuses.find((s) => s.id === status);
    return statusConfig?.color || "gray";
  };

  const getStatusVariant = (color: string) => {
    switch (color) {
      case "green":
        return "default";
      case "blue":
        return "secondary";
      case "yellow":
        return "outline";
      case "purple":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleCreateBooking = (data: any) => {
    console.log("Creating import booking:", data);

    // Create new booking with container data
    const newBooking = {
      id: data.bookingNo || `BK-${Date.now()}`,
      type: data.serviceType || "import_brokerage",
      consignee: data.consignee,
      consigneeEmail: `${data.consignee?.toLowerCase().replace(/\s+/g, "")}@company.com`,
      billOfLading: data.blReferenceNo || `BL-${Date.now()}`,
      origin: "Port of Singapore", // Default, could be from form
      destination:
        ports.find((p) => p.id === data.portOfDischarge)?.name ||
        "Port of Manila",
      shippingLine:
        shippingLines.find((sl) => sl.id === data.shippingLines)?.name || "TBD",
      vessel: "TBD", // Could be added to form later
      voyage: "TBD", // Could be added to form later
      eta: data.eta,
      ata: data.ata,
      status: "pending",
      createdBy: "current_user",
      createdAt: new Date().toISOString(),
      quotationSent: false,
      approved: false,
      // Container information from the form
      containers:
        data.containers?.map((container: any) => ({
          ...container,
          // Initialize release and delivery tracking fields
          doReleased: data.doReleased || null,
          pulloutReport: data.pulloutFromPort || null,
          deliveryToWarehouse: data.deliverToWarehouse || null,
          gating: data.unloading || null,
          emptyPullout: data.emptyPullout || null,
          billed: data.billed || null,
        })) || [],
      // Monitoring data from form
      storageStart: data.storageStart,
      demurrageStart: data.demurrageStart,
      origDocsReceived: data.origDocsReceived,
      bocEntry: data.bocEntry,
      assessment: data.assessment,
      dtDebiting: data.dtDebiting,
      customsStatus: "pending",
      customsLodgedDate: null,
      customsExaminationDate: null,
      customsReleaseDate: null,
      deliveryStatus: "pending",
      deliveryDate: null,
      updateNotes: "",
      lastUpdate: new Date().toLocaleString(),
      updatedBy: "Current User",
    };

    // Add to bookings array (in a real app, this would be an API call)
    bookings.unshift(newBooking);

    const containerCount = data.containers?.length || 0;
    alert(
      `Import booking created successfully! Added ${containerCount} container(s) that will appear in Import Monitoring.`
    );
    setActiveTab("list");
  };

  const handleSaveBooking = (data: any) => {
    console.log("Saving import booking draft:", data);

    // Create draft booking with container data
    const draftBooking = {
      id: data.bookingNo || `DRAFT-${Date.now()}`,
      type: data.serviceType || "import_brokerage",
      consignee: data.consignee,
      consigneeEmail: `${data.consignee?.toLowerCase().replace(/\s+/g, "")}@company.com`,
      billOfLading: data.blReferenceNo || `BL-DRAFT-${Date.now()}`,
      origin: "Port of Singapore", // Default, could be from form
      destination:
        ports.find((p) => p.id === data.portOfDischarge)?.name ||
        "Port of Manila",
      shippingLine:
        shippingLines.find((sl) => sl.id === data.shippingLines)?.name || "TBD",
      vessel: "TBD",
      voyage: "TBD",
      eta: data.eta,
      ata: data.ata,
      status: "draft",
      createdBy: "current_user",
      createdAt: new Date().toISOString(),
      quotationSent: false,
      approved: false,
      // Container information from the form
      containers:
        data.containers?.map((container: any) => ({
          ...container,
          // Initialize release and delivery tracking fields
          doReleased: data.doReleased || null,
          pulloutReport: data.pulloutFromPort || null,
          deliveryToWarehouse: data.deliverToWarehouse || null,
          gating: data.unloading || null,
          emptyPullout: data.emptyPullout || null,
          billed: data.billed || null,
        })) || [],
      // Monitoring data from form
      storageStart: data.storageStart,
      demurrageStart: data.demurrageStart,
      origDocsReceived: data.origDocsReceived,
      bocEntry: data.bocEntry,
      assessment: data.assessment,
      dtDebiting: data.dtDebiting,
      customsStatus: "pending",
      deliveryStatus: "pending",
      updateNotes: "Draft booking",
      lastUpdate: new Date().toLocaleString(),
      updatedBy: "Current User",
    };

    // Add to bookings array as draft
    bookings.unshift(draftBooking);

    const containerCount = data.containers?.length || 0;
    alert(
      `Import booking saved as draft! Added ${containerCount} container(s) that will appear in Import Monitoring once finalized.`
    );
  };

  const handlePrintBooking = (data: any) => {
    console.log("Printing import booking:", data);
    alert("Import booking sent to printer!");
  };

  const handleExportBooking = (data: any) => {
    console.log("Exporting import booking:", data);
    alert("Import booking exported successfully!");
  };

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setActiveTab("view");
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setActiveTab("edit");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Booking</h1>
          <p className="text-gray-600">
            Manage import brokerage and forwarding bookings
          </p>
        </div>
        <Button onClick={() => setActiveTab("create")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Import Booking
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">All Bookings</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          {selectedBooking && (
            <>
              <TabsTrigger value="view">View Details</TabsTrigger>
              <TabsTrigger value="edit">Edit Booking</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                  <Input
                    placeholder="Search by consignee, B/L number, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="grid gap-4">
            {importBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShipIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{booking.id}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />

                            {booking.consignee}
                          </div>
                          <div className="flex items-center">
                            <ShipIcon className="w-4 h-4 mr-1" />

                            {booking.billOfLading}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            ETA: {booking.eta || "TBD"}
                          </div>
                          {booking.containers &&
                            booking.containers.length > 0 && (
                              <div className="flex items-center text-blue-600">
                                <span className="text-xs font-medium">
                                  {booking.containers.length} container(s)
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge
                          variant={getStatusVariant(
                            getStatusColor(booking.status)
                          )}
                        >
                          {booking.status.replace("_", " ")}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {booking.origin} → {booking.destination}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBooking(booking)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {importBookings.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <ShipIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No import bookings found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Create your first import booking to get started"}
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Import Booking
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Import Booking</CardTitle>
              <CardDescription>
                Create a new import brokerage or forwarding booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedImportBookingForm
                onSubmit={handleCreateBooking}
                onSave={handleSaveBooking}
                onPrint={handlePrintBooking}
                onExport={handleExportBooking}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {selectedBooking && (
          <>
            <TabsContent value="view">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details - {selectedBooking.id}</CardTitle>
                  <CardDescription>
                    View complete booking information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Consignee Information
                      </h4>
                      <p>
                        <strong>Name:</strong> {selectedBooking.consignee}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedBooking.consigneeEmail}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Shipment Details</h4>
                      <p>
                        <strong>B/L Number:</strong>{" "}
                        {selectedBooking.billOfLading}
                      </p>
                      <p>
                        <strong>Shipping Line:</strong>{" "}
                        {selectedBooking.shippingLine}
                      </p>
                      <p>
                        <strong>Route:</strong> {selectedBooking.origin} →{" "}
                        {selectedBooking.destination}
                      </p>
                      <p>
                        <strong>ETA:</strong> {selectedBooking.eta}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Booking - {selectedBooking.id}</CardTitle>
                  <CardDescription>Update booking information</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedImportBookingForm
                    initialData={selectedBooking}
                    onSubmit={handleCreateBooking}
                    onSave={handleSaveBooking}
                    onPrint={handlePrintBooking}
                    onExport={handleExportBooking}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
