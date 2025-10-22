"use strict";
// clear-database.ts
// Run this script to completely clear the database
// Usage: npx ts-node backend/clear-database.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, "sbclc.db");
console.log("🗑️  Starting database cleanup...\n");
try {
    // Check if database exists
    if (fs_1.default.existsSync(DB_PATH)) {
        console.log("📁 Database file found:", DB_PATH);
        // Backup the old database (optional)
        const backupPath = path_1.default.join(__dirname, `sbclc_backup_${Date.now()}.db`);
        fs_1.default.copyFileSync(DB_PATH, backupPath);
        console.log("💾 Backup created:", backupPath);
        // Delete the database file
        fs_1.default.unlinkSync(DB_PATH);
        console.log("✅ Database file deleted successfully\n");
    }
    else {
        console.log("ℹ️  No database file found at:", DB_PATH);
        console.log("   Database is already clean\n");
    }
    // Also clear any uploaded files (optional)
    const uploadsDir = path_1.default.join(__dirname, "../uploads");
    if (fs_1.default.existsSync(uploadsDir)) {
        console.log("🗑️  Clearing uploads directory...");
        fs_1.default.rmSync(uploadsDir, { recursive: true, force: true });
        console.log("✅ Uploads directory cleared\n");
    }
    console.log("=".repeat(50));
    console.log("🎉 Database cleanup completed successfully!");
    console.log("=".repeat(50));
    console.log("\n💡 Next steps:");
    console.log("   1. Run: npx ts-node backend/init-database.ts");
    console.log("   2. Start your server: npm run dev\n");
}
catch (error) {
    console.error("\n❌ Cleanup failed:");
    console.error(error.message);
    console.error("\n📋 Stack trace:");
    console.error(error.stack);
    process.exit(1);
}
