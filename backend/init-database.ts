// init-database.ts
// Run this script to initialize a fresh database with all tables and default data
// Usage: npx ts-node backend/init-database.ts

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const DB_PATH = path.join(__dirname, "sbclc.db");

console.log("🚀 Starting database initialization...\n");
console.log("📁 Database location:", DB_PATH);

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

try {
  console.log("\n📋 Creating tables...\n");

  // ============================================================
  // CORE TABLES
  // ============================================================
  
  // Users table
  console.log("👤 Creating users table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      avatar TEXT,
      role TEXT NOT NULL,
      department TEXT,
      is_active INTEGER DEFAULT 1,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Roles table
  console.log("🔐 Creating roles table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      role_id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_name TEXT UNIQUE NOT NULL,
      role_code TEXT UNIQUE NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Role permissions table
  console.log("✅ Creating role_permissions table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      permission_id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_code TEXT NOT NULL,
      module_id TEXT NOT NULL,
      action TEXT NOT NULL,
      is_granted INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(role_code, module_id, action),
      FOREIGN KEY (role_code) REFERENCES roles(role_code) ON DELETE CASCADE
    );
  `);

  // ============================================================
  // MASTER DATA TABLES
  // ============================================================

  // Clients table
  console.log("👥 Creating clients table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      client_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_code TEXT UNIQUE NOT NULL,
      client_name TEXT NOT NULL,
      contact_person TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      payment_terms TEXT DEFAULT 'Net 30 Days',
      credit_limit REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Service types table
  console.log("🚢 Creating service_types table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_types (
      service_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_type_name TEXT NOT NULL,
      category TEXT,
      base_rate REAL DEFAULT 0,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ports table
  console.log("🌍 Creating ports table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS ports (
      port_id INTEGER PRIMARY KEY AUTOINCREMENT,
      port_name TEXT NOT NULL,
      port_code TEXT UNIQUE NOT NULL,
      country TEXT,
      port_type TEXT DEFAULT 'seaport',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Shipping lines table
  console.log("🚢 Creating shipping_lines table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS shipping_lines (
      shipping_line_id INTEGER PRIMARY KEY AUTOINCREMENT,
      line_name TEXT NOT NULL,
      line_code TEXT UNIQUE NOT NULL,
      country TEXT,
      email TEXT,
      phone TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Currencies table
  console.log("💱 Creating currencies table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      currency_id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency_code TEXT UNIQUE NOT NULL,
      currency_name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      exchange_rate REAL DEFAULT 1.0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Truckers table
  console.log("🚚 Creating truckers table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS truckers (
      trucker_id INTEGER PRIMARY KEY AUTOINCREMENT,
      trucker_name TEXT NOT NULL,
      trucker_type TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      address TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Warehouses table
  console.log("🏭 Creating warehouses table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS warehouses (
      warehouse_id INTEGER PRIMARY KEY AUTOINCREMENT,
      warehouse_name TEXT NOT NULL,
      warehouse_code TEXT UNIQUE NOT NULL,
      address TEXT NOT NULL,
      warehouse_type TEXT DEFAULT 'standard',
      capacity REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Service rates table
  console.log("💰 Creating service_rates table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_rates (
      rate_id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_type TEXT NOT NULL,
      category TEXT NOT NULL,
      unit_price REAL NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Expense categories table
  console.log("📋 Creating expense_categories table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Statuses table
  console.log("📊 Creating statuses table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS statuses (
      status_id INTEGER PRIMARY KEY AUTOINCREMENT,
      status_code TEXT UNIQUE NOT NULL,
      status_name TEXT NOT NULL,
      category TEXT,
      color TEXT,
      sequence INTEGER DEFAULT 0,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Milestones table
  console.log("🎯 Creating milestones table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS milestones (
      milestone_id INTEGER PRIMARY KEY AUTOINCREMENT,
      milestone_code TEXT UNIQUE NOT NULL,
      milestone_name TEXT NOT NULL,
      service_type TEXT NOT NULL,
      sequence_order INTEGER NOT NULL,
      description TEXT,
      estimated_days INTEGER DEFAULT 0,
      notify_before_days INTEGER DEFAULT 0,
      is_required INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ============================================================
  // QUOTATIONS TABLES
  // ============================================================

  // Quotations table
  console.log("📋 Creating quotations table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotations (
      quotation_id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_number VARCHAR(50) UNIQUE NOT NULL,
      booking_id VARCHAR(50),
      client_id INTEGER NOT NULL,
      service_type_id INTEGER NOT NULL,
      quotation_date DATE NOT NULL,
      valid_until DATE,
      origin VARCHAR(255),
      destination VARCHAR(255),
      exchange_rate DECIMAL(10, 4) DEFAULT 1.0,
      base_currency VARCHAR(10) DEFAULT 'PHP',
      service_description TEXT,
      notes TEXT,
      receipted_total DECIMAL(15, 2) DEFAULT 0,
      non_receipted_total DECIMAL(15, 2) DEFAULT 0,
      total_amount DECIMAL(15, 2) DEFAULT 0,
      prepared_by VARCHAR(255),
      approved_by VARCHAR(255),
      status VARCHAR(50) DEFAULT 'draft',
      contact_person VARCHAR(255),
      contact_position VARCHAR(255),
      consignee_position VARCHAR(255),
      address TEXT,
      contact_no VARCHAR(50),
      payment_term VARCHAR(100),
      is_deleted INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(client_id),
      FOREIGN KEY (service_type_id) REFERENCES service_types(service_type_id)
    );
  `);

  // Quotation items table
  console.log("📝 Creating quotation_items table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotation_items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id INTEGER NOT NULL,
      item_sequence INTEGER DEFAULT 1,
      description TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'non-receipted',
      warehouse VARCHAR(255),
      container_size VARCHAR(50),
      equipment_type VARCHAR(50),
      currency VARCHAR(10) DEFAULT 'PHP',
      quantity DECIMAL(10, 2) DEFAULT 1,
      unit VARCHAR(50) DEFAULT 'pcs',
      rate DECIMAL(15, 2) DEFAULT 0,
      amount DECIMAL(15, 2) DEFAULT 0,
      custom_data TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quotation_id) REFERENCES quotations(quotation_id) ON DELETE CASCADE
    );
  `);

  // ============================================================
  // CREATE INDEXES
  // ============================================================

  console.log("\n📊 Creating indexes...");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_clients_code ON clients(client_code);
    CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_quotations_client ON quotations(client_id);
    CREATE INDEX IF NOT EXISTS idx_quotations_service_type ON quotations(service_type_id);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
    CREATE INDEX IF NOT EXISTS idx_quotations_date ON quotations(quotation_date);
    CREATE INDEX IF NOT EXISTS idx_quotations_deleted ON quotations(is_deleted);
    CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);
    
    CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(currency_code);
    CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_ports_code ON ports(port_code);
    CREATE INDEX IF NOT EXISTS idx_ports_active ON ports(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_shipping_lines_code ON shipping_lines(line_code);
    CREATE INDEX IF NOT EXISTS idx_shipping_lines_active ON shipping_lines(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_service_types_active ON service_types(is_active);
    CREATE INDEX IF NOT EXISTS idx_truckers_active ON truckers(is_active);
    CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(warehouse_code);
    CREATE INDEX IF NOT EXISTS idx_warehouses_active ON warehouses(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_statuses_code ON statuses(status_code);
    CREATE INDEX IF NOT EXISTS idx_statuses_category ON statuses(category);
    CREATE INDEX IF NOT EXISTS idx_statuses_active ON statuses(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_milestones_service_type ON milestones(service_type);
    CREATE INDEX IF NOT EXISTS idx_milestones_active ON milestones(is_active);
  `);

  // ============================================================
  // INSERT DEFAULT DATA
  // ============================================================

  console.log("\n💾 Inserting default data...\n");

  // Insert default roles
  console.log("🔐 Inserting default roles...");
  const insertRole = db.prepare(`
    INSERT OR IGNORE INTO roles (role_name, role_code, description)
    VALUES (?, ?, ?)
  `);

  const roles = [
    ["System Administrator", "admin", "Full system access"],
    ["Department Manager", "manager", "Department-level management access"],
    ["Supervisor", "supervisor", "Supervisory access with limited approval rights"],
    ["Operator", "operator", "Operational access for daily tasks"],
    ["Viewer", "viewer", "Read-only access"],
  ];

  roles.forEach(role => insertRole.run(...role));
  console.log(`   ✓ Inserted ${roles.length} roles`);

  // Insert default permissions
  console.log("✅ Inserting default permissions...");
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_code, module_id, action)
    VALUES (?, ?, ?)
  `);

  const defaultPermissions = [
    // Admin - Full Access
    { role: "admin", module: "dashboard", action: "view" },
    { role: "admin", module: "dashboard", action: "edit" },
    { role: "admin", module: "quotations", action: "view" },
    { role: "admin", module: "quotations", action: "create" },
    { role: "admin", module: "quotations", action: "edit" },
    { role: "admin", module: "quotations", action: "delete" },
    { role: "admin", module: "quotations", action: "approve" },
    { role: "admin", module: "bookings", action: "view" },
    { role: "admin", module: "bookings", action: "create" },
    { role: "admin", module: "bookings", action: "edit" },
    { role: "admin", module: "bookings", action: "delete" },
    { role: "admin", module: "monitoring", action: "view" },
    { role: "admin", module: "monitoring", action: "edit" },
    { role: "admin", module: "monitoring", action: "export" },
    { role: "admin", module: "cash_advance", action: "view" },
    { role: "admin", module: "cash_advance", action: "create" },
    { role: "admin", module: "cash_advance", action: "edit" },
    { role: "admin", module: "cash_advance", action: "delete" },
    { role: "admin", module: "cash_advance", action: "approve" },
    { role: "admin", module: "billing", action: "view" },
    { role: "admin", module: "billing", action: "create" },
    { role: "admin", module: "billing", action: "edit" },
    { role: "admin", module: "billing", action: "delete" },
    { role: "admin", module: "billing", action: "approve" },
    { role: "admin", module: "reports", action: "view" },
    { role: "admin", module: "reports", action: "export" },
    { role: "admin", module: "admin_users", action: "view" },
    { role: "admin", module: "admin_users", action: "create" },
    { role: "admin", module: "admin_users", action: "edit" },
    { role: "admin", module: "admin_users", action: "delete" },
    { role: "admin", module: "master_setup", action: "view" },
    { role: "admin", module: "master_setup", action: "create" },
    { role: "admin", module: "master_setup", action: "edit" },
    { role: "admin", module: "master_setup", action: "delete" },

    // Manager - Management Access
    { role: "manager", module: "dashboard", action: "view" },
    { role: "manager", module: "quotations", action: "view" },
    { role: "manager", module: "quotations", action: "create" },
    { role: "manager", module: "quotations", action: "edit" },
    { role: "manager", module: "quotations", action: "approve" },
    { role: "manager", module: "bookings", action: "view" },
    { role: "manager", module: "bookings", action: "create" },
    { role: "manager", module: "bookings", action: "edit" },
    { role: "manager", module: "monitoring", action: "view" },
    { role: "manager", module: "monitoring", action: "export" },
    { role: "manager", module: "billing", action: "view" },
    { role: "manager", module: "billing", action: "approve" },
    { role: "manager", module: "reports", action: "view" },
    { role: "manager", module: "reports", action: "export" },

    // Supervisor - Supervisory Access
    { role: "supervisor", module: "dashboard", action: "view" },
    { role: "supervisor", module: "quotations", action: "view" },
    { role: "supervisor", module: "quotations", action: "create" },
    { role: "supervisor", module: "quotations", action: "edit" },
    { role: "supervisor", module: "bookings", action: "view" },
    { role: "supervisor", module: "bookings", action: "create" },
    { role: "supervisor", module: "monitoring", action: "view" },
    { role: "supervisor", module: "reports", action: "view" },

    // Operator - Operational Access
    { role: "operator", module: "dashboard", action: "view" },
    { role: "operator", module: "quotations", action: "view" },
    { role: "operator", module: "quotations", action: "create" },
    { role: "operator", module: "bookings", action: "view" },
    { role: "operator", module: "bookings", action: "create" },
    { role: "operator", module: "monitoring", action: "view" },

    // Viewer - Read-Only Access
    { role: "viewer", module: "dashboard", action: "view" },
    { role: "viewer", module: "quotations", action: "view" },
    { role: "viewer", module: "bookings", action: "view" },
    { role: "viewer", module: "monitoring", action: "view" },
    { role: "viewer", module: "reports", action: "view" },
  ];

  defaultPermissions.forEach(perm => {
    insertPermission.run(perm.role, perm.module, perm.action);
  });
  console.log(`   ✓ Inserted ${defaultPermissions.length} permissions`);

  // Insert default admin user
  console.log("👤 Creating admin user...");
  const passwordHash = bcrypt.hashSync("password123", 10);
  db.prepare(`
    INSERT OR IGNORE INTO users (username, email, password_hash, full_name, first_name, last_name, role, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "admin",
    "admin@sbclc.com",
    passwordHash,
    "System Administrator",
    "System",
    "Administrator",
    "admin",
    "IT"
  );
  console.log("   ✓ Admin user created (email: admin@sbclc.com, password: password123)");

  // Insert default currencies
  console.log("💱 Inserting default currencies...");
  const insertCurrency = db.prepare(`
    INSERT OR IGNORE INTO currencies (currency_code, currency_name, symbol, exchange_rate)
    VALUES (?, ?, ?, ?)
  `);

  const currencies = [
    ["PHP", "Philippine Peso", "₱", 1.0],
    ["USD", "US Dollar", "$", 56.5],
    ["EUR", "Euro", "€", 61.2],
    ["JPY", "Japanese Yen", "¥", 0.38],
    ["CNY", "Chinese Yuan", "¥", 7.85],
  ];

  currencies.forEach(currency => insertCurrency.run(...currency));
  console.log(`   ✓ Inserted ${currencies.length} currencies`);

  // Insert default statuses
  console.log("📊 Inserting default statuses...");
  const insertStatus = db.prepare(`
    INSERT OR IGNORE INTO statuses (status_code, status_name, category, color, sequence)
    VALUES (?, ?, ?, ?, ?)
  `);

  const statuses = [
    // Quotation statuses
    ["DRAFT", "Draft", "quotation", "gray", 1],
    ["PENDING_APPROVAL", "Pending Approval", "quotation", "yellow", 2],
    ["APPROVED", "Approved", "quotation", "green", 3],
    ["CLIENT_REVIEW", "Client Review", "quotation", "blue", 4],
    ["REJECTED", "Rejected", "quotation", "red", 5],
    
    // Booking statuses
    ["PENDING", "Pending", "booking", "yellow", 1],
    ["CONFIRMED", "Confirmed", "booking", "green", 2],
    ["IN_TRANSIT", "In Transit", "booking", "purple", 3],
    ["DELIVERED", "Delivered", "booking", "green", 4],
    ["CANCELLED", "Cancelled", "booking", "red", 5],
    
    // Billing statuses
    ["DRAFT_BILL", "Draft", "billing", "gray", 1],
    ["PENDING_BILLING", "Pending Approval", "billing", "yellow", 2],
    ["BILLING_APPROVED", "Approved", "billing", "green", 3],
    ["SENT", "Sent to Client", "billing", "blue", 4],
    ["PAID", "Paid", "billing", "green", 5],
    ["OVERDUE", "Overdue", "billing", "red", 6],
  ];

  statuses.forEach(status => insertStatus.run(...status));
  console.log(`   ✓ Inserted ${statuses.length} statuses`);

  // Insert sample service types
  console.log("🚢 Inserting sample service types...");
  const insertServiceType = db.prepare(`
    INSERT OR IGNORE INTO service_types (service_type_name, category, base_rate, description)
    VALUES (?, ?, ?, ?)
  `);

  const serviceTypes = [
    ["Sea Freight Export", "export", 5000, "Ocean freight export services"],
    ["Sea Freight Import", "import", 5000, "Ocean freight import services"],
    ["Air Freight Export", "export", 15000, "Air freight export services"],
    ["Air Freight Import", "import", 15000, "Air freight import services"],
    ["Customs Clearance", "customs", 2000, "Customs brokerage services"],
    ["Warehousing", "warehousing", 1000, "Storage and warehousing services"],
    ["Inland Transportation", "trucking", 3000, "Domestic trucking services"],
  ];

  serviceTypes.forEach(type => insertServiceType.run(...type));
  console.log(`   ✓ Inserted ${serviceTypes.length} service types`);

  // Insert sample client
  console.log("👥 Inserting sample client...");
  db.prepare(`
    INSERT OR IGNORE INTO clients (client_code, client_name, contact_person, email, phone, address, payment_terms, credit_limit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "CLI001",
    "Sample Corporation",
    "John Doe",
    "john.doe@sample.com",
    "+63 912 345 6789",
    "123 Business St, Makati City, Metro Manila",
    "Net 30 Days",
    1000000
  );
  console.log("   ✓ Sample client created");

  // ============================================================
  // VERIFICATION
  // ============================================================

  console.log("\n🔍 Verifying database structure...\n");

  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all() as { name: string }[];

  console.log(`✅ Created ${tables.length} tables:`);
  tables.forEach(table => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
    console.log(`   • ${table.name.padEnd(25)} (${count.count} rows)`);
  });

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Database initialization completed successfully!");
  console.log("=".repeat(60));
  
  console.log("\n📝 Default Credentials:");
  console.log("   Email:    admin@sbclc.com");
  console.log("   Password: password123");
  
  console.log("\n💡 Next steps:");
  console.log("   1. Start your server: npm run dev");
  console.log("   2. Login with the credentials above");
  console.log("   3. Change the admin password immediately");
  console.log("   4. Add more users and configure permissions\n");

} catch (error: any) {
  console.error("\n❌ Database initialization failed:");
  console.error(error.message);
  console.error("\n📋 Stack trace:");
  console.error(error.stack);
  process.exit(1);
} finally {
  db.close();
}