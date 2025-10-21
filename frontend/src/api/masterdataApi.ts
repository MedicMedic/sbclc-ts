// src/api/masterdataApi.ts - FULLY INTEGRATED VERSION
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// SERVICE TYPES API
// ============================================================
export const serviceTypesApi = {
  getAll: () => api.get('/service-types'),
  create: (data: any) => api.post('/service-types', data),
  update: (id: string | number, data: any) => api.put(`/service-types/${id}`, data),
  delete: (id: string | number) => api.delete(`/service-types/${id}`),
};

// ============================================================
// CATEGORIES API
// ============================================================
export const categoriesApi = {
  getAll: (type?: string) => api.get('/categories', { params: { type } }),
  create: (data: any) => api.post('/categories', data),
  update: (id: string | number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string | number) => api.delete(`/categories/${id}`),
};

// ============================================================
// PORTS API
// ============================================================
export const portsApi = {
  getAll: () => api.get('/ports'),
  create: (data: any) => api.post('/ports', data),
  update: (id: string | number, data: any) => api.put(`/ports/${id}`, data),
  delete: (id: string | number) => api.delete(`/ports/${id}`),
};

// ============================================================
// SHIPPING LINES API
// ============================================================
export const shippingLinesApi = {
  getAll: () => api.get('/shipping-lines'),
  create: (data: any) => api.post('/shipping-lines', data),
  update: (id: string | number, data: any) => api.put(`/shipping-lines/${id}`, data),
  delete: (id: string | number) => api.delete(`/shipping-lines/${id}`),
};

// ============================================================
// CURRENCIES API
// ============================================================
export const currenciesApi = {
  getAll: () => api.get('/currencies'),
  create: (data: any) => api.post('/currencies', data),
  update: (id: string | number, data: any) => api.put(`/currencies/${id}`, data),
  delete: (id: string | number) => api.delete(`/currencies/${id}`),
};

// ============================================================
// TRUCKERS API
// ============================================================
export const truckersApi = {
  getAll: () => api.get('/truckers'),
  create: (data: any) => api.post('/truckers', data),
  update: (id: string | number, data: any) => api.put(`/truckers/${id}`, data),
  delete: (id: string | number) => api.delete(`/truckers/${id}`),
};

// ============================================================
// SERVICE RATES API
// ============================================================
export const serviceRatesApi = {
  getAll: () => api.get('/service-rates'),
  create: (data: any) => api.post('/service-rates', data),
  update: (id: string | number, data: any) => api.put(`/service-rates/${id}`, data),
  delete: (id: string | number) => api.delete(`/service-rates/${id}`),
};

// ============================================================
// EXPENSE TYPES API
// ============================================================
export const expenseTypesApi = {
  getAll: () => api.get('/expense-categories'),
  create: (data: any) => api.post('/expense-categories', data),
  update: (id: string | number, data: any) => api.put(`/expense-categories/${id}`, data),
  delete: (id: string | number) => api.delete(`/expense-categories/${id}`),
};

// ============================================================
// STATUSES API
// ============================================================
export const statusesApi = {
  getAll: (category?: string) => api.get('/statuses', { params: { category } }),
  create: (data: any) => api.post('/statuses', data),
  update: (id: string | number, data: any) => api.put(`/statuses/${id}`, data),
  delete: (id: string | number) => api.delete(`/statuses/${id}`),
};

// ============================================================
// CLIENTS API
// ============================================================
export const clientsApi = {
  getAll: () => api.get('/clients'),
  create: (data: any) => api.post('/clients', data),
  update: (id: string | number, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: string | number) => api.delete(`/clients/${id}`),
};

// ============================================================
// WAREHOUSES API
// ============================================================
export const warehousesApi = {
  getAll: () => api.get('/warehouses'),
  create: (data: any) => api.post('/warehouses', data),
  update: (id: string | number, data: any) => api.put(`/warehouses/${id}`, data),
  delete: (id: string | number) => api.delete(`/warehouses/${id}`),
};

// ============================================================
// CONTAINER SIZES API
// ============================================================
export const containerSizesApi = {
  getAll: () => api.get('/container-sizes'),
  create: (data: any) => api.post('/container-sizes', data),
  update: (id: string | number, data: any) => api.put(`/container-sizes/${id}`, data),
  delete: (id: string | number) => api.delete(`/container-sizes/${id}`),
};

// ============================================================
// TRUCK SIZES API
// ============================================================
export const truckSizesApi = {
  getAll: () => api.get('/truck-sizes'),
  create: (data: any) => api.post('/truck-sizes', data),
  update: (id: string | number, data: any) => api.put(`/truck-sizes/${id}`, data),
  delete: (id: string | number) => api.delete(`/truck-sizes/${id}`),
};

// ============================================================
// MILESTONES API
// ============================================================
export const milestonesApi = {
  getAll: (serviceType?: string) => api.get('/milestones', { params: { serviceType } }),
  create: (data: any) => api.post('/milestones', data),
  update: (id: string | number, data: any) => api.put(`/milestones/${id}`, data),
  delete: (id: string | number) => api.delete(`/milestones/${id}`),
};

// ============================================================
// APPROVAL MATRIX API
// ============================================================
export const approvalMatrixApi = {
  getAll: () => api.get('/approval-matrix'),
  create: (data: any) => api.post('/approval-matrix', data),
  update: (id: string | number, data: any) => api.put(`/approval-matrix/${id}`, data),
  delete: (id: string | number) => api.delete(`/approval-matrix/${id}`),
};

// Export default combined API
export default {
  serviceTypes: serviceTypesApi,
  categories: categoriesApi,
  ports: portsApi,
  shippingLines: shippingLinesApi,
  currencies: currenciesApi,
  truckers: truckersApi,
  serviceRates: serviceRatesApi,
  expenseTypes: expenseTypesApi,
  statuses: statusesApi,
  clients: clientsApi,
  warehouses: warehousesApi,
  containerSizes: containerSizesApi,
  truckSizes: truckSizesApi,
  milestones: milestonesApi,
  approvalMatrix: approvalMatrixApi,
};