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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingForm } from "@/polymet/components/booking-form";
import { TruckingBookingForm } from "@/polymet/components/trucking-booking-form";
import { ForwardingBookingForm } from "@/polymet/components/forwarding-booking-form";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  TruckIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  ChevronDownIcon,
  PackageIcon,
} from "lucide-react";
import { bookings, bookingStatuses } from "@/polymet/data/logistics-data";

export function DomesticBookingPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedBookingType, setSelectedBookingType] = useState<string>("");

  const domesticBookings = bookings.filter(
    (booking) =>
      booking.type.includes("domestic") &&
      (booking.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.delivery?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    console.log("Creating domestic booking:", data);
    alert("Domestic booking created successfully!");
    setActiveTab("list");
    setSelectedBookingType(""); // Reset booking type after creation
  };

  const handleBookingTypeSelection = (type: string) => {
    setSelectedBookingType(type);
    setActiveTab("create");
  };

  const handleSaveBooking = (data: any) => {
    console.log("Saving domestic booking draft:", data);
    alert("Domestic booking saved as draft!");
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
          <h1 className="text-3xl font-bold text-gray-900">Domestic Booking</h1>
          <p className="text-gray-600">
            Manage domestic trucking and forwarding services
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Domestic Booking
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => handleBookingTypeSelection("trucking")}
              className="cursor-pointer"
            >
              <TruckIcon className="mr-2 h-4 w-4 text-green-600" />

              <div>
                <div className="font-medium">Trucking Booking</div>
                <div className="text-sm text-muted-foreground">
                  Domestic trucking services
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleBookingTypeSelection("forwarding")}
              className="cursor-pointer"
            >
              <PackageIcon className="mr-2 h-4 w-4 text-blue-600" />

              <div>
                <div className="font-medium">Forwarding Booking</div>
                <div className="text-sm text-muted-foreground">
                  Domestic forwarding services
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                    placeholder="Search by client, pickup/delivery location, or booking ID..."
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
            {domesticBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          booking.type === "domestic_trucking"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <TruckIcon
                          className={`w-6 h-6 ${
                            booking.type === "domestic_trucking"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{booking.id}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />

                            {booking.client}
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {booking.pickup} → {booking.delivery}
                          </div>
                          {booking.truckerType && (
                            <Badge variant="outline" className="text-xs">
                              {booking.truckerType} trucker
                            </Badge>
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
                          {booking.type === "domestic_trucking"
                            ? "Trucking"
                            : "Forwarding"}
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

          {domesticBookings.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No domestic bookings found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Create your first domestic booking to get started"}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Domestic Booking
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuItem
                      onClick={() => handleBookingTypeSelection("trucking")}
                      className="cursor-pointer"
                    >
                      <TruckIcon className="mr-2 h-4 w-4 text-green-600" />

                      <div>
                        <div className="font-medium">Trucking Booking</div>
                        <div className="text-sm text-muted-foreground">
                          Domestic trucking services
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBookingTypeSelection("forwarding")}
                      className="cursor-pointer"
                    >
                      <PackageIcon className="mr-2 h-4 w-4 text-blue-600" />

                      <div>
                        <div className="font-medium">Forwarding Booking</div>
                        <div className="text-sm text-muted-foreground">
                          Domestic forwarding services
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>
                Create New{" "}
                {selectedBookingType
                  ? selectedBookingType === "trucking"
                    ? "Trucking"
                    : "Forwarding"
                  : "Domestic"}{" "}
                Booking
              </CardTitle>
              <CardDescription>
                {selectedBookingType
                  ? selectedBookingType === "trucking"
                    ? "Create a new domestic trucking booking for transportation services"
                    : "Create a new domestic forwarding booking for logistics services"
                  : "Create a new domestic trucking or forwarding booking"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBookingType ? (
                selectedBookingType === "trucking" ? (
                  <TruckingBookingForm
                    onSubmit={handleCreateBooking}
                    onSave={handleSaveBooking}
                    initialData={{
                      serviceType: "domestic_trucking",
                      bookingType: "trucking",
                    }}
                  />
                ) : (
                  <ForwardingBookingForm
                    onSubmit={handleCreateBooking}
                    onSave={handleSaveBooking}
                    initialData={{
                      serviceType: "domestic_forwarding",
                      bookingType: "forwarding",
                      bookingNo: `FWD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
                    }}
                  />
                )
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select Booking Type
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Choose the type of domestic booking you want to create
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200"
                      onClick={() => handleBookingTypeSelection("trucking")}
                    >
                      <CardContent className="pt-6 text-center">
                        <TruckIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />

                        <h4 className="font-semibold text-lg mb-2">
                          Trucking Booking
                        </h4>
                        <p className="text-sm text-gray-600">
                          For domestic transportation and trucking services
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                      onClick={() => handleBookingTypeSelection("forwarding")}
                    >
                      <CardContent className="pt-6 text-center">
                        <PackageIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />

                        <h4 className="font-semibold text-lg mb-2">
                          Forwarding Booking
                        </h4>
                        <p className="text-sm text-gray-600">
                          For domestic forwarding and logistics services
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
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
                      <h4 className="font-semibold mb-2">Client Information</h4>
                      <p>
                        <strong>Name:</strong> {selectedBooking.client}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedBooking.clientEmail}
                      </p>
                      <p>
                        <strong>Service Type:</strong>{" "}
                        {selectedBooking.type.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Details</h4>
                      <p>
                        <strong>Pickup:</strong> {selectedBooking.pickup}
                      </p>
                      <p>
                        <strong>Delivery:</strong> {selectedBooking.delivery}
                      </p>
                      {selectedBooking.truckerType && (
                        <p>
                          <strong>Trucker Type:</strong>{" "}
                          {selectedBooking.truckerType}
                        </p>
                      )}
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
                  <BookingForm
                    type="domestic"
                    initialData={selectedBooking}
                    onSubmit={handleCreateBooking}
                    onSave={handleSaveBooking}
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
