// approvals-api.ts - FIXED VERSION matching server endpoints
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

// Create axios instance with auth token
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = 
    localStorage.getItem('token') || 
    localStorage.getItem('auth_token') || 
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('token');
    
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No authentication token found in storage');
  }
  
  return config;
});

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔒 Authentication failed - token may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

export interface ApprovalItem {
  id: string;
  type: 'quotation' | 'cost_analysis' | 'soa' | 'service_invoice' | 'cash_advance';
  referenceNo: string;
  clientName: string;
  amount: number;
  currency: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'pending_approval';
  priority: 'high' | 'medium' | 'low';
  bookingNo?: string;
  serviceType?: string;
  description?: string;
}

export interface ApprovalStats {
  total: number;
  pendingApprovals: number;
  approved: number;
  rejected: number;
}

export interface QuotationDetails {
  quotation_id: number;
  quotation_number: string;
  client_name: string;
  client_contact_person?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  service_type_name: string;
  quotation_date: string;
  valid_until?: string;
  origin?: string;
  destination?: string;
  exchange_rate: number;
  base_currency: string;
  service_description?: string;
  notes?: string;
  receipted_total: number;
  non_receipted_total: number;
  total_amount: number;
  prepared_by?: string;
  approved_by?: string;
  status: string;
  contact_person?: string;
  contact_position?: string;
  consignee_position?: string;
  address?: string;
  contact_no?: string;
  payment_term?: string;
  items: QuotationItem[];
}

export interface QuotationItem {
  item_id: number;
  item_sequence: number;
  description: string;
  category: string;
  warehouse?: string;
  container_size?: string;
  equipment_type?: string;
  currency: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  custom_data?: string;
}

export interface ApprovalHistory {
  approval_id: number;
  action: string;
  action_by_name: string;
  action_date: string;
  comments?: string;
}

// Calculate priority based on amount (in PHP)
const calculatePriority = (amount: number, currency: string, exchangeRate: number = 1): 'high' | 'medium' | 'low' => {
  // Convert to PHP if needed
  let amountInPHP = amount;
  if (currency !== 'PHP') {
    amountInPHP = amount * exchangeRate;
  }
  
  // Priority thresholds (in PHP)
  if (amountInPHP >= 1000000) return 'high';      // 1M PHP and above
  if (amountInPHP >= 100000) return 'medium';     // 100K - 1M PHP
  return 'low';                                    // Below 100K PHP
};

// Get approval statistics
export const getApprovalStats = async (): Promise<ApprovalStats> => {
  const response = await apiClient.get('/api/approvals/stats');
  return response.data;
};

// Get all approvals (with optional status filter)
export const getApprovals = async (status?: string): Promise<ApprovalItem[]> => {
  const params = status && status !== 'all' ? { status } : {};
  const response = await apiClient.get('/api/approvals', { params });
  
  // Transform backend response to match frontend interface
  return response.data.map((item: any) => {
    const priority = calculatePriority(
      item.amount || 0, 
      item.currency || 'PHP',
      item.exchange_rate || 1
    );
    
    return {
      id: item.id.toString(),
      type: item.type,
      referenceNo: item.referenceNo || item.reference_no,
      clientName: item.clientName || item.client_name || 'N/A',
      amount: item.amount || 0,
      currency: item.currency || 'PHP',
      submittedBy: item.submittedBy || item.submitted_by || 'N/A',
      submittedDate: item.submittedDate || item.submitted_date,
      status: item.status === 'pending_approval' ? 'pending_approval' : item.status,
      priority: priority,
      bookingNo: item.bookingNo || item.booking_no,
      serviceType: item.serviceType || item.service_type,
      description: item.description,
    };
  });
};

// Get quotation details for approval
export const getQuotationDetails = async (id: string): Promise<QuotationDetails> => {
  const response = await apiClient.get(`/api/approvals/quotation/${id}`);
  return response.data;
};

// Approve a quotation (admin can override)
export const approveQuotation = async (
  id: string,
  comments?: string,
  isOverride: boolean = false
): Promise<void> => {
  console.log(`🔄 API: Approving quotation ${id}${isOverride ? ' (OVERRIDE)' : ''}...`);
  const response = await apiClient.post(`/api/approvals/quotation/${id}/approve`, { 
    comments,
    isOverride 
  });
  console.log('✅ API: Approve response:', response.data);
};

// Reject a quotation (admin can override)
export const rejectQuotation = async (
  id: string,
  comments: string,
  isOverride: boolean = false
): Promise<void> => {
  if (!comments || !comments.trim()) {
    throw new Error('Rejection reason is required');
  }
  console.log(`🔄 API: Rejecting quotation ${id}${isOverride ? ' (OVERRIDE)' : ''}...`);
  const response = await apiClient.post(`/api/approvals/quotation/${id}/reject`, { 
    comments,
    isOverride 
  });
  console.log('✅ API: Reject response:', response.data);
};

// Get approval history for a quotation
export const getApprovalHistory = async (id: string): Promise<ApprovalHistory[]> => {
  const response = await apiClient.get(`/api/approvals/quotation/${id}/history`);
  return response.data;
};

// Submit quotation for approval (helper function)
export const submitQuotationForApproval = async (id: string): Promise<void> => {
  await apiClient.put(`/api/quotations/${id}`, { status: 'pending_approval' });
};

export default {
  getApprovalStats,
  getApprovals,
  getQuotationDetails,
  approveQuotation,
  rejectQuotation,
  getApprovalHistory,
  submitQuotationForApproval,
};