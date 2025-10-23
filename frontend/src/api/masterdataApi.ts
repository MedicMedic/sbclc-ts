import axios from 'axios';
import { getApiBase } from './config';

const api = axios.create({
  baseURL: getApiBase(), // Returns http://localhost:5000 (no /api suffix)
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
  getAll: () => api.get('/api/service-types'), // ✓ Added /api
  create: (data: any) => api.post('/api/service-types', data),
  update: (id: string | number, data: any) => api.put(`/api/service-types/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/service-types/${id}`),
};

// ============================================================
// CATEGORIES API
// ============================================================
export const categoriesApi = {
  getAll: (type?: string) => api.get('/api/categories', { params: { type } }),
  create: (data: any) => api.post('/api/categories', data),
  update: (id: string | number, data: any) => api.put(`/api/categories/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/categories/${id}`),
};

// ============================================================
// PORTS API
// ============================================================
export const portsApi = {
  getAll: () => api.get('/api/ports'),
  create: (data: any) => api.post('/api/ports', data),
  update: (id: string | number, data: any) => api.put(`/api/ports/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/ports/${id}`),
};

// ============================================================
// SHIPPING LINES API
// ============================================================
export const shippingLinesApi = {
  getAll: () => api.get('/api/shipping-lines'),
  create: (data: any) => api.post('/api/shipping-lines', data),
  update: (id: string | number, data: any) => api.put(`/api/shipping-lines/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/shipping-lines/${id}`),
};

// ============================================================
// CURRENCIES API
// ============================================================
export const currenciesApi = {
  getAll: () => api.get('/api/currencies'),
  create: (data: any) => api.post('/api/currencies', data),
  update: (id: string | number, data: any) => api.put(`/api/currencies/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/currencies/${id}`),
};

// ============================================================
// TRUCKERS API
// ============================================================
export const truckersApi = {
  getAll: () => api.get('/api/truckers'),
  create: (data: any) => api.post('/api/truckers', data),
  update: (id: string | number, data: any) => api.put(`/api/truckers/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/truckers/${id}`),
};

// ============================================================
// SERVICE RATES API
// ============================================================
export const serviceRatesApi = {
  getAll: () => api.get('/api/service-rates'),
  create: (data: any) => api.post('/api/service-rates', data),
  update: (id: string | number, data: any) => api.put(`/api/service-rates/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/service-rates/${id}`),
};

// ============================================================
// EXPENSE TYPES API
// ============================================================
export const expenseTypesApi = {
  getAll: () => api.get('/api/expense-categories'),
  create: (data: any) => api.post('/api/expense-categories', data),
  update: (id: string | number, data: any) => api.put(`/api/expense-categories/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/expense-categories/${id}`),
};

// ============================================================
// STATUSES API
// ============================================================
export const statusesApi = {
  getAll: (category?: string) => api.get('/api/statuses', { params: { category } }),
  create: (data: any) => api.post('/api/statuses', data),
  update: (id: string | number, data: any) => api.put(`/api/statuses/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/statuses/${id}`),
};

// ============================================================
// CLIENTS API
// ============================================================
export const clientsApi = {
  getAll: () => api.get('/api/clients'),
  create: (data: any) => api.post('/api/clients', data),
  update: (id: string | number, data: any) => api.put(`/api/clients/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/clients/${id}`),
};

// ============================================================
// WAREHOUSES API
// ============================================================
export const warehousesApi = {
  getAll: () => api.get('/api/warehouses'),
  create: (data: any) => api.post('/api/warehouses', data),
  update: (id: string | number, data: any) => api.put(`/api/warehouses/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/warehouses/${id}`),
};

// ============================================================
// CONTAINER SIZES API
// ============================================================
export const containerSizesApi = {
  getAll: () => api.get('/api/container-sizes'),
  create: (data: any) => api.post('/api/container-sizes', data),
  update: (id: string | number, data: any) => api.put(`/api/container-sizes/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/container-sizes/${id}`),
};

// ============================================================
// TRUCK SIZES API
// ============================================================
export const truckSizesApi = {
  getAll: () => api.get('/api/truck-sizes'),
  create: (data: any) => api.post('/api/truck-sizes', data),
  update: (id: string | number, data: any) => api.put(`/api/truck-sizes/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/truck-sizes/${id}`),
};

// ============================================================
// MILESTONES API
// ============================================================
export const milestonesApi = {
  getAll: (serviceType?: string) => api.get('/api/milestones', { params: { serviceType } }),
  create: (data: any) => api.post('/api/milestones', data),
  update: (id: string | number, data: any) => api.put(`/api/milestones/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/milestones/${id}`),
};

// ============================================================
// APPROVAL MATRIX API
// ============================================================
export const approvalMatrixApi = {
  getAll: () => api.get('/api/approval-matrix'),
  create: (data: any) => api.post('/api/approval-matrix', data),
  update: (id: string | number, data: any) => api.put(`/api/approval-matrix/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/approval-matrix/${id}`),
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