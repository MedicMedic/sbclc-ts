"use strict";
// migrate-add-approvals.ts
// Run this script to add the approval_history table to an existing database
// Usage: npx ts-node backend/migrate-add-approvals.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, "sbclc.db");
console.log("🚀 Starting migration to add approvals functionality...\n");
console.log("📁 Database location:", DB_PATH);
const db = new better_sqlite3_1.default(DB_PATH);
db.pragma("foreign_keys = ON");
try {
    // Check if approval_history table already exists
    const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='approval_history'
  `).get();
    if (tableExists) {
        console.log("⚠️  approval_history table already exists. Skipping creation.");
    }
    else {
        console.log("✅ Creating approval_history table...");
        db.exec(`
      CREATE TABLE approval_history (
        approval_id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_type VARCHAR(50) NOT NULL,
        transaction_id INTEGER NOT NULL,
        reference_no VARCHAR(50) NOT NULL,
        action VARCHAR(20) NOT NULL,
        approved_by VARCHAR(255),
        approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        comments TEXT,
        previous_status VARCHAR(50),
        new_status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("   ✔ approval_history table created");
        // Create indexes
        console.log("📊 Creating indexes...");
        db.exec(`
      CREATE INDEX IF NOT EXISTS idx_approval_history_type_id 
        ON approval_history(transaction_type, transaction_id);
      CREATE INDEX IF NOT EXISTS idx_approval_history_reference 
        ON approval_history(reference_no);
      CREATE INDEX IF NOT EXISTS idx_approval_history_date 
        ON approval_history(approved_at);
    `);
        console.log("   ✔ Indexes created");
    }
    // Add approvals permissions to roles if they don't exist
    console.log("\n✅ Checking and adding approval permissions...");
    const permissionsToAdd = [
        { role: "admin", module: "approvals", action: "view" },
        { role: "admin", module: "approvals", action: "approve" },
        { role: "admin", module: "approvals", action: "reject" },
        { role: "manager", module: "approvals", action: "view" },
        { role: "manager", module: "approvals", action: "approve" },
        { role: "manager", module: "approvals", action: "reject" },
        { role: "supervisor", module: "approvals", action: "view" },
        { role: "viewer", module: "approvals", action: "view" },
    ];
    const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_code, module_id, action)
    VALUES (?, ?, ?)
  `);
    let addedCount = 0;
    permissionsToAdd.forEach(perm => {
        const result = insertPermission.run(perm.role, perm.module, perm.action);
        if (result.changes > 0) {
            addedCount++;
        }
    });
    console.log(`   ✔ Added ${addedCount} new approval permissions`);
    // Verify the migration
    console.log("\n🔍 Verifying migration...");
    const approvalHistoryCount = db.prepare("SELECT COUNT(*) as count FROM approval_history").get();
    console.log(`   • approval_history table: ${approvalHistoryCount.count} records`);
    const permissionsCount = db.prepare(`
    SELECT COUNT(*) as count FROM role_permissions 
    WHERE module_id = 'approvals'
  `).get();
    console.log(`   • approvals permissions: ${permissionsCount.count} records`);
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Migration completed successfully!");
    console.log("=".repeat(60));
    console.log("\n💡 Next steps:");
    console.log("   1. Restart your server");
    console.log("   2. Test the approvals page");
    console.log("   3. Submit quotations for approval");
    console.log("   4. Approve or reject quotations\n");
}
catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error.message);
    console.error("\n📋 Stack trace:");
    console.error(error.stack);
    process.exit(1);
}
finally {
    db.close();
}
