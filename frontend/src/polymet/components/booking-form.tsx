import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, SaveIcon, SendIcon } from "lucide-react";
import {
  serviceTypes,
  shippingLines,
  ports,
} from "@/polymet/data/logistics-data";

interface BookingFormProps {
  type: "import" | "domestic";
  onSubmit?: (data: any) => void;
  onSave?: (data: any) => void;
  initialData?: any;
}

export function BookingForm({
  type,
  onSubmit,
  onSave,
  initialData,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    serviceType: "",
    consignee: "",
    consigneeEmail: "",
    consigneePhone: "",
    billOfLading: "",
    origin: "",
    destination: "",
    shippingLine: "",
    vessel: "",
    voyage: "",
    eta: "",
    commodity: "",
    weight: "",
    volume: "",
    packages: "",
    remarks: "",
    // Domestic specific
    client: "",
    clientEmail: "",
    clientPhone: "",
    pickup: "",
    delivery: "",
    truckerType: "internal",
    trucker: "",
    ...initialData,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (action: "save" | "submit") => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const callback = action === "save" ? onSave : onSubmit;
    callback?.(formData);

    setIsLoading(false);
  };

  const getServiceTypes = () => {
    return serviceTypes.filter((service) => service.category === type);
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
          <CardDescription>
            Select the type of {type} service required
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  handleInputChange("serviceType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {getServiceTypes().map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.serviceType && (
              <div className="flex items-center">
                <Badge variant="secondary" className="text-sm">
                  {
                    serviceTypes.find((s) => s.id === formData.serviceType)
                      ?.name
                  }
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client/Consignee Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "import" ? "Consignee" : "Client"} Information
          </CardTitle>
          <CardDescription>
            Contact details and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={type === "import" ? "consignee" : "client"}>
                {type === "import" ? "Consignee" : "Client"} Name *
              </Label>
              <Input
                id={type === "import" ? "consignee" : "client"}
                value={type === "import" ? formData.consignee : formData.client}
                onChange={(e) =>
                  handleInputChange(
                    type === "import" ? "consignee" : "client",
                    e.target.value
                  )
                }
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={
                  type === "import"
                    ? formData.consigneeEmail
                    : formData.clientEmail
                }
                onChange={(e) =>
                  handleInputChange(
                    type === "import" ? "consigneeEmail" : "clientEmail",
                    e.target.value
                  )
                }
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={
                  type === "import"
                    ? formData.consigneePhone
                    : formData.clientPhone
                }
                onChange={(e) =>
                  handleInputChange(
                    type === "import" ? "consigneePhone" : "clientPhone",
                    e.target.value
                  )
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <CardDescription>
            Transportation and cargo information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {type === "import" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billOfLading">Bill of Lading *</Label>
                <Input
                  id="billOfLading"
                  value={formData.billOfLading}
                  onChange={(e) =>
                    handleInputChange("billOfLading", e.target.value)
                  }
                  placeholder="Enter B/L number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingLine">Shipping Line</Label>
                <Select
                  value={formData.shippingLine}
                  onValueChange={(value) =>
                    handleInputChange("shippingLine", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping line" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingLines.map((line) => (
                      <SelectItem key={line.id} value={line.name}>
                        {line.name} ({line.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">
                {type === "import" ? "Origin Port" : "Pickup Location"} *
              </Label>
              {type === "import" ? (
                <Select
                  value={formData.origin}
                  onValueChange={(value) => handleInputChange("origin", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin port" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.name}>
                        {port.name} ({port.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="pickup"
                  value={formData.pickup}
                  onChange={(e) => handleInputChange("pickup", e.target.value)}
                  placeholder="Enter pickup address"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">
                {type === "import" ? "Destination Port" : "Delivery Location"} *
              </Label>
              {type === "import" ? (
                <Select
                  value={formData.destination}
                  onValueChange={(value) =>
                    handleInputChange("destination", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination port" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map((port) => (
                      <SelectItem key={port.id} value={port.name}>
                        {port.name} ({port.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="delivery"
                  value={formData.delivery}
                  onChange={(e) =>
                    handleInputChange("delivery", e.target.value)
                  }
                  placeholder="Enter delivery address"
                />
              )}
            </div>
          </div>

          {type === "import" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vessel">Vessel Name</Label>
                <Input
                  id="vessel"
                  value={formData.vessel}
                  onChange={(e) => handleInputChange("vessel", e.target.value)}
                  placeholder="Enter vessel name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voyage">Voyage Number</Label>
                <Input
                  id="voyage"
                  value={formData.voyage}
                  onChange={(e) => handleInputChange("voyage", e.target.value)}
                  placeholder="Enter voyage number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eta">ETA</Label>
                <Input
                  id="eta"
                  type="date"
                  value={formData.eta}
                  onChange={(e) => handleInputChange("eta", e.target.value)}
                />
              </div>
            </div>
          )}

          {type === "domestic" &&
            formData.serviceType === "domestic_trucking" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truckerType">Trucker Type</Label>
                  <Select
                    value={formData.truckerType}
                    onValueChange={(value) =>
                      handleInputChange("truckerType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trucker type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Trucker</SelectItem>
                      <SelectItem value="external">External Trucker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trucker">Trucker Name</Label>
                  <Input
                    id="trucker"
                    value={formData.trucker}
                    onChange={(e) =>
                      handleInputChange("trucker", e.target.value)
                    }
                    placeholder="Enter trucker name"
                  />
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Cargo Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cargo Information</CardTitle>
          <CardDescription>
            Details about the cargo being transported
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity</Label>
              <Input
                id="commodity"
                value={formData.commodity}
                onChange={(e) => handleInputChange("commodity", e.target.value)}
                placeholder="Enter commodity description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packages">Number of Packages</Label>
              <Input
                id="packages"
                type="number"
                value={formData.packages}
                onChange={(e) => handleInputChange("packages", e.target.value)}
                placeholder="Enter package count"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="Enter weight in kg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume (cbm)</Label>
              <Input
                id="volume"
                type="number"
                step="0.01"
                value={formData.volume}
                onChange={(e) => handleInputChange("volume", e.target.value)}
                placeholder="Enter volume in cbm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              placeholder="Enter any additional remarks or special instructions"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => handleSubmit("save")}
          disabled={isLoading}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit("submit")} disabled={isLoading}>
          <SendIcon className="mr-2 h-4 w-4" />

          {isLoading ? "Creating..." : "Create Booking"}
        </Button>
      </div>
    </div>
  );
}
