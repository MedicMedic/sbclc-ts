"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default("sbclc.db");
console.log("📋 quotations table structure:");
const columns = db.prepare("PRAGMA table_info(quotations)").all();
console.table(columns);
db.close();
