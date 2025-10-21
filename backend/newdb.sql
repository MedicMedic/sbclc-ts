-- ============================================================
-- SBCLC LOGISTICS SYSTEM - DATABASE INITIALIZATION SCRIPT
-- Complete schema for logistics management system
-- ============================================================

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  department TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_code TEXT UNIQUE NOT NULL,
  role_name TEXT NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  permission_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_code TEXT NOT NULL,
  module_id TEXT NOT NULL,
  action TEXT NOT NULL,
  is_granted INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_code) REFERENCES roles(role_code) ON DELETE CASCADE,
  UNIQUE(role_code, module_id, action)
);

-- ============================================================
-- 2. CLIENT MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS clients (
  client_id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_code TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_position TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  payment_terms TEXT DEFAULT 'Net 30 Days',
  credit_limit REAL DEFAULT 0,
  preferred_currency TEXT DEFAULT 'PHP',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. SERVICE TYPES & CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS service_types (
  service_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_type_name TEXT NOT NULL,
  category TEXT NOT NULL, -- import, domestic, forwarding, brokerage
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT UNIQUE NOT NULL,
  category_type TEXT NOT NULL, -- service, expense, general
  parent_category_id INTEGER,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

-- ============================================================
-- 4. PORTS & LOCATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS ports (
  port_id INTEGER PRIMARY KEY AUTOINCREMENT,
  port_name TEXT NOT NULL,
  port_code TEXT UNIQUE NOT NULL,
  country TEXT,
  port_type TEXT DEFAULT 'seaport', -- seaport, airport
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. SHIPPING LINES & PARTNERS
-- ============================================================

CREATE TABLE IF NOT EXISTS shipping_lines (
  shipping_line_id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_name TEXT NOT NULL,
  line_code TEXT UNIQUE NOT NULL,
  country TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. CURRENCIES
-- ============================================================

CREATE TABLE IF NOT EXISTS currencies (
  currency_id INTEGER PRIMARY KEY AUTOINCREMENT,
  currency_code TEXT UNIQUE NOT NULL,
  currency_name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate REAL DEFAULT 1.0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. TRUCKERS & FLEET
-- ============================================================

CREATE TABLE IF NOT EXISTS truckers (
  trucker_id INTEGER PRIMARY KEY AUTOINCREMENT,
  trucker_name TEXT NOT NULL,
  trucker_type TEXT NOT NULL, -- internal, external
  contact_person TEXT,
  contact_phone TEXT,
  address TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. WAREHOUSES
-- ============================================================

CREATE TABLE IF NOT EXISTS warehouses (
  warehouse_id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_name TEXT NOT NULL,
  warehouse_code TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  warehouse_type TEXT DEFAULT 'standard', -- bonded, standard
  capacity REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. CONTAINER SIZES
-- ============================================================

CREATE TABLE IF NOT EXISTS container_sizes (
  container_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
  size_name TEXT UNIQUE NOT NULL,
  size_code TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. TRUCK SIZES
-- ============================================================

CREATE TABLE IF NOT EXISTS truck_sizes (
  truck_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
  size_name TEXT UNIQUE NOT NULL,
  size_code TEXT,
  truck_type TEXT DEFAULT 'other', -- forward, closed_van, wingvan, flatbed, reefer, tanker, dump_truck, other
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. SERVICE RATES
-- ============================================================

CREATE TABLE IF NOT EXISTS service_rates (
  rate_id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_type TEXT NOT NULL,
  category TEXT NOT NULL, -- receipted, non-receipted
  unit_price REAL NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 12. EXPENSE CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS expense_categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL,
  category TEXT NOT NULL, -- receipted, non-receipted
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 13. STATUSES
-- ============================================================

CREATE TABLE IF NOT EXISTS statuses (
  status_id INTEGER PRIMARY KEY AUTOINCREMENT,
  status_code TEXT UNIQUE NOT NULL,
  status_name TEXT NOT NULL,
  category TEXT, -- booking, billing, general
  color TEXT NOT NULL,
  sequence INTEGER DEFAULT 0,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 14. MILESTONES
-- ============================================================

CREATE TABLE IF NOT EXISTS milestones (
  milestone_id INTEGER PRIMARY KEY AUTOINCREMENT,
  milestone_code TEXT UNIQUE NOT NULL,
  milestone_name TEXT NOT NULL,
  service_type TEXT NOT NULL, -- import, trucking, forwarding
  sequence_order INTEGER NOT NULL,
  description TEXT,
  estimated_days INTEGER DEFAULT 0,
  notify_before_days INTEGER DEFAULT 0,
  is_required INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 15. QUOTATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS quotations (
  quotation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_number TEXT UNIQUE NOT NULL,
  booking_id TEXT,
  client_id INTEGER,
  service_type_id INTEGER,
  quotation_date DATE NOT NULL,
  valid_until DATE,
  origin TEXT,
  destination TEXT,
  exchange_rate REAL DEFAULT 1.0,
  base_currency TEXT DEFAULT 'PHP',
  service_description TEXT,
  notes TEXT,
  receipted_total REAL DEFAULT 0,
  non_receipted_total REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  prepared_by TEXT,
  approved_by TEXT,
  status TEXT DEFAULT 'draft', -- draft, pending_approval, approved, client_review, rejected
  contact_person TEXT,
  contact_position TEXT,
  consignee_position TEXT,
  address TEXT,
  contact_no TEXT,
  payment_term TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id),
  FOREIGN KEY (service_type_id) REFERENCES service_types(service_type_id)
);

-- ============================================================
-- 16. QUOTATION ITEMS
-- ============================================================

CREATE TABLE IF NOT EXISTS quotation_items (
  item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_id INTEGER NOT NULL,
  item_sequence INTEGER NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- receipted, non-receipted
  warehouse TEXT,
  container_size TEXT,
  equipment_type TEXT,
  currency TEXT DEFAULT 'PHP',
  quantity REAL DEFAULT 1,
  unit TEXT DEFAULT 'pcs',
  rate REAL DEFAULT 0,
  amount REAL DEFAULT 0,
  custom_data TEXT, -- JSON for additional fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quotation_id) REFERENCES quotations(quotation_id) ON DELETE CASCADE
);

-- ============================================================
-- 17. APPROVAL HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS approval_history (
  approval_id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_type TEXT NOT NULL, -- quotation, cost_analysis, soa, service_invoice, cash_advance
  transaction_id INTEGER NOT NULL,
  reference_no TEXT NOT NULL,
  action TEXT NOT NULL, -- submitted, approved, rejected
  action_by INTEGER NOT NULL,
  action_by_name TEXT NOT NULL,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comments TEXT,
  FOREIGN KEY (action_by) REFERENCES users(user_id)
);

-- ============================================================
-- 18. BOOKINGS (Placeholder for future)
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_number TEXT UNIQUE NOT NULL,
  quotation_id INTEGER,
  client_id INTEGER NOT NULL,
  service_type_id INTEGER NOT NULL,
  booking_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  is_deleted INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quotation_id) REFERENCES quotations(quotation_id),
  FOREIGN KEY (client_id) REFERENCES clients(client_id),
  FOREIGN KEY (service_type_id) REFERENCES service_types(service_type_id)
);

-- ============================================================
-- 19. APPROVAL MATRIX & LEVELS
-- ============================================================

CREATE TABLE IF NOT EXISTS approval_matrix (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_type TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'All Departments',
  min_amount REAL DEFAULT 0,
  max_amount REAL DEFAULT 999999999,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS approval_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_id INTEGER NOT NULL REFERENCES approval_matrix(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  role TEXT NOT NULL,
  user_id INTEGER REFERENCES users(user_id),
  required INTEGER DEFAULT 1,
  can_delegate INTEGER DEFAULT 0
);


-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_code);
CREATE INDEX IF NOT EXISTS idx_clients_code ON clients(client_code);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);
CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quotation_number);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_client ON quotations(client_id);
CREATE INDEX IF NOT EXISTS idx_quotations_deleted ON quotations(is_deleted);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_transaction ON approval_history(transaction_type, transaction_id);

-- ============================================================
-- SEED DATA - DEFAULT ROLES
-- ============================================================

INSERT OR IGNORE INTO roles (role_code, role_name, description, is_active) VALUES
('admin', 'Administrator', 'Full system access and user management', 1),
('manager', 'Manager', 'Can approve quotations and manage operations', 1),
('sales', 'Sales Representative', 'Can create and submit quotations', 1),
('operations', 'Operations Staff', 'Can manage bookings and shipments', 1),
('finance', 'Finance Staff', 'Can manage billing and payments', 1),
('user', 'Basic User', 'Limited access to view information', 1);

-- ============================================================
-- SEED DATA - DEFAULT PERMISSIONS (Admin has all)
-- ============================================================

INSERT OR IGNORE INTO role_permissions (role_code, module_id, action, is_granted) VALUES
-- Admin - Full Access
('admin', 'dashboard', 'view', 1),
('admin', 'quotations', 'view', 1),
('admin', 'quotations', 'create', 1),
('admin', 'quotations', 'edit', 1),
('admin', 'quotations', 'delete', 1),
('admin', 'quotations', 'approve', 1),
('admin', 'bookings', 'view', 1),
('admin', 'bookings', 'create', 1),
('admin', 'bookings', 'edit', 1),
('admin', 'bookings', 'delete', 1),
('admin', 'clients', 'view', 1),
('admin', 'clients', 'create', 1),
('admin', 'clients', 'edit', 1),
('admin', 'clients', 'delete', 1),
('admin', 'users', 'view', 1),
('admin', 'users', 'create', 1),
('admin', 'users', 'edit', 1),
('admin', 'users', 'delete', 1),
('admin', 'roles', 'view', 1),
('admin', 'roles', 'create', 1),
('admin', 'roles', 'edit', 1),
('admin', 'roles', 'delete', 1),
('admin', 'master_data', 'view', 1),
('admin', 'master_data', 'create', 1),
('admin', 'master_data', 'edit', 1),
('admin', 'master_data', 'delete', 1),
('admin', 'approvals', 'view', 1),
('admin', 'approvals', 'approve', 1),
('admin', 'approvals', 'reject', 1),
('admin', 'reports', 'view', 1),
('admin', 'reports', 'export', 1),

-- Manager - Most Access except user/role management
('manager', 'dashboard', 'view', 1),
('manager', 'quotations', 'view', 1),
('manager', 'quotations', 'create', 1),
('manager', 'quotations', 'edit', 1),
('manager', 'quotations', 'approve', 1),
('manager', 'bookings', 'view', 1),
('manager', 'bookings', 'create', 1),
('manager', 'bookings', 'edit', 1),
('manager', 'clients', 'view', 1),
('manager', 'clients', 'create', 1),
('manager', 'clients', 'edit', 1),
('manager', 'master_data', 'view', 1),
('manager', 'approvals', 'view', 1),
('manager', 'approvals', 'approve', 1),
('manager', 'approvals', 'reject', 1),
('manager', 'reports', 'view', 1),
('manager', 'reports', 'export', 1),

-- Sales - Quotation focus
('sales', 'dashboard', 'view', 1),
('sales', 'quotations', 'view', 1),
('sales', 'quotations', 'create', 1),
('sales', 'quotations', 'edit', 1),
('sales', 'clients', 'view', 1),
('sales', 'clients', 'create', 1),
('sales', 'master_data', 'view', 1),
('sales', 'reports', 'view', 1),

-- Operations - Booking focus
('operations', 'dashboard', 'view', 1),
('operations', 'quotations', 'view', 1),
('operations', 'bookings', 'view', 1),
('operations', 'bookings', 'create', 1),
('operations', 'bookings', 'edit', 1),
('operations', 'clients', 'view', 1),
('operations', 'master_data', 'view', 1),
('operations', 'reports', 'view', 1),

-- Finance - Billing focus
('finance', 'dashboard', 'view', 1),
('finance', 'quotations', 'view', 1),
('finance', 'bookings', 'view', 1),
('finance', 'clients', 'view', 1),
('finance', 'reports', 'view', 1),
('finance', 'reports', 'export', 1),

-- Basic User - View only
('user', 'dashboard', 'view', 1),
('user', 'quotations', 'view', 1),
('user', 'bookings', 'view', 1);

-- ============================================================
-- SEED DATA - DEFAULT ADMIN USER
-- Password: admin123 (hashed with bcrypt)
-- ============================================================

INSERT OR IGNORE INTO users (
  email, password_hash, full_name, first_name, last_name, 
  role, department, is_active
) VALUES (
  'admin@sbclc.com', 
  '$2a$10$rXKqVYHHmIjCFKZ1Gg9hqOXKhH9JQhYwO8g5nh3KP.RKpQKXmXP2C',
  'System Administrator',
  'System',
  'Administrator',
  'admin',
  'IT',
  1
);

-- ============================================================
-- SEED DATA - DEFAULT CURRENCIES
-- ============================================================

INSERT OR IGNORE INTO currencies (currency_code, currency_name, symbol, exchange_rate, is_active) VALUES
('PHP', 'Philippine Peso', '₱', 1.00, 1),
('USD', 'US Dollar', '$', 56.50, 1),
('EUR', 'Euro', '€', 61.20, 1),
('JPY', 'Japanese Yen', '¥', 0.38, 1);

-- ============================================================
-- SEED DATA - DEFAULT SERVICE TYPES
-- ============================================================

INSERT OR IGNORE INTO service_types (service_type_name, category, description, is_active) VALUES
('Sea Freight Import', 'import', 'Import shipments via sea', 1),
('Air Freight Import', 'import', 'Import shipments via air', 1),
('Customs Brokerage', 'brokerage', 'Customs clearance services', 1),
('Domestic Trucking', 'domestic', 'Local trucking and delivery', 1),
('Freight Forwarding', 'forwarding', 'International freight forwarding', 1),
('Warehousing', 'domestic', 'Storage and warehousing services', 1);

-- ============================================================
-- SEED DATA - DEFAULT STATUSES
-- ============================================================

INSERT OR IGNORE INTO statuses (status_code, status_name, category, color, sequence, description) VALUES
-- Booking Statuses
('booking_pending', 'Pending', 'booking', 'yellow', 1, 'Booking created, awaiting confirmation'),
('booking_confirmed', 'Confirmed', 'booking', 'blue', 2, 'Booking confirmed'),
('booking_in_transit', 'In Transit', 'booking', 'purple', 3, 'Shipment in transit'),
('booking_delivered', 'Delivered', 'booking', 'green', 4, 'Shipment delivered'),
('booking_cancelled', 'Cancelled', 'booking', 'red', 5, 'Booking cancelled'),

-- Billing Statuses
('billing_pending', 'Pending', 'billing', 'yellow', 1, 'Billing pending'),
('billing_invoiced', 'Invoiced', 'billing', 'blue', 2, 'Invoice sent'),
('billing_paid', 'Paid', 'billing', 'green', 3, 'Payment received'),
('billing_overdue', 'Overdue', 'billing', 'red', 4, 'Payment overdue');

-- ============================================================
-- SEED DATA - SAMPLE CONTAINER SIZES
-- ============================================================

INSERT OR IGNORE INTO container_sizes (size_name, size_code, description, display_order) VALUES
('20 Footer', '20FT', 'Standard 20-foot container', 1),
('40 Footer', '40FT', 'Standard 40-foot container', 2),
('40 High Cube', '40HC', '40-foot high cube container', 3),
('45 Footer', '45FT', '45-foot container', 4);

-- ============================================================
-- SEED DATA - SAMPLE TRUCK SIZES
-- ============================================================

INSERT OR IGNORE INTO truck_sizes (size_name, size_code, description, display_order) VALUES
('4W Forward', '4WF', '4-wheeler forward truck', 1),
('6W Forward', '6WF', '6-wheeler forward truck', 2),
('10W Forward', '10WF', '10-wheeler forward truck', 3),
('6W Closed Van', '6WCV', '6-wheeler closed van', 4),
('10W Closed Van', '10WCV', '10-wheeler closed van', 5),
('10W Wing Van', '10WWV', '10-wheeler wing van', 6);

-- ============================================================
-- SEED DATA - SAMPLE CATEGORIES
-- ============================================================

INSERT OR IGNORE INTO categories (category_name, category_type, description, display_order) VALUES
('Freight Charges', 'service', 'Main freight transportation charges', 1),
('Handling Charges', 'service', 'Cargo handling and loading', 2),
('Documentation', 'service', 'Document processing fees', 3),
('Storage Fees', 'service', 'Warehousing and storage', 4),
('Customs Duties', 'expense', 'Import/export duties and taxes', 5),
('Trucking Fees', 'expense', 'Land transportation costs', 6),
('Port Charges', 'expense', 'Port-related fees', 7),
('Miscellaneous', 'general', 'Other charges', 8);

-- ============================================================
-- COMPLETION MESSAGE
-- ============================================================

-- Database initialization complete!
-- Default admin credentials:
--   Email: admin@sbclc.com
--   Password: admin123
-- Please change the default password after first login.