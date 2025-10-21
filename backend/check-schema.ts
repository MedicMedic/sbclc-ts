import Database from "better-sqlite3";

const db = new Database("sbclc.db");

console.log("📋 quotations table structure:");
const columns = db.prepare("PRAGMA table_info(quotations)").all();
console.table(columns);

db.close();