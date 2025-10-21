const API_BASE = "http://localhost:5000/api";

export interface QuotationItem {
  id?: string;
  item_id?: number;
  description: string;
  category: "receipted" | "non-receipted";
  currency: string;
  rate: string | number;
  amount: number;
  warehouse?: string;
  containerSize?: string;
  container_size?: string;
  truckSize?: string;
  equipmentType?: string;
  equipment_type?: string;
  quantity?: number;
  unit?: string;
  remarks?: string;
  locationFrom?: string;
  locationTo?: string;
  [key: string]: any;
}

export interface Quotation {
  quotation_id?: number;
  quotation_number: string;
  booking_id?: string | null;
  client_id: number;
  client_name?: string;
  service_type_id: number;
  service_type_name?: string;
  quotation_date: string;
  valid_until?: string | null;
  origin?: string;
  destination?: string;
  exchange_rate?: number;
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
  items?: QuotationItem[];
  is_deleted?: number;
  created_at?: string;
  updated_at?: string;
}

export const fetchQuotations = async (): Promise<Quotation[]> => {
  const response = await fetch(`${API_BASE}/quotations`);
  if (!response.ok) {
    throw new Error("Failed to fetch quotations");
  }
  return response.json();
};

export const fetchQuotationById = async (id: number): Promise<Quotation> => {
  const response = await fetch(`${API_BASE}/quotations/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch quotation");
  }
  return response.json();
};

export const fetchQuotationStats = async () => {
  const response = await fetch(`${API_BASE}/quotations/stats/summary`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
};

export const fetchMasterData = async () => {
  const [clients, serviceTypes, ports, warehouses, serviceRates] = await Promise.all([
    fetch(`${API_BASE}/clients`).then(r => r.json()),
    fetch(`${API_BASE}/service-types`).then(r => r.json()),
    fetch(`${API_BASE}/ports`).then(r => r.json()),
    fetch(`${API_BASE}/warehouses`).then(r => r.json()),
    fetch(`${API_BASE}/service-rates`).then(r => r.json()),
  ]);

  return {
    clients: clients.map((c: any) => ({
      id: c.client_id,
      name: c.client_name,
      contact_person: c.contact_person,
      contact_position: "",
      address: c.address,
      contact_no: c.phone,
      payment_term: c.payment_terms,
    })),
    serviceTypes: serviceTypes.map((s: any) => ({
      id: s.service_type_id,
      name: s.service_type_name,
    })),
    ports: ports.map((p: any) => ({
      id: p.port_id,
      name: p.port_name,
    })),
    warehouses: warehouses.map((w: any) => ({
      id: w.warehouse_id,
      name: w.warehouse_name,
    })),
    serviceItems: serviceRates.map((r: any) => ({
      id: r.rate_id,
      name: r.service_type,
      default_rate: r.unit_price?.toString() || "0",
      category: r.category,
    })),
  };
};

export const createQuotation = async (quotation: Quotation, action: "save" | "submit") => {
  const payload = {
    quotation_number: quotation.quotation_number,
    booking_id: quotation.booking_id,
    client_id: quotation.client_id,
    service_type_id: quotation.service_type_id,
    quotation_date: quotation.quotation_date,
    valid_until: quotation.valid_until,
    origin: quotation.origin,
    destination: quotation.destination,
    exchange_rate: quotation.exchange_rate || 1,
    base_currency: quotation.base_currency,
    service_description: quotation.service_description,
    notes: quotation.notes,
    receipted_total: quotation.receipted_total,
    non_receipted_total: quotation.non_receipted_total,
    total_amount: quotation.total_amount,
    prepared_by: quotation.prepared_by,
    approved_by: quotation.approved_by,
    status: action === "save" ? "draft" : "pending_approval",
    contact_person: quotation.contact_person,
    contact_position: quotation.contact_position,
    consignee_position: quotation.consignee_position,
    address: quotation.address,
    contact_no: quotation.contact_no,
    payment_term: quotation.payment_term,
    items: quotation.items?.map((item, idx) => ({
      item_sequence: idx + 1,
      description: item.description,
      category: item.category,
      warehouse: item.warehouse,
      container_size: item.containerSize || item.container_size,
      equipment_type: item.truckSize || item.equipmentType || item.equipment_type,
      currency: item.currency,
      quantity: item.quantity || 1,
      unit: item.unit || "pcs",
      rate: parseFloat(String(item.rate)) || 0,
      amount: item.amount,
      custom_data: null,
    })) || [],
  };

  const response = await fetch(`${API_BASE}/quotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create quotation");
  }

  return response.json();
};

export const updateQuotation = async (id: number, quotation: Quotation, action: "save" | "submit") => {
  const payload = {
    bookingId: quotation.booking_id,
    clientId: quotation.client_id,
    serviceTypeId: quotation.service_type_id,
    quotationDate: quotation.quotation_date,
    validUntil: quotation.valid_until,
    origin: quotation.origin,
    destination: quotation.destination,
    exchangeRate: quotation.exchange_rate || 1,
    baseCurrency: quotation.base_currency,
    serviceDescription: quotation.service_description,
    notes: quotation.notes,
    receiptedTotal: quotation.receipted_total,
    nonReceiptedTotal: quotation.non_receipted_total,
    totalAmount: quotation.total_amount,
    preparedBy: quotation.prepared_by,
    approvedBy: quotation.approved_by,
    status: action === "save" ? "draft" : "pending_approval",
    contactPerson: quotation.contact_person,
    contactPosition: quotation.contact_position,
    consigneePosition: quotation.consignee_position,
    address: quotation.address,
    contactNo: quotation.contact_no,
    paymentTerm: quotation.payment_term,
    items: quotation.items?.map((item, idx) => ({
      item_sequence: idx + 1,
      description: item.description,
      category: item.category,
      warehouse: item.warehouse,
      containerSize: item.containerSize || item.container_size,
      truckSize: item.truckSize || item.equipmentType || item.equipment_type,
      currency: item.currency,
      quantity: item.quantity || 1,
      unit: item.unit || "pcs",
      rate: parseFloat(String(item.rate)) || 0,
      amount: item.amount,
    })) || [],
  };

  const response = await fetch(`${API_BASE}/quotations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update quotation");
  }

  return response.json();
};

export const deleteQuotation = async (id: number) => {
  const response = await fetch(`${API_BASE}/quotations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete quotation");
  }

  return response.json();
};

export const approveQuotation = async (id: number, approvedBy: string) => {
  const response = await fetch(`${API_BASE}/quotations/${id}/approve`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approvedBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve quotation");
  }

  return response.json();
};

export const rejectQuotation = async (id: number, rejectionReason: string) => {
  const response = await fetch(`${API_BASE}/quotations/${id}/reject`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rejectionReason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reject quotation");
  }

  return response.json();
};

export const validateQuotation = (quotation: Quotation) => {
  const errors: string[] = [];

  if (!quotation.quotation_number || quotation.quotation_number.trim() === "") {
    errors.push("Quotation number is required");
  }

  if (!quotation.client_id || quotation.client_id === 0) {
    errors.push("Client must be selected");
  }

  if (!quotation.service_type_id || quotation.service_type_id === 0) {
    errors.push("Service type must be selected");
  }

  if (!quotation.quotation_date || quotation.quotation_date.trim() === "") {
    errors.push("Quotation date is required");
  }

  if (!quotation.items || quotation.items.length === 0) {
    errors.push("At least one item is required");
  }

  if (quotation.items && quotation.items.length > 0) {
    const hasDescription = quotation.items.some(item => item.description && item.description.trim() !== "");
    if (!hasDescription) {
      errors.push("At least one item must have a description");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};