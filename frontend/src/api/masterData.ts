// src/api/masterData.ts
// At the very top of each API file:
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// For routes that use /api
const API_BASE = `${API_BASE_URL}/api`;

const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export interface Client {
  client_id: number;
  client_code: string;
  client_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  address?: string;
  payment_terms: string;
  credit_limit: number;
  is_active: number;
}

export interface ServiceType {
  service_type_id: number;
  code?: string;
  name: string;
  category: string;
  base_rate: number;
  description?: string;
  is_active: number;
}

export interface Port {
  port_id: number;
  port_code: string;
  port_name: string;
  country?: string;
  port_type: string;
  is_active: number;
}

export interface Currency {
  currency_id: number;
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_active: number;
}

export interface Warehouse {
  warehouse_id: number;
  warehouse_code: string;
  warehouse_name: string;
  address: string;
  warehouse_type: string;
  capacity: number;
  is_active: number;
}

export const masterDataApi = {
  // Get all clients
  async getClients(): Promise<Client[]> {
    const response = await fetch(`${API_BASE}/clients`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  },

  // Get all service types
  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await fetch(`${API_BASE}/service-types`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch service types");
    return response.json();
  },

  // Get all ports
  async getPorts(): Promise<Port[]> {
    const response = await fetch(`${API_BASE}/ports`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch ports");
    return response.json();
  },

  // Get all currencies
  async getCurrencies(): Promise<Currency[]> {
    const response = await fetch(`${API_BASE}/currencies`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch currencies");
    return response.json();
  },

  // Get all warehouses
  async getWarehouses(): Promise<Warehouse[]> {
    const response = await fetch(`${API_BASE}/warehouses`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch warehouses");
    return response.json();
  },

  // Get service rates
  async getServiceRates(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/service-rates`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch service rates");
    return response.json();
  },
};