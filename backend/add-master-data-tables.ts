// add-master-data-tables.ts
// Migration to add Categories, Container Sizes, and Truck Sizes tables
// Run this: npx ts-node backend/add-master-data-tables.ts

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "sbclc.db");

console.log("🚀 Starting migration to add new master data tables...\n");
console.log("📁 Database location:", DB_PATH);

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

try {
  console.log("\n📋 Creating new tables...\n");

  // ============================================================
  // 1. CATEGORIES TABLE
  // ============================================================
  console.log("📁 Creating categories table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT NOT NULL UNIQUE,
      category_type TEXT NOT NULL CHECK(category_type IN ('service', 'expense', 'general')),
      parent_category_id INTEGER,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
    );
  `);

  // ============================================================
  // 2. CONTAINER SIZES TABLE
  // ============================================================
  console.log("📦 Creating container_sizes table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS container_sizes (
      container_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
      size_name TEXT NOT NULL UNIQUE,
      size_code TEXT UNIQUE,
      teu_equivalent REAL DEFAULT 1.0,
      length_ft REAL,
      width_ft REAL,
      height_ft REAL,
      max_weight_kg REAL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ============================================================
  // 3. TRUCK SIZES TABLE
  // ============================================================
  console.log("🚚 Creating truck_sizes table...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS truck_sizes (
      truck_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
      size_name TEXT NOT NULL UNIQUE,
      size_code TEXT UNIQUE,
      truck_type TEXT CHECK(truck_type IN ('forward', 'closed_van', 'wingvan', 'flatbed', 'reefer', 'tanker', 'dump_truck', 'other')),
      capacity_tons REAL,
      length_ft REAL,
      width_ft REAL,
      height_ft REAL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ============================================================
  // CREATE INDEXES
  // ============================================================
  console.log("\n📊 Creating indexes...");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(category_type);
    CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
    CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);
    
    CREATE INDEX IF NOT EXISTS idx_container_sizes_active ON container_sizes(is_active);
    CREATE INDEX IF NOT EXISTS idx_container_sizes_code ON container_sizes(size_code);
    
    CREATE INDEX IF NOT EXISTS idx_truck_sizes_active ON truck_sizes(is_active);
    CREATE INDEX IF NOT EXISTS idx_truck_sizes_code ON truck_sizes(size_code);
    CREATE INDEX IF NOT EXISTS idx_truck_sizes_type ON truck_sizes(truck_type);
  `);

  // ============================================================
  // INSERT DEFAULT DATA
  // ============================================================
  console.log("\n💾 Inserting default data...\n");

  // Default Categories
  console.log("📁 Inserting default categories...");
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (category_name, category_type, description, display_order)
    VALUES (?, ?, ?, ?)
  `);

  const defaultCategories = [
    // Service Categories
    ["Import Services", "service", "Import-related logistics services", 1],
    ["Export Services", "service", "Export-related logistics services", 2],
    ["Domestic Services", "service", "Domestic freight and forwarding", 3],
    ["Warehousing", "service", "Storage and warehousing services", 4],
    ["Customs Brokerage", "service", "Customs clearance services", 5],
    ["Transportation", "service", "Trucking and delivery services", 6],
    
    // Expense Categories
    ["Receipted Expenses", "expense", "Expenses with official receipts", 1],
    ["Non-Receipted Expenses", "expense", "Expenses without receipts", 2],
    ["Port Charges", "expense", "Port handling and terminal fees", 3],
    ["Documentation Fees", "expense", "Document processing fees", 4],
    ["Handling Charges", "expense", "Cargo handling charges", 5],
    
    // General Categories
    ["Standard", "general", "Standard category", 1],
    ["Premium", "general", "Premium category", 2],
    ["Express", "general", "Express service category", 3],
  ];

  defaultCategories.forEach(cat => insertCategory.run(...cat));
  console.log(`   ✔ Inserted ${defaultCategories.length} categories`);

  // Default Container Sizes
  console.log("📦 Inserting default container sizes...");
  const insertContainer = db.prepare(`
    INSERT OR IGNORE INTO container_sizes (
      size_name, size_code, teu_equivalent, length_ft, width_ft, height_ft, 
      max_weight_kg, description, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultContainers = [
    ["20 Footer (Standard)", "20FT", 1.0, 20, 8, 8.5, 28000, "Standard 20-foot container", 1],
    ["20 Footer (High Cube)", "20HC", 1.0, 20, 8, 9.5, 28000, "20-foot high cube container", 2],
    ["40 Footer (Standard)", "40FT", 2.0, 40, 8, 8.5, 30480, "Standard 40-foot container", 3],
    ["40 Footer (High Cube)", "40HC", 2.0, 40, 8, 9.5, 30480, "40-foot high cube container", 4],
    ["45 Footer (High Cube)", "45HC", 2.25, 45, 8, 9.5, 30480, "45-foot high cube container", 5],
    ["20 Footer (Reefer)", "20RF", 1.0, 20, 8, 8.5, 27400, "20-foot refrigerated container", 6],
    ["40 Footer (Reefer)", "40RF", 2.0, 40, 8, 8.5, 29500, "40-foot refrigerated container", 7],
    ["20 Footer (Open Top)", "20OT", 1.0, 20, 8, 8.5, 28000, "20-foot open top container", 8],
    ["40 Footer (Open Top)", "40OT", 2.0, 40, 8, 8.5, 30480, "40-foot open top container", 9],
    ["20 Footer (Flat Rack)", "20FR", 1.0, 20, 8, 8.5, 28000, "20-foot flat rack container", 10],
    ["40 Footer (Flat Rack)", "40FR", 2.0, 40, 8, 8.5, 30480, "40-foot flat rack container", 11],
  ];

  defaultContainers.forEach(container => insertContainer.run(...container));
  console.log(`   ✔ Inserted ${defaultContainers.length} container sizes`);

  // Default Truck Sizes
  console.log("🚚 Inserting default truck sizes...");
  const insertTruck = db.prepare(`
    INSERT OR IGNORE INTO truck_sizes (
      size_name, size_code, truck_type, capacity_tons, length_ft, 
      width_ft, height_ft, description, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultTrucks = [
    ["4W Forward", "4WF", "forward", 1.5, 10, 5, 5, "4-wheeler forward truck", 1],
    ["6W Forward", "6WF", "forward", 3.0, 16, 6, 6, "6-wheeler forward truck", 2],
    ["6W Closed Van", "6WCV", "closed_van", 3.0, 16, 6, 7, "6-wheeler closed van", 3],
    ["10W Forward", "10WF", "forward", 8.0, 20, 7, 7, "10-wheeler forward truck", 4],
    ["10W Closed Van", "10WCV", "closed_van", 8.0, 20, 7, 8, "10-wheeler closed van", 5],
    ["10W Wingvan", "10WWV", "wingvan", 8.0, 20, 7, 8, "10-wheeler wing van", 6],
    ["12W Closed Van", "12WCV", "closed_van", 12.0, 24, 8, 8, "12-wheeler closed van", 7],
    ["12W Wingvan", "12WWV", "wingvan", 12.0, 24, 8, 8, "12-wheeler wing van", 8],
    ["20 Footer Chassis", "20FCH", "flatbed", 20.0, 20, 8, 3, "20-foot container chassis", 9],
    ["40 Footer Chassis", "40FCH", "flatbed", 30.0, 40, 8, 3, "40-foot container chassis", 10],
    ["Reefer Truck (10W)", "10WR", "reefer", 8.0, 20, 7, 8, "10-wheeler refrigerated truck", 11],
    ["Reefer Truck (12W)", "12WR", "reefer", 12.0, 24, 8, 8, "12-wheeler refrigerated truck", 12],
    ["Dump Truck (6W)", "6WD", "dump_truck", 5.0, 16, 6, 5, "6-wheeler dump truck", 13],
    ["Dump Truck (10W)", "10WD", "dump_truck", 10.0, 20, 7, 6, "10-wheeler dump truck", 14],
  ];

  defaultTrucks.forEach(truck => insertTruck.run(...truck));
  console.log(`   ✔ Inserted ${defaultTrucks.length} truck sizes`);

  // ============================================================
  // VERIFICATION
  // ============================================================
  console.log("\n🔍 Verifying new tables...\n");

  const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as any;
  const containerCount = db.prepare("SELECT COUNT(*) as count FROM container_sizes").get() as any;
  const truckCount = db.prepare("SELECT COUNT(*) as count FROM truck_sizes").get() as any;

  console.log(`✅ Categories table created with ${categoryCount.count} records`);
  console.log(`✅ Container sizes table created with ${containerCount.count} records`);
  console.log(`✅ Truck sizes table created with ${truckCount.count} records`);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Migration completed successfully!");
  console.log("=".repeat(60));

  console.log("\n📝 Summary:");
  console.log("   • Added 'categories' table with hierarchical support");
  console.log("   • Added 'container_sizes' table with TEU calculations");
  console.log("   • Added 'truck_sizes' table with capacity tracking");
  console.log("   • Created indexes for optimal performance");
  console.log("   • Populated with industry-standard default data");

  console.log("\n💡 Next Steps:");
  console.log("   1. Restart your backend server");
  console.log("   2. Test the new Master Setup tabs");
  console.log("   3. Customize categories and sizes as needed\n");

} catch (error: any) {
  console.error("\n❌ Migration failed:");
  console.error(error.message);
  console.error("\n📋 Stack trace:");
  console.error(error.stack);
  process.exit(1);
} finally {
  db.close();
}