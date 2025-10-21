// clear-database.ts
// Run this script to completely clear the database
// Usage: npx ts-node backend/clear-database.ts

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "sbclc.db");

console.log("🗑️  Starting database cleanup...\n");

try {
  // Check if database exists
  if (fs.existsSync(DB_PATH)) {
    console.log("📁 Database file found:", DB_PATH);
    
    // Backup the old database (optional)
    const backupPath = path.join(
      __dirname,
      `sbclc_backup_${Date.now()}.db`
    );
    fs.copyFileSync(DB_PATH, backupPath);
    console.log("💾 Backup created:", backupPath);
    
    // Delete the database file
    fs.unlinkSync(DB_PATH);
    console.log("✅ Database file deleted successfully\n");
  } else {
    console.log("ℹ️  No database file found at:", DB_PATH);
    console.log("   Database is already clean\n");
  }

  // Also clear any uploaded files (optional)
  const uploadsDir = path.join(__dirname, "../uploads");
  if (fs.existsSync(uploadsDir)) {
    console.log("🗑️  Clearing uploads directory...");
    fs.rmSync(uploadsDir, { recursive: true, force: true });
    console.log("✅ Uploads directory cleared\n");
  }

  console.log("=" .repeat(50));
  console.log("🎉 Database cleanup completed successfully!");
  console.log("=" .repeat(50));
  console.log("\n💡 Next steps:");
  console.log("   1. Run: npx ts-node backend/init-database.ts");
  console.log("   2. Start your server: npm run dev\n");
  
} catch (error: any) {
  console.error("\n❌ Cleanup failed:");
  console.error(error.message);
  console.error("\n📋 Stack trace:");
  console.error(error.stack);
  process.exit(1);
}