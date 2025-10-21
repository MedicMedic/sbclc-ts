// master-setup.tsx - FULLY INTEGRATED VERSION
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasterSetupDialog } from "@/polymet/components/master-setup-dialogs";
import {
  ServiceTypesTableSection,
  CategoriesTableSection,
  PortsTableSection,
  ShippingLinesTableSection,
  CurrenciesTableSection,
  TruckersTableSection,
  ServiceItemsTableSection,
  ExpenseTypesTableSection,
  StatusesTableSection,
  ClientsTableSection,
  WarehousesTableSection,
  ContainerSizesTableSection,
  TruckSizesTableSection,
} from "@/polymet/components/master-setup-table-sections";
import masterDataApi from "@/api/masterdataApi";
import { useToast } from "@/hooks/use-toast";

type TabType =
  | "service-types"
  | "categories"
  | "ports"
  | "shipping"
  | "currencies"
  | "truckers"
  | "service-items"
  | "expenses"
  | "statuses"
  | "clients"
  | "warehouses"
  | "container-sizes"
  | "truck-sizes";

type DialogType =
  | "service-type"
  | "category"
  | "port"
  | "shipping-line"
  | "currency"
  | "trucker"
  | "service-item"
  | "expense"
  | "booking-status"
  | "billing-status"
  | "client"
  | "warehouse"
  | "container-size"
  | "truck-size";

export default function MasterSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("service-types");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogType, setDialogType] = useState<DialogType | "">("");
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // Data states
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  const [shippingLines, setShippingLines] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [truckers, setTruckers] = useState<any[]>([]);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
  const [bookingStatuses, setBookingStatuses] = useState<any[]>([]);
  const [billingStatuses, setBillingStatuses] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [containerSizes, setContainerSizes] = useState<any[]>([]);
  const [truckSizes, setTruckSizes] = useState<any[]>([]);

  // Load all master data on mount (for cross-references)
  useEffect(() => {
    loadAllMasterData();
  }, []);

  // Reload specific tab data when switching tabs or refreshing
  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab, refreshKey]);

  const loadAllMasterData = async () => {
    try {
      const [
        categoriesRes,
        currenciesRes,
        containerSizesRes,
        truckSizesRes,
        warehousesRes,
      ] = await Promise.all([
        masterDataApi.categories.getAll(),
        masterDataApi.currencies.getAll(),
        masterDataApi.containerSizes.getAll(),
        masterDataApi.truckSizes.getAll(),
        masterDataApi.warehouses.getAll(),
      ]);

      setCategories(categoriesRes.data);
      setCurrencies(currenciesRes.data);
      setContainerSizes(containerSizesRes.data);
      setTruckSizes(truckSizesRes.data);
      setWarehouses(warehousesRes.data);
    } catch (err) {
      console.error("Failed to load master data:", err);
    }
  };

  const fetchDataForTab = async (tab: TabType) => {
    setLoading(true);
    try {
      switch (tab) {
        case "service-types":
          setServiceTypes((await masterDataApi.serviceTypes.getAll()).data);
          break;
        case "categories":
          setCategories((await masterDataApi.categories.getAll()).data);
          break;
        case "ports":
          setPorts((await masterDataApi.ports.getAll()).data);
          break;
        case "shipping":
          setShippingLines((await masterDataApi.shippingLines.getAll()).data);
          break;
        case "currencies":
          setCurrencies((await masterDataApi.currencies.getAll()).data);
          break;
        case "truckers":
          setTruckers((await masterDataApi.truckers.getAll()).data);
          break;
        case "service-items":
          setServiceItems((await masterDataApi.serviceRates.getAll()).data);
          break;
        case "expenses":
          setExpenseTypes((await masterDataApi.expenseTypes.getAll()).data);
          break;
        case "statuses":
          const booking = await masterDataApi.statuses.getAll("booking");
          const billing = await masterDataApi.statuses.getAll("billing");
          setBookingStatuses(booking.data);
          setBillingStatuses(billing.data);
          break;
        case "clients":
          setClients((await masterDataApi.clients.getAll()).data);
          break;
        case "warehouses":
          setWarehouses((await masterDataApi.warehouses.getAll()).data);
          break;
        case "container-sizes":
          setContainerSizes((await masterDataApi.containerSizes.getAll()).data);
          break;
        case "truck-sizes":
          setTruckSizes((await masterDataApi.truckSizes.getAll()).data);
          break;
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type: DialogType) => {
    setDialogType(type);
    setEditingItem(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleView = (item: any, type: DialogType) => {
    setDialogType(type);
    setEditingItem(item);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any, type: DialogType) => {
    setDialogType(type);
    setEditingItem(item);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const getIdField = (type: DialogType): string => {
    const idMap: Record<DialogType, string> = {
      "service-type": "service_type_id",
      "category": "category_id",
      "port": "port_id",
      "shipping-line": "shipping_line_id",
      "currency": "currency_id",
      "trucker": "trucker_id",
      "service-item": "rate_id",
      "expense": "category_id",
      "booking-status": "status_id",
      "billing-status": "status_id",
      "client": "client_id",
      "warehouse": "warehouse_id",
      "container-size": "container_size_id",
      "truck-size": "truck_size_id",
    };
    return idMap[type];
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      const apiMap: Record<DialogType, any> = {
        "service-type": masterDataApi.serviceTypes,
        "category": masterDataApi.categories,
        "port": masterDataApi.ports,
        "shipping-line": masterDataApi.shippingLines,
        "currency": masterDataApi.currencies,
        "trucker": masterDataApi.truckers,
        "service-item": masterDataApi.serviceRates,
        "expense": masterDataApi.expenseTypes,
        "booking-status": masterDataApi.statuses,
        "billing-status": masterDataApi.statuses,
        "client": masterDataApi.clients,
        "warehouse": masterDataApi.warehouses,
        "container-size": masterDataApi.containerSizes,
        "truck-size": masterDataApi.truckSizes,
      };

      const api = apiMap[dialogType as DialogType];
      if (!api) {
        toast({
          title: "Info",
          description: "API endpoint not yet implemented for this type",
          variant: "default",
        });
        setIsDialogOpen(false);
        return;
      }

      if (editingItem) {
        const idField = getIdField(dialogType as DialogType);
        const id = editingItem[idField];
        await api.update(id, data);
        toast({ title: "Success", description: "Item updated successfully!" });
      } else {
        await api.create(data);
        toast({ title: "Success", description: "Item created successfully!" });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      
      // Reload all master data to ensure cross-references are updated
      await loadAllMasterData();
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    setLoading(true);
    try {
      const apiMap = {
        "service type": masterDataApi.serviceTypes,
        "category": masterDataApi.categories,
        "port": masterDataApi.ports,
        "shipping line": masterDataApi.shippingLines,
        "currency": masterDataApi.currencies,
        "trucker": masterDataApi.truckers,
        "service item": masterDataApi.serviceRates,
        "expense type": masterDataApi.expenseTypes,
        "booking status": masterDataApi.statuses,
        "billing status": masterDataApi.statuses,
        "client": masterDataApi.clients,
        "warehouse": masterDataApi.warehouses,
        "container size": masterDataApi.containerSizes,
        "truck size": masterDataApi.truckSizes,
      } as const;

      const api = apiMap[type as keyof typeof apiMap];
      if (!api) {
        toast({
          title: "Info",
          description: "Delete API not yet implemented for this type",
          variant: "default",
        });
        return;
      }

      await api.delete(id);
      toast({ title: "Success", description: "Item deleted successfully!" });
      
      // Reload all master data
      await loadAllMasterData();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
            Master Setup
          </h1>
          <p className="text-gray-600">
            Configure system master data and settings
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabType)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-gray-100">
          <TabsTrigger value="service-types">Service Types</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="ports">Ports</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="truckers">Truckers</TabsTrigger>
          <TabsTrigger value="service-items">Service Items</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="statuses">Statuses</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="container-sizes">Containers</TabsTrigger>
          <TabsTrigger value="truck-sizes">Trucks</TabsTrigger>
        </TabsList>

        <TabsContent value="service-types">
          <ServiceTypesTableSection
            data={serviceTypes}
            categories={categories}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTableSection
            data={categories}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="ports">
          <PortsTableSection
            data={ports}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingLinesTableSection
            data={shippingLines}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="currencies">
          <CurrenciesTableSection
            data={currencies}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="truckers">
          <TruckersTableSection
            data={truckers}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="service-items">
          <ServiceItemsTableSection
            data={serviceItems}
            categories={categories.filter(c => c.category_type === 'service')}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseTypesTableSection
            data={expenseTypes}
            categories={categories.filter(c => c.category_type === 'expense')}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="statuses">
          <StatusesTableSection
            bookingStatuses={bookingStatuses}
            billingStatuses={billingStatuses}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsTableSection
            data={clients}
            currencies={currencies}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="warehouses">
          <WarehousesTableSection
            data={warehouses}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="container-sizes">
          <ContainerSizesTableSection
            data={containerSizes}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="truck-sizes">
          <TruckSizesTableSection
            data={truckSizes}
            loading={loading}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <MasterSetupDialog
        type={dialogType}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
        mode={dialogMode}
        categories={categories}
        currencies={currencies}
        containerSizes={containerSizes}
        truckSizes={truckSizes}
        warehouses={warehouses}
      />
    </div>
  );
}