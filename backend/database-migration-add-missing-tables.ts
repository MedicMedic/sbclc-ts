// database-migration-add-missing-tables.ts
// Run this to add missing tables to your existing database
// Usage: npx ts-node backend/database-migration-add-missing-tables.ts

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "sbclc.db");

console.log("🚀 Starting database migration...\n");
console.log("📁 Database location:", DB_PATH);

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

try {
  console.log("\n📋 Adding missing tables...\n");

  // ============================================================
  // 1. CATEGORIES TABLE
  // ============================================================
  console.log("📂 Creating categories table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT UNIQUE NOT NULL,
      category_type TEXT NOT NULL DEFAULT 'general',
      parent_category_id INTEGER,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_category_id) REFERENCES categories(category_id),
      CHECK (category_type IN ('service', 'expense', 'general'))
    );
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(category_type);
    CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);
    CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
  `);

  // Insert default categories
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (category_name, category_type, description, display_order)
    VALUES (?, ?, ?, ?)
  `);

  const defaultCategories = [
    // Service categories
    ["Import Services", "service", "Import-related services", 1],
    ["Export Services", "service", "Export-related services", 2],
    ["Domestic Services", "service", "Domestic logistics services", 3],
    ["Forwarding Services", "service", "Freight forwarding services", 4],
    ["Brokerage Services", "service", "Customs brokerage services", 5],
    
    // Expense categories
    ["Receipted Expenses", "expense", "Expenses with official receipts", 1],
    ["Non-Receipted Expenses", "expense", "Expenses without official receipts", 2],
    ["Transportation Costs", "expense", "Transportation and delivery costs", 3],
    ["Documentation Fees", "expense", "Documentation and processing fees", 4],
    ["Handling Charges", "expense", "Cargo handling charges", 5],
  ];

  defaultCategories.forEach(cat => {
    try {
      insertCategory.run(...cat);
    } catch (e) {
      // Ignore duplicates
    }
  });
  
  console.log("   ✓ Categories table created with default data");

  // ============================================================
  // 2. CONTAINER SIZES TABLE
  // ============================================================
  console.log("📦 Creating container_sizes table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS container_sizes (
      container_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
      size_name TEXT UNIQUE NOT NULL,
      size_code TEXT,
      teu_equivalent REAL DEFAULT 1.0,
      length_ft REAL,
      width_ft REAL,
      height_ft REAL,
      max_weight_kg REAL,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_container_sizes_active ON container_sizes(is_active);
    CREATE INDEX IF NOT EXISTS idx_container_sizes_code ON container_sizes(size_code);
  `);

  // Insert default container sizes
  const insertContainerSize = db.prepare(`
    INSERT OR IGNORE INTO container_sizes 
    (size_name, size_code, teu_equivalent, length_ft, width_ft, height_ft, max_weight_kg, description, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultContainerSizes = [
    ["20 Footer Standard", "20ST", 1.0, 20, 8, 8.5, 28000, "Standard 20ft container", 1],
    ["20 Footer High Cube", "20HC", 1.0, 20, 8, 9.5, 28000, "High cube 20ft container", 2],
    ["40 Footer Standard", "40ST", 2.0, 40, 8, 8.5, 32000, "Standard 40ft container", 3],
    ["40 Footer High Cube", "40HC", 2.0, 40, 8, 9.5, 32000, "High cube 40ft container", 4],
    ["45 Footer High Cube", "45HC", 2.25, 45, 8, 9.5, 32000, "High cube 45ft container", 5],
    ["20 Footer Reefer", "20RF", 1.0, 20, 8, 8.5, 27000, "Refrigerated 20ft container", 6],
    ["40 Footer Reefer", "40RF", 2.0, 40, 8, 8.5, 30000, "Refrigerated 40ft container", 7],
  ];

  defaultContainerSizes.forEach(size => {
    try {
      insertContainerSize.run(...size);
    } catch (e) {
      // Ignore duplicates
    }
  });

  console.log("   ✓ Container sizes table created with default data");

  // ============================================================
  // 3. TRUCK SIZES TABLE
  // ============================================================
  console.log("🚚 Creating truck_sizes table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS truck_sizes (
      truck_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
      size_name TEXT UNIQUE NOT NULL,
      size_code TEXT,
      truck_type TEXT DEFAULT 'other',
      capacity_tons REAL,
      length_ft REAL,
      width_ft REAL,
      height_ft REAL,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CHECK (truck_type IN ('forward', 'closed_van', 'wingvan', 'flatbed', 'reefer', 'tanker', 'dump_truck', 'other'))
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_truck_sizes_active ON truck_sizes(is_active);
    CREATE INDEX IF NOT EXISTS idx_truck_sizes_type ON truck_sizes(truck_type);
    CREATE INDEX IF NOT EXISTS idx_truck_sizes_code ON truck_sizes(size_code);
  `);

  // Insert default truck sizes
  const insertTruckSize = db.prepare(`
    INSERT OR IGNORE INTO truck_sizes 
    (size_name, size_code, truck_type, capacity_tons, length_ft, width_ft, height_ft, description, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultTruckSizes = [
    ["4W Forward", "4WF", "forward", 2.0, 14, 6, 6, "4-wheeler forward truck", 1],
    ["6W Forward", "6WF", "forward", 5.0, 18, 7, 7, "6-wheeler forward truck", 2],
    ["10W Forward", "10WF", "forward", 12.0, 20, 8, 8, "10-wheeler forward truck", 3],
    ["6W Closed Van", "6WCV", "closed_van", 5.0, 18, 7, 7, "6-wheeler closed van", 4],
    ["10W Closed Van", "10WCV", "closed_van", 12.0, 20, 8, 8, "10-wheeler closed van", 5],
    ["6W Wing Van", "6WWV", "wingvan", 5.0, 18, 7, 7, "6-wheeler wing van", 6],
    ["10W Wing Van", "10WWV", "wingvan", 12.0, 20, 8, 8, "10-wheeler wing van", 7],
    ["20ft Flatbed", "20FB", "flatbed", 15.0, 20, 8, 3, "20ft flatbed trailer", 8],
    ["40ft Flatbed", "40FB", "flatbed", 25.0, 40, 8, 3, "40ft flatbed trailer", 9],
    ["Reefer Truck", "REEF", "reefer", 10.0, 20, 8, 8, "Refrigerated truck", 10],
  ];

  defaultTruckSizes.forEach(size => {
    try {
      insertTruckSize.run(...size);
    } catch (e) {
      // Ignore duplicates
    }
  });

  console.log("   ✓ Truck sizes table created with default data");

  // ============================================================
  // 4. APPROVAL HISTORY TABLE
  // ============================================================
  console.log("📜 Creating approval_history table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS approval_history (
      approval_id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_type TEXT NOT NULL,
      transaction_id INTEGER NOT NULL,
      reference_no TEXT,
      action TEXT NOT NULL,
      action_by INTEGER NOT NULL,
      action_by_name TEXT NOT NULL,
      action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      comments TEXT,
      previous_status TEXT,
      new_status TEXT,
      FOREIGN KEY (action_by) REFERENCES users(user_id),
      CHECK (action IN ('submitted', 'approved', 'rejected', 'cancelled', 'revised'))
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_approval_history_type ON approval_history(transaction_type);
    CREATE INDEX IF NOT EXISTS idx_approval_history_transaction ON approval_history(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_approval_history_action_by ON approval_history(action_by);
    CREATE INDEX IF NOT EXISTS idx_approval_history_date ON approval_history(action_date);
  `);

  console.log("   ✓ Approval history table created");

  // ============================================================
  // 5. UPDATE EXISTING TABLES (IF NEEDED)
  // ============================================================
  console.log("\n🔧 Checking and updating existing tables...");

  // Check if service_types needs is_active column
  const serviceTypesColumns = db.prepare(`PRAGMA table_info(service_types)`).all() as any[];
  const hasIsActive = serviceTypesColumns.some(col => col.name === 'is_active');
  
  if (!hasIsActive) {
    console.log("   ➕ Adding is_active column to service_types...");
    db.exec(`ALTER TABLE service_types ADD COLUMN is_active INTEGER DEFAULT 1;`);
  }

  // Check if clients table has all required columns
  const clientColumns = db.prepare(`PRAGMA table_info(clients)`).all() as any[];
  const clientColumnNames = clientColumns.map((col: any) => col.name);
  
  if (!clientColumnNames.includes('client_name')) {
    console.log("   ℹ️  Note: clients table structure may need review");
  }

  // ============================================================
  // 6. VERIFY SETUP
  // ============================================================
  console.log("\n🔍 Verifying new tables...\n");

  const newTables = ['categories', 'container_sizes', 'truck_sizes', 'approval_history'];
  
  newTables.forEach(tableName => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number };
    console.log(`   ✓ ${tableName.padEnd(20)} - ${count.count} rows`);
  });

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Database migration completed successfully!");
  console.log("=".repeat(60));
  
  console.log("\n✅ Added tables:");
  console.log("   • categories (service & expense categories)");
  console.log("   • container_sizes (20ft, 40ft, etc.)");
  console.log("   • truck_sizes (4W, 6W, 10W, etc.)");
  console.log("   • approval_history (approval tracking)");
  
  console.log("\n💡 Next steps:");
  console.log("   1. Restart your server");
  console.log("   2. Test the Master Setup page");
  console.log("   3. Verify all CRUD operations work");
  console.log("   4. Add more data as needed\n");

} catch (error: any) {
  console.error("\n❌ Migration failed:");
  console.error(error.message);
  console.error("\n📋 Stack trace:");
  console.error(error.stack);
  process.exit(1);
} finally {
  db.close();
}