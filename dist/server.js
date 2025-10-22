"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts - Drop-in replacement, TypeScript-safe, aligned to newdb.sql
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const SECRET = process.env.JWT_SECRET || "supersecret";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
// -----------------------------
// Database
// -----------------------------
const db = new better_sqlite3_1.default("sbclc.db");
db.pragma("foreign_keys = ON");
// -----------------------------
// Uploads (avatars)
// -----------------------------
const uploadDir = path_1.default.join(__dirname, "../uploads/avatars");
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `avatar-${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ok = /\.(jpe?g|png|gif|webp)$/i.test(file.originalname) ||
            /image\/.*/.test(file.mimetype);
        if (!ok) {
            cb(new Error("Only image files are allowed"));
        }
        else {
            cb(null, true);
        }
    },
});
// -----------------------------
// Helpers
// -----------------------------
function sendError(res, err, message = "Server error", code = 500) {
    console.error("❌", message, err?.message || err);
    return res.status(code).json({ message, error: err?.message || String(err) });
}
function requireFields(obj, fields) {
    for (const f of fields) {
        if (obj[f] === undefined || obj[f] === null || obj[f] === "")
            return f;
    }
    return null;
}
function buildInsert(table, payload) {
    const keys = Object.keys(payload);
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`;
    return { sql, values: keys.map((k) => payload[k]) };
}
function buildUpdate(table, idColumn, id, payload) {
    const keys = Object.keys(payload).filter((k) => payload[k] !== undefined);
    if (keys.length === 0)
        return null;
    const set = keys.map((k) => `${k} = ?`).join(", ");
    const sql = `UPDATE ${table} SET ${set} WHERE ${idColumn} = ?`;
    return { sql, values: [...keys.map((k) => payload[k]), id] };
}
const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return res
            .status(401)
            .json({ message: "No authorization header provided" });
    const token = header.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "No token provided" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
const requireRole = (allowed) => {
    const set = Array.isArray(allowed) ? allowed : [allowed];
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (!set.includes(req.user.role))
            return res.status(403).json({ message: "Forbidden" });
        next();
    };
};
// -----------------------------
// AUTH ROUTES
// -----------------------------
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });
    try {
        const user = db
            .prepare("SELECT * FROM users WHERE email = ? AND is_active = 1")
            .get(email);
        if (!user) {
            console.log("❌ No user found for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }
        console.log("🧩 User found:", user.email);
        console.log("🔐 Comparing", password, "to hash:", user.password_hash);
        const valid = bcryptjs_1.default.compareSync(password, user.password_hash);
        if (!valid) {
            console.log("❌ Password mismatch for:", user.email);
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
        // sanitize output
        delete user.password_hash;
        console.log("✅ Login successful for:", user.email);
        res.json({ token, user });
    }
    catch (err) {
        console.error("💥 Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// -----------------------------
// USERS (CRUD)
// -----------------------------
app.get("/api/users", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        const rows = db
            .prepare(`SELECT user_id, email, full_name, first_name, last_name, avatar, role, department, is_active, created_at, updated_at, last_login
         FROM users ORDER BY created_at DESC`)
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch users");
    }
});
app.get("/api/users/:id", verifyToken, (req, res) => {
    try {
        const row = db
            .prepare("SELECT * FROM users WHERE user_id = ?")
            .get(req.params.id);
        if (!row)
            return res.status(404).json({ message: "User not found" });
        res.json(row);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch user");
    }
});
app.post("/api/users", verifyToken, requireRole(["admin"]), upload.single("avatar"), (req, res) => {
    try {
        const missing = requireFields(req.body, ["email", "full_name", "role"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        const password = req.body.password || "password123";
        const password_hash = bcryptjs_1.default.hashSync(password, 10);
        const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : null;
        const { sql, values } = buildInsert("users", {
            email: req.body.email,
            password_hash,
            full_name: req.body.full_name,
            first_name: req.body.first_name || null,
            last_name: req.body.last_name || null,
            avatar,
            role: req.body.role,
            department: req.body.department || null,
            is_active: req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1,
        });
        db.prepare(sql).run(...values);
        res.json({ message: "User created" });
    }
    catch (err) {
        if (req.file) {
            try {
                fs_1.default.unlinkSync(path_1.default.join(uploadDir, req.file.filename));
            }
            catch { }
        }
        if (err.message && err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Email already exists" });
        return sendError(res, err, "Failed to create user");
    }
});
app.put("/api/profile", verifyToken, upload.single("avatar"), (req, res) => {
    try {
        const userId = req.user.id;
        const uploadDir = path_1.default.join(__dirname, "uploads/avatars");
        // Collect allowed fields
        const allowed = [
            "email",
            "full_name",
            "first_name",
            "last_name",
            "role",
            "department",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed) {
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        }
        // Handle avatar upload
        if (req.file) {
            payload.avatar = `/uploads/avatars/${req.file.filename}`;
        }
        // Handle password change (expects current_password + new_password)
        let requiresReauth = false;
        if (req.body.new_password) {
            const existing = db
                .prepare("SELECT password_hash FROM users WHERE user_id = ?")
                .get(userId);
            if (!existing) {
                if (req.file) {
                    try {
                        fs_1.default.unlinkSync(path_1.default.join(uploadDir, req.file.filename));
                    }
                    catch { }
                }
                return res.status(404).json({ message: "User not found" });
            }
            if (!bcryptjs_1.default.compareSync(req.body.current_password, existing.password_hash)) {
                if (req.file) {
                    try {
                        fs_1.default.unlinkSync(path_1.default.join(uploadDir, req.file.filename));
                    }
                    catch { }
                }
                return res
                    .status(400)
                    .json({ message: "Current password is incorrect" });
            }
            payload.password_hash = bcryptjs_1.default.hashSync(req.body.new_password, 10);
            requiresReauth = true;
        }
        payload.updated_at = new Date().toISOString();
        // Build and execute update
        const upd = buildUpdate("users", "user_id", userId, payload);
        if (!upd) {
            if (req.file) {
                try {
                    fs_1.default.unlinkSync(path_1.default.join(uploadDir, req.file.filename));
                }
                catch { }
            }
            return res.status(400).json({ message: "No fields to update" });
        }
        db.prepare(upd.sql).run(...upd.values);
        // Fetch updated user (exclude password)
        const updatedUser = db
            .prepare(`SELECT user_id, email, first_name, last_name, full_name, role, department, avatar
         FROM users WHERE user_id = ?`)
            .get(userId);
        res.json({ user: updatedUser, requiresReauth });
    }
    catch (err) {
        // Cleanup on failure
        if (req.file) {
            try {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, "uploads/avatars", req.file.filename));
            }
            catch { }
        }
        return sendError(res, err, "Failed to update profile");
    }
});
app.delete("/api/users/:id", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        db.prepare("UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?").run(req.params.id);
        res.json({ message: "User deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete user");
    }
});
// -----------------------------
// ROLES & PERMISSIONS
// -----------------------------
app.get("/api/roles", verifyToken, (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM roles ORDER BY role_name").all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch roles");
    }
});
app.post("/api/roles", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        const missing = requireFields(req.body, ["role_code", "role_name"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        console.log("📝 Creating role:", req.body.role_code);
        console.log("📋 Modules received:", req.body.modules);
        const result = db.prepare("INSERT INTO roles (role_code, role_name, description, is_active) VALUES (?, ?, ?, ?)").run(req.body.role_code, req.body.role_name, req.body.description || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        // Handle module permissions if provided
        if (req.body.modules && typeof req.body.modules === 'object') {
            const insertPerm = db.prepare("INSERT INTO role_permissions (role_code, module_id, action, is_granted) VALUES (?, ?, ?, 1)");
            let permissionCount = 0;
            db.transaction(() => {
                for (const [moduleId, actions] of Object.entries(req.body.modules)) {
                    if (Array.isArray(actions)) {
                        for (const action of actions) {
                            insertPerm.run(req.body.role_code, moduleId, action);
                            permissionCount++;
                            console.log(`  ✓ Added: ${req.body.role_code} -> ${moduleId}.${action}`);
                        }
                    }
                }
            })();
            console.log(`✅ Saved ${permissionCount} permissions for role ${req.body.role_code}`);
        }
        else {
            console.log("⚠️ No modules provided in request body");
        }
        res.json({ message: "Role created", role_id: result.lastInsertRowid });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Role code already exists" });
        return sendError(res, err, "Failed to create role");
    }
});
app.put("/api/roles/:id", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        const id = req.params.id;
        const payload = {};
        if (req.body.role_name !== undefined)
            payload.role_name = req.body.role_name;
        if (req.body.description !== undefined)
            payload.description = req.body.description;
        if (req.body.is_active !== undefined)
            payload.is_active = req.body.is_active ? 1 : 0;
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("roles", "role_id", id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Role updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update role");
    }
});
app.delete("/api/roles/:id", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        const id = req.params.id;
        // Get role info first
        const role = db
            .prepare("SELECT role_code FROM roles WHERE role_id = ?")
            .get(id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Check if role has users assigned
        const usersWithRole = db
            .prepare("SELECT COUNT(*) as count FROM users WHERE role = ?")
            .get(role.role_code);
        if (usersWithRole.count > 0) {
            return res.status(400).json({
                message: `Cannot delete role: ${usersWithRole.count} users are assigned to this role. Please reassign users first.`
            });
        }
        // Permanent delete in transaction
        db.transaction(() => {
            // Delete role permissions first (foreign key constraint)
            db.prepare("DELETE FROM role_permissions WHERE role_code = ?").run(role.role_code);
            // Delete the role itself
            db.prepare("DELETE FROM roles WHERE role_id = ?").run(id);
        })();
        res.json({ message: "Role permanently deleted" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete role");
    }
});
// role permissions
app.get("/api/roles/:roleCode/permissions", verifyToken, (req, res) => {
    try {
        const { roleCode } = req.params;
        const role = db
            .prepare("SELECT role_code FROM roles WHERE role_code = ? AND is_active = 1")
            .get(roleCode);
        if (!role)
            return res.status(404).json({ message: "Role not found" });
        const rows = db
            .prepare("SELECT module_id, action, is_granted FROM role_permissions WHERE role_code = ? AND is_granted = 1")
            .all(roleCode);
        const grouped = {};
        rows.forEach((r) => {
            if (!grouped[r.module_id])
                grouped[r.module_id] = [];
            grouped[r.module_id].push(r.action);
        });
        res.json(grouped);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch permissions");
    }
});
app.put("/api/roles/:roleCode/permissions", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        const { roleCode } = req.params;
        const { permissions } = req.body;
        if (!permissions)
            return res
                .status(400)
                .json({ message: "Permissions payload required" });
        const deleteStmt = db.prepare("DELETE FROM role_permissions WHERE role_code = ?");
        const insertStmt = db.prepare("INSERT INTO role_permissions (role_code, module_id, action, is_granted) VALUES (?, ?, ?, 1)");
        db.transaction(() => {
            deleteStmt.run(roleCode);
            if (Array.isArray(permissions)) {
                for (const p of permissions)
                    insertStmt.run(roleCode, p.module_id, p.action);
            }
            else {
                for (const [module_id, actions] of Object.entries(permissions)) {
                    actions.forEach((a) => insertStmt.run(roleCode, module_id, a));
                }
            }
        })();
        res.json({ message: "Permissions updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update permissions");
    }
});
// list all available module/action pairs (for permission management UIs)
app.get("/api/permissions", verifyToken, requireRole(["admin", "manager"]), (req, res) => {
    try {
        const rows = db
            .prepare("SELECT DISTINCT module_id, action FROM role_permissions ORDER BY module_id, action")
            .all();
        const grouped = {};
        rows.forEach((r) => {
            if (!grouped[r.module_id])
                grouped[r.module_id] = [];
            if (!grouped[r.module_id].includes(r.action))
                grouped[r.module_id].push(r.action);
        });
        res.json(grouped);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch permissions catalog");
    }
});
// -----------------------------
// CLIENTS
// -----------------------------
app.get("/api/clients", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM clients WHERE is_active = 1 ORDER BY client_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch clients");
    }
});
app.get("/api/clients/:id", verifyToken, (req, res) => {
    try {
        const client = db
            .prepare("SELECT * FROM clients WHERE client_id = ?")
            .get(req.params.id);
        if (!client)
            return res.status(404).json({ message: "Client not found" });
        res.json(client);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch client");
    }
});
app.post("/api/clients", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "client_code",
            "client_name",
            "contact_person",
            "email",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        const payload = {
            client_code: req.body.client_code,
            client_name: req.body.client_name,
            contact_person: req.body.contact_person,
            contact_position: req.body.contact_position || null,
            email: req.body.email,
            phone: req.body.phone || null,
            address: req.body.address || null,
            payment_terms: req.body.payment_terms || "Net 30 Days",
            credit_limit: req.body.credit_limit || 0,
            preferred_currency: req.body.preferred_currency || "PHP",
            is_active: req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1,
        };
        const { sql, values } = buildInsert("clients", payload);
        db.prepare(sql).run(...values);
        res.json({ message: "Client created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Client code already exists" });
        return sendError(res, err, "Failed to create client");
    }
});
app.put("/api/clients/:id", verifyToken, (req, res) => {
    try {
        const id = req.params.id;
        const allowed = [
            "client_code",
            "client_name",
            "contact_person",
            "contact_position",
            "email",
            "phone",
            "address",
            "payment_terms",
            "credit_limit",
            "preferred_currency",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("clients", "client_id", id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Client updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update client");
    }
});
app.delete("/api/clients/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE clients SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE client_id = ?").run(req.params.id);
        res.json({ message: "Client deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete client");
    }
});
// -----------------------------
// SERVICE TYPES
// -----------------------------
app.get("/api/service-types", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM service_types WHERE is_active = 1 ORDER BY service_type_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch service types");
    }
});
app.post("/api/service-types", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["service_type_name", "category"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO service_types (service_type_name, category, description, is_active) VALUES (?, ?, ?, ?)").run(req.body.service_type_name, req.body.category, req.body.description || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Service type created" });
    }
    catch (err) {
        return sendError(res, err, "Failed to create service type");
    }
});
app.put("/api/service-types/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "service_type_name",
            "category",
            "description",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("service_types", "service_type_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Service type updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update service type");
    }
});
app.delete("/api/service-types/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE service_types SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE service_type_id = ?").run(req.params.id);
        res.json({ message: "Service type deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete service type");
    }
});
// -----------------------------
// CATEGORIES
// -----------------------------
app.get("/api/categories", verifyToken, (req, res) => {
    try {
        const { type } = req.query;
        let sql = "SELECT * FROM categories WHERE is_active = 1";
        const params = [];
        if (type && type !== "all") {
            sql += " AND category_type = ?";
            params.push(type);
        }
        sql += " ORDER BY display_order, category_name";
        const rows = db.prepare(sql).all(...params);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch categories");
    }
});
app.post("/api/categories", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["category_name", "category_type"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO categories (category_name, category_type, parent_category_id, description, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)").run(req.body.category_name, req.body.category_type, req.body.parent_category_id || null, req.body.description || null, req.body.display_order || 0, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Category created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Category name already exists" });
        return sendError(res, err, "Failed to create category");
    }
});
app.put("/api/categories/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "category_name",
            "category_type",
            "parent_category_id",
            "description",
            "display_order",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("categories", "category_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Category updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update category");
    }
});
app.delete("/api/categories/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE categories SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE category_id = ?").run(req.params.id);
        res.json({ message: "Category deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete category");
    }
});
// -----------------------------
// PORTS
// -----------------------------
app.get("/api/ports", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM ports WHERE is_active = 1 ORDER BY port_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch ports");
    }
});
app.post("/api/ports", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["port_name", "port_code"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO ports (port_name, port_code, country, port_type, is_active) VALUES (?, ?, ?, ?, ?)").run(req.body.port_name, req.body.port_code, req.body.country || null, req.body.port_type || "seaport", req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Port created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Port code already exists" });
        return sendError(res, err, "Failed to create port");
    }
});
app.put("/api/ports/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "port_name",
            "port_code",
            "country",
            "port_type",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("ports", "port_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Port updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update port");
    }
});
app.delete("/api/ports/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE ports SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE port_id = ?").run(req.params.id);
        res.json({ message: "Port deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete port");
    }
});
// -----------------------------
// SHIPPING LINES
// -----------------------------
app.get("/api/shipping-lines", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM shipping_lines WHERE is_active = 1 ORDER BY line_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch shipping lines");
    }
});
app.post("/api/shipping-lines", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["line_name", "line_code"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO shipping_lines (line_name, line_code, country, contact_email, contact_phone, is_active) VALUES (?, ?, ?, ?, ?, ?)").run(req.body.line_name, req.body.line_code, req.body.country || null, req.body.contact_email || null, req.body.contact_phone || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Shipping line created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res
                .status(400)
                .json({ message: "Shipping line code already exists" });
        return sendError(res, err, "Failed to create shipping line");
    }
});
app.put("/api/shipping-lines/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "line_name",
            "line_code",
            "country",
            "contact_email",
            "contact_phone",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("shipping_lines", "shipping_line_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Shipping line updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update shipping line");
    }
});
app.delete("/api/shipping-lines/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE shipping_lines SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE shipping_line_id = ?").run(req.params.id);
        res.json({ message: "Shipping line deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete shipping line");
    }
});
// -----------------------------
// CURRENCIES
// -----------------------------
app.get("/api/currencies", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM currencies WHERE is_active = 1 ORDER BY currency_code")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch currencies");
    }
});
app.post("/api/currencies", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "currency_code",
            "currency_name",
            "symbol",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO currencies (currency_code, currency_name, symbol, exchange_rate, is_active) VALUES (?, ?, ?, ?, ?)").run(req.body.currency_code, req.body.currency_name, req.body.symbol, req.body.exchange_rate || 1.0, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Currency created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Currency code already exists" });
        return sendError(res, err, "Failed to create currency");
    }
});
app.put("/api/currencies/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "currency_code",
            "currency_name",
            "symbol",
            "exchange_rate",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("currencies", "currency_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Currency updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update currency");
    }
});
app.delete("/api/currencies/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE currencies SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE currency_id = ?").run(req.params.id);
        res.json({ message: "Currency deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete currency");
    }
});
// -----------------------------
// TRUCKERS
// -----------------------------
app.get("/api/truckers", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM truckers WHERE is_active = 1 ORDER BY trucker_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch truckers");
    }
});
app.post("/api/truckers", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["trucker_name", "trucker_type"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO truckers (trucker_name, trucker_type, contact_person, contact_phone, address, is_active) VALUES (?, ?, ?, ?, ?, ?)").run(req.body.trucker_name, req.body.trucker_type, req.body.contact_person || null, req.body.contact_phone || null, req.body.address || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Trucker created" });
    }
    catch (err) {
        return sendError(res, err, "Failed to create trucker");
    }
});
app.put("/api/truckers/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "trucker_name",
            "trucker_type",
            "contact_person",
            "contact_phone",
            "address",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("truckers", "trucker_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Trucker updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update trucker");
    }
});
app.delete("/api/truckers/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE truckers SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE trucker_id = ?").run(req.params.id);
        res.json({ message: "Trucker deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete trucker");
    }
});
// -----------------------------
// WAREHOUSES
// -----------------------------
app.get("/api/warehouses", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM warehouses WHERE is_active = 1 ORDER BY warehouse_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch warehouses");
    }
});
app.post("/api/warehouses", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "warehouse_name",
            "warehouse_code",
            "address",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO warehouses (warehouse_name, warehouse_code, address, warehouse_type, capacity, is_active) VALUES (?, ?, ?, ?, ?, ?)").run(req.body.warehouse_name, req.body.warehouse_code, req.body.address, req.body.warehouse_type || "standard", req.body.capacity || 0, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Warehouse created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Warehouse code already exists" });
        return sendError(res, err, "Failed to create warehouse");
    }
});
app.put("/api/warehouses/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "warehouse_name",
            "warehouse_code",
            "address",
            "warehouse_type",
            "capacity",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("warehouses", "warehouse_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Warehouse updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update warehouse");
    }
});
app.delete("/api/warehouses/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE warehouses SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE warehouse_id = ?").run(req.params.id);
        res.json({ message: "Warehouse deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete warehouse");
    }
});
// -----------------------------
// CONTAINER SIZES
// -----------------------------
app.get("/api/container-sizes", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM container_sizes WHERE is_active = 1 ORDER BY display_order")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch container sizes");
    }
});
app.post("/api/container-sizes", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["size_name"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO container_sizes (size_name, size_code, description, display_order, is_active) VALUES (?, ?, ?, ?, ?)").run(req.body.size_name, req.body.size_code || null, req.body.description || null, req.body.display_order || 0, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Container size created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Size name already exists" });
        return sendError(res, err, "Failed to create container size");
    }
});
app.put("/api/container-sizes/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "size_name",
            "size_code",
            "description",
            "display_order",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("container_sizes", "container_size_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Container size updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update container size");
    }
});
app.delete("/api/container-sizes/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE container_sizes SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE container_size_id = ?").run(req.params.id);
        res.json({ message: "Container size deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete container size");
    }
});
// -----------------------------
// TRUCK SIZES
// -----------------------------
app.get("/api/truck-sizes", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM truck_sizes WHERE is_active = 1 ORDER BY display_order")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch truck sizes");
    }
});
app.post("/api/truck-sizes", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["size_name"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO truck_sizes (size_name, size_code, truck_type, description, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)").run(req.body.size_name, req.body.size_code || null, req.body.truck_type || "other", req.body.description || null, req.body.display_order || 0, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Truck size created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res
                .status(400)
                .json({ message: "Truck size name already exists" });
        return sendError(res, err, "Failed to create truck size");
    }
});
app.put("/api/truck-sizes/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "size_name",
            "size_code",
            "truck_type",
            "description",
            "display_order",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("truck_sizes", "truck_size_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Truck size updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update truck size");
    }
});
app.delete("/api/truck-sizes/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE truck_sizes SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE truck_size_id = ?").run(req.params.id);
        res.json({ message: "Truck size deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete truck size");
    }
});
// -----------------------------
// SERVICE RATES
// -----------------------------
app.get("/api/service-rates", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM service_rates WHERE is_active = 1 ORDER BY service_type, category")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch service rates");
    }
});
app.post("/api/service-rates", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "service_type",
            "category",
            "unit_price",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO service_rates (service_type, category, unit_price, description, is_active) VALUES (?, ?, ?, ?, ?)").run(req.body.service_type, req.body.category, req.body.unit_price, req.body.description || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Service rate created" });
    }
    catch (err) {
        return sendError(res, err, "Failed to create service rate");
    }
});
app.put("/api/service-rates/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "service_type",
            "category",
            "unit_price",
            "description",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("service_rates", "rate_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Service rate updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update service rate");
    }
});
app.delete("/api/service-rates/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE service_rates SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE rate_id = ?").run(req.params.id);
        res.json({ message: "Service rate deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete service rate");
    }
});
// -----------------------------
// EXPENSE CATEGORIES (and alias /api/expense-types for frontend)
// -----------------------------
app.get("/api/expense-categories", verifyToken, (req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM expense_categories WHERE is_active = 1 ORDER BY category_name")
            .all();
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch expense categories");
    }
});
// alias for backward compatibility
app.get("/api/expense-types", verifyToken, (req, res) => {
    return app._router.handle(req, res, () => { }, "/api/expense-categories");
});
app.post("/api/expense-categories", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, ["category_name", "category"]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO expense_categories (category_name, category, description, is_active) VALUES (?, ?, ?, ?)").run(req.body.category_name, req.body.category, req.body.description || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Expense category created" });
    }
    catch (err) {
        return sendError(res, err, "Failed to create expense category");
    }
});
app.put("/api/expense-categories/:id", verifyToken, (req, res) => {
    try {
        const allowed = ["category_name", "category", "description", "is_active"];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("expense_categories", "category_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Expense category updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update expense category");
    }
});
app.delete("/api/expense-categories/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE expense_categories SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE category_id = ?").run(req.params.id);
        res.json({ message: "Expense category deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete expense category");
    }
});
// -----------------------------
// STATUSES
// -----------------------------
app.get("/api/statuses", verifyToken, (req, res) => {
    try {
        const { category } = req.query;
        let sql = "SELECT * FROM statuses WHERE is_active = 1";
        const params = [];
        if (category) {
            sql += " AND category = ?";
            params.push(category);
        }
        sql += " ORDER BY sequence";
        const rows = db.prepare(sql).all(...params);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch statuses");
    }
});
app.post("/api/statuses", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "status_code",
            "status_name",
            "color",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO statuses (status_code, status_name, category, color, sequence, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)").run(req.body.status_code, req.body.status_name, req.body.category || null, req.body.color, req.body.sequence || 0, req.body.description || null, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Status created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Status code already exists" });
        return sendError(res, err, "Failed to create status");
    }
});
app.put("/api/statuses/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "status_code",
            "status_name",
            "category",
            "color",
            "sequence",
            "description",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("statuses", "status_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Status updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update status");
    }
});
app.delete("/api/statuses/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE statuses SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE status_id = ?").run(req.params.id);
        res.json({ message: "Status deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete status");
    }
});
// -----------------------------
// MILESTONES
// -----------------------------
app.get("/api/milestones", verifyToken, (req, res) => {
    try {
        const { serviceType } = req.query;
        let sql = "SELECT * FROM milestones WHERE is_active = 1";
        const params = [];
        if (serviceType) {
            sql += " AND service_type = ?";
            params.push(serviceType);
        }
        sql += " ORDER BY sequence_order";
        const rows = db.prepare(sql).all(...params);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch milestones");
    }
});
app.post("/api/milestones", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "milestone_code",
            "milestone_name",
            "service_type",
            "sequence_order",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        db.prepare("INSERT INTO milestones (milestone_code, milestone_name, service_type, sequence_order, description, estimated_days, notify_before_days, is_required, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(req.body.milestone_code, req.body.milestone_name, req.body.service_type, req.body.sequence_order, req.body.description || null, req.body.estimated_days || 0, req.body.notify_before_days || 0, req.body.is_required !== undefined ? (req.body.is_required ? 1 : 0) : 1, req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1);
        res.json({ message: "Milestone created" });
    }
    catch (err) {
        if (err.message.includes("UNIQUE"))
            return res.status(400).json({ message: "Milestone code already exists" });
        return sendError(res, err, "Failed to create milestone");
    }
});
app.put("/api/milestones/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "milestone_code",
            "milestone_name",
            "service_type",
            "sequence_order",
            "description",
            "estimated_days",
            "notify_before_days",
            "is_required",
            "is_active",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("milestones", "milestone_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Milestone updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update milestone");
    }
});
app.delete("/api/milestones/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE milestones SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE milestone_id = ?").run(req.params.id);
        res.json({ message: "Milestone deactivated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete milestone");
    }
});
// -----------------------------
// QUOTATIONS & QUOTATION ITEMS
// -----------------------------
app.get("/api/quotations", verifyToken, (req, res) => {
    try {
        const { status, client_id } = req.query;
        // ✅ Don't filter by is_deleted - let the frontend handle it
        let sql = "SELECT * FROM quotations";
        const params = [];
        const conditions = [];
        if (status) {
            conditions.push("status = ?");
            params.push(status);
        }
        if (client_id) {
            conditions.push("client_id = ?");
            params.push(client_id);
        }
        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }
        sql += " ORDER BY created_at DESC";
        const rows = db.prepare(sql).all(...params);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch quotations");
    }
});
app.get("/api/quotations/:id", verifyToken, (req, res) => {
    try {
        const q = db
            .prepare("SELECT * FROM quotations WHERE quotation_id = ?")
            .get(req.params.id);
        if (!q)
            return res.status(404).json({ message: "Quotation not found" });
        const items = db
            .prepare("SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY item_sequence")
            .all(req.params.id);
        res.json({ ...q, items });
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch quotation");
    }
});
app.post("/api/quotations", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "quotation_number",
            "quotation_date",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        const payload = {
            quotation_number: req.body.quotation_number,
            booking_id: req.body.booking_id || null,
            client_id: req.body.client_id || null,
            service_type_id: req.body.service_type_id || null,
            quotation_date: req.body.quotation_date,
            valid_until: req.body.valid_until || null,
            origin: req.body.origin || null,
            destination: req.body.destination || null,
            exchange_rate: req.body.exchange_rate || 1.0,
            base_currency: req.body.base_currency || "PHP",
            service_description: req.body.service_description || null,
            notes: req.body.notes || null,
            receipted_total: req.body.receipted_total || 0,
            non_receipted_total: req.body.non_receipted_total || 0,
            total_amount: req.body.total_amount || 0,
            prepared_by: req.body.prepared_by || null,
            approved_by: req.body.approved_by || null,
            status: req.body.status || "draft",
            contact_person: req.body.contact_person || null,
            contact_position: req.body.contact_position || null,
            consignee_position: req.body.consignee_position || null,
            address: req.body.address || null,
            contact_no: req.body.contact_no || null,
            payment_term: req.body.payment_term || null,
            is_deleted: req.body.is_deleted !== undefined ? (req.body.is_deleted ? 1 : 0) : 0,
        };
        const { sql, values } = buildInsert("quotations", payload);
        const result = db.prepare(sql).run(...values);
        const quotation_id = result.lastInsertRowid;
        if (Array.isArray(req.body.items) && req.body.items.length > 0) {
            const insertItem = db.prepare(`INSERT INTO quotation_items (quotation_id, item_sequence, description, category, warehouse, container_size, equipment_type, currency, quantity, unit, rate, amount, custom_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            db.transaction(() => {
                for (let i = 0; i < req.body.items.length; i++) {
                    const it = req.body.items[i];
                    insertItem.run(quotation_id, it.item_sequence || i + 1, // Use provided sequence or auto-increment
                    it.description, it.category, it.warehouse || null, it.container_size || it.containerSize || null, it.equipment_type || null, it.currency || "PHP", it.quantity || 1, it.unit || "pcs", it.rate || 0, it.amount || 0, it.custom_data ? JSON.stringify(it.custom_data) : null);
                }
            })();
        }
        res.json({ message: "Quotation created", quotation_id });
    }
    catch (err) {
        return sendError(res, err, "Failed to create quotation");
    }
});
app.put("/api/quotations/:id", verifyToken, (req, res) => {
    try {
        const id = req.params.id;
        const allowed = [
            "quotation_number",
            "booking_id",
            "client_id",
            "service_type_id",
            "quotation_date",
            "valid_until",
            "origin",
            "destination",
            "exchange_rate",
            "base_currency",
            "service_description",
            "notes",
            "receipted_total",
            "non_receipted_total",
            "total_amount",
            "prepared_by",
            "approved_by",
            "status",
            "contact_person",
            "contact_position",
            "consignee_position",
            "address",
            "contact_no",
            "payment_term",
            "is_deleted",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("quotations", "quotation_id", id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        // If items provided, replace them (simple approach)
        if (req.body.items) {
            db.transaction(() => {
                db.prepare("DELETE FROM quotation_items WHERE quotation_id = ?").run(id);
                const insertItem = db.prepare(`INSERT INTO quotation_items (quotation_id, item_sequence, description, category, warehouse, container_size, equipment_type, currency, quantity, unit, rate, amount, custom_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                for (let i = 0; i < req.body.items.length; i++) {
                    const it = req.body.items[i];
                    insertItem.run(id, it.item_sequence || i + 1, // Use provided sequence or auto-increment
                    it.description, it.category, it.warehouse || null, it.container_size || it.containerSize || null, it.equipment_type || null, it.currency || "PHP", it.quantity || 1, it.unit || "pcs", it.rate || 0, it.amount || 0, it.custom_data ? JSON.stringify(it.custom_data) : null);
                }
            })();
        }
        res.json({ message: "Quotation updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update quotation");
    }
});
app.delete("/api/quotations/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE quotations SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").run(req.params.id);
        res.json({ message: "Quotation deleted (soft)" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete quotation");
    }
});
// Individual quotation items endpoints (optional)
app.get("/api/quotations/:id/items", verifyToken, (req, res) => {
    try {
        const items = db
            .prepare("SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY item_sequence")
            .all(req.params.id);
        res.json(items);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch quotation items");
    }
});
app.get("/api/quotation-items/:id", verifyToken, (req, res) => {
    try {
        const item = db
            .prepare("SELECT * FROM quotation_items WHERE item_id = ?")
            .get(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Item not found" });
        res.json(item);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch item");
    }
});
app.delete("/api/quotation-items/:id", verifyToken, (req, res) => {
    try {
        db.prepare("DELETE FROM quotation_items WHERE item_id = ?").run(req.params.id);
        res.json({ message: "Quotation item deleted" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete quotation item");
    }
});
// -----------------------------
// QUOTATION STATS ENDPOINT
// -----------------------------
app.get("/api/quotations/stats/summary", verifyToken, (req, res) => {
    try {
        const totalRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE is_deleted = 0")
            .get();
        const pendingRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'pending_approval' AND is_deleted = 0")
            .get();
        const approvedRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'approved' AND is_deleted = 0")
            .get();
        const clientReviewRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'client_review' AND is_deleted = 0")
            .get();
        // Calculate approved value in PHP
        const approvedQuotations = db
            .prepare("SELECT total_amount, base_currency, exchange_rate FROM quotations WHERE status = 'approved' AND is_deleted = 0")
            .all();
        let approvedValuePHP = 0;
        approvedQuotations.forEach(q => {
            const amount = Number(q.total_amount) || 0;
            const currency = q.base_currency || "PHP";
            if (currency === "PHP") {
                approvedValuePHP += amount;
            }
            else {
                // Get exchange rate from currencies table or use quotation's exchange rate
                const currencyData = db
                    .prepare("SELECT exchange_rate FROM currencies WHERE currency_code = ?")
                    .get(currency);
                const exchangeRate = currencyData?.exchange_rate || q.exchange_rate || 1;
                approvedValuePHP += amount * exchangeRate;
            }
        });
        res.json({
            total: totalRow.count,
            pendingApproval: pendingRow.count,
            approved: approvedRow.count,
            clientReview: clientReviewRow.count,
            approvedValue: approvedValuePHP,
        });
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch quotation stats");
    }
});
// -----------------------------
// QUOTATION ACTION ENDPOINTS
// -----------------------------
// Revive (unarchive) a quotation
app.put("/api/quotations/:id/revive", verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        db.prepare("UPDATE quotations SET is_deleted = 0, updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").run(id);
        res.json({ message: "Quotation restored successfully" });
    }
    catch (err) {
        return sendError(res, err, "Failed to revive quotation");
    }
});
// Approve a quotation
app.put("/api/quotations/:id/approve", verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { approvedBy } = req.body;
        if (!approvedBy) {
            return res.status(400).json({ message: "approvedBy is required" });
        }
        const q = db
            .prepare("SELECT * FROM quotations WHERE quotation_id = ?")
            .get(id);
        if (!q) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        db.transaction(() => {
            db.prepare("UPDATE quotations SET status = 'approved', approved_by = ?, updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").run(approvedBy, id);
            // Log to approval history if needed
            const user = db
                .prepare("SELECT user_id FROM users WHERE full_name = ? OR email = ?")
                .get(approvedBy, approvedBy);
            if (user) {
                db.prepare(`INSERT INTO approval_history (transaction_type, transaction_id, reference_no, action, action_by, action_by_name, action_date, comments)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`).run("quotation", id, q.quotation_number, "approved", user.user_id, approvedBy, null);
            }
        })();
        res.json({ message: "Quotation approved successfully" });
    }
    catch (err) {
        return sendError(res, err, "Failed to approve quotation");
    }
});
// Reject a quotation
app.put("/api/quotations/:id/reject", verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { rejectionReason } = req.body;
        const q = db
            .prepare("SELECT * FROM quotations WHERE quotation_id = ?")
            .get(id);
        if (!q) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        db.transaction(() => {
            db.prepare("UPDATE quotations SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").run(id);
            // Log to approval history if needed
            const userId = req.user?.id;
            const userName = req.user?.email || "Unknown";
            if (userId) {
                db.prepare(`INSERT INTO approval_history (transaction_type, transaction_id, reference_no, action, action_by, action_by_name, action_date, comments)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`).run("quotation", id, q.quotation_number, "rejected", userId, userName, rejectionReason || null);
            }
        })();
        res.json({ message: "Quotation rejected successfully" });
    }
    catch (err) {
        return sendError(res, err, "Failed to reject quotation");
    }
});
// Permanent delete a quotation
app.delete("/api/quotations/:id/permanent", verifyToken, requireRole(["admin"]), (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        db.transaction(() => {
            // Delete items first (foreign key constraint)
            db.prepare("DELETE FROM quotation_items WHERE quotation_id = ?").run(id);
            // Delete quotation
            db.prepare("DELETE FROM quotations WHERE quotation_id = ?").run(id);
            // Delete approval history
            db.prepare("DELETE FROM approval_history WHERE transaction_type = 'quotation' AND transaction_id = ?").run(id);
        })();
        res.json({ message: "Quotation permanently deleted" });
    }
    catch (err) {
        return sendError(res, err, "Failed to permanently delete quotation");
    }
});
// -----------------------------
// APPROVALS (uses approval_history + quotations)
// -----------------------------
/**
 * GET /api/approvals
 * Query params:
 *   - status (pending_approval | approved | rejected | all)
 */
app.get("/api/approvals", verifyToken, (req, res) => {
    try {
        const status = req.query.status;
        let sql = `
      SELECT q.quotation_id as id,
             'quotation' as type,
             q.quotation_number as referenceNo,
             COALESCE(c.client_name, 'N/A') as clientName,
             COALESCE(q.total_amount, 0) as amount,
             COALESCE(q.base_currency, 'PHP') as currency,
             COALESCE(q.exchange_rate, 1.0) as exchange_rate,
             COALESCE(q.prepared_by, 'N/A') as submittedBy,
             q.quotation_date as submittedDate,
             q.status as status,
             q.booking_id as bookingNo,
             st.service_type_name as serviceType,
             q.service_description as description
      FROM quotations q
      LEFT JOIN clients c ON q.client_id = c.client_id
      LEFT JOIN service_types st ON q.service_type_id = st.service_type_id
      WHERE q.is_deleted = 0
    `;
        const params = [];
        // Only add status filter if status is provided and not empty
        if (status && status !== "" && status !== "all") {
            sql += " AND q.status = ?";
            params.push(status);
        }
        sql += " ORDER BY q.created_at DESC";
        const rows = db.prepare(sql).all(...params);
        console.log(`📋 Fetched ${rows.length} approvals with status: ${status || 'ALL'}`);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch approvals");
    }
});
app.get("/api/approvals/stats", verifyToken, (req, res) => {
    try {
        const totalRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE is_deleted = 0")
            .get();
        const pendingRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'pending_approval' AND is_deleted = 0")
            .get();
        const approvedRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'approved' AND is_deleted = 0")
            .get();
        const rejectedRow = db
            .prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'rejected' AND is_deleted = 0")
            .get();
        const stats = {
            total: totalRow.count,
            pendingApprovals: pendingRow.count,
            approved: approvedRow.count,
            rejected: rejectedRow.count,
        };
        console.log('📊 Approval stats:', stats);
        res.json(stats);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch approval stats");
    }
});
// Details
app.get("/api/approvals/quotation/:id", verifyToken, (req, res) => {
    try {
        const id = req.params.id;
        const q = db
            .prepare("SELECT * FROM quotations WHERE quotation_id = ?")
            .get(id);
        if (!q)
            return res.status(404).json({ message: "Quotation not found" });
        const client = q.client_id
            ? db
                .prepare("SELECT * FROM clients WHERE client_id = ?")
                .get(q.client_id)
            : undefined;
        const serviceType = q.service_type_id
            ? db
                .prepare("SELECT * FROM service_types WHERE service_type_id = ?")
                .get(q.service_type_id)
            : undefined;
        const items = db
            .prepare("SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY item_sequence")
            .all(id);
        console.log(`📄 Fetching quotation details for ID: ${id}`);
        res.json({
            ...q,
            client_name: client?.client_name,
            client_contact_person: client?.contact_person,
            client_email: client?.email,
            client_phone: client?.phone,
            client_address: client?.address,
            service_type_name: serviceType?.service_type_name,
            items,
        });
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch quotation details for approval");
    }
});
// Replace the approve endpoint in server.ts:
app.post("/api/approvals/quotation/:id/approve", verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const comments = req.body.comments || null;
        const isOverride = req.body.isOverride || false;
        const q = db
            .prepare("SELECT * FROM quotations WHERE quotation_id = ?")
            .get(id);
        if (!q)
            return res.status(404).json({ message: "Quotation not found" });
        // Check if override is needed and if user is admin
        if (q.status !== 'pending_approval' && !isOverride) {
            return res.status(400).json({
                message: `Cannot approve ${q.status} quotation. Admin override required.`,
                requiresOverride: true
            });
        }
        if (isOverride && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Only administrators can override approved/rejected quotations"
            });
        }
        // Get current user full_name
        const user = db
            .prepare("SELECT full_name FROM users WHERE user_id = ?")
            .get(req.user.id);
        const actorName = user?.full_name || req.user.email;
        const action = isOverride ? 'override_approved' : 'approved';
        const previousStatus = q.status;
        console.log(`✅ ${isOverride ? 'OVERRIDE ' : ''}Approving quotation ${q.quotation_number} by ${actorName} (was: ${previousStatus})`);
        db.transaction(() => {
            // Update quotation status and approved_by
            db.prepare("UPDATE quotations SET status = ?, approved_by = ?, updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").run("approved", actorName, id);
            // Insert approval_history
            const historyComments = isOverride
                ? `[ADMIN OVERRIDE from ${previousStatus}] ${comments || 'No comments'}`
                : comments;
            db.prepare(`INSERT INTO approval_history (transaction_type, transaction_id, reference_no, action, action_by, action_by_name, action_date, comments)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`).run("quotation", id, q.quotation_number, action, req.user.id, actorName, historyComments);
        })();
        res.json({
            message: isOverride ? "Quotation approved (override)" : "Quotation approved",
            wasOverride: isOverride,
            previousStatus
        });
    }
    catch (err) {
        return sendError(res, err, "Failed to approve quotation");
    }
});
// Replace the reject endpoint in server.ts:
app.post("/api/approvals/quotation/:id/reject", verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const comments = req.body.comments || null;
        const isOverride = req.body.isOverride || false;
        if (!comments) {
            return res.status(400).json({ message: "Comments are required for rejection" });
        }
        const q = db
            .prepare("SELECT * FROM quotations WHERE quotation_id = ?")
            .get(id);
        if (!q)
            return res.status(404).json({ message: "Quotation not found" });
        // Check if override is needed and if user is admin
        if (q.status !== 'pending_approval' && !isOverride) {
            return res.status(400).json({
                message: `Cannot reject ${q.status} quotation. Admin override required.`,
                requiresOverride: true
            });
        }
        if (isOverride && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Only administrators can override approved/rejected quotations"
            });
        }
        const user = db
            .prepare("SELECT full_name FROM users WHERE user_id = ?")
            .get(req.user.id);
        const actorName = user?.full_name || req.user.email;
        const action = isOverride ? 'override_rejected' : 'rejected';
        const previousStatus = q.status;
        console.log(`❌ ${isOverride ? 'OVERRIDE ' : ''}Rejecting quotation ${q.quotation_number} by ${actorName} (was: ${previousStatus})`);
        db.transaction(() => {
            db.prepare("UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE quotation_id = ?").run("rejected", id);
            const historyComments = isOverride
                ? `[ADMIN OVERRIDE from ${previousStatus}] ${comments}`
                : comments;
            db.prepare(`INSERT INTO approval_history (transaction_type, transaction_id, reference_no, action, action_by, action_by_name, action_date, comments)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`).run("quotation", id, q.quotation_number, action, req.user.id, actorName, historyComments);
        })();
        res.json({
            message: isOverride ? "Quotation rejected (override)" : "Quotation rejected",
            wasOverride: isOverride,
            previousStatus
        });
    }
    catch (err) {
        return sendError(res, err, "Failed to reject quotation");
    }
});
// Approval history for a quotation
app.get("/api/approvals/quotation/:id/history", verifyToken, (req, res) => {
    try {
        const id = req.params.id;
        const rows = db
            .prepare("SELECT * FROM approval_history WHERE transaction_type = 'quotation' AND transaction_id = ? ORDER BY action_date DESC")
            .all(id);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch approval history");
    }
});
// -----------------------------
// BOOKING endpoints
// -----------------------------
app.get("/api/bookings", verifyToken, (req, res) => {
    try {
        const { status, client_id } = req.query;
        let sql = "SELECT * FROM bookings WHERE is_deleted = 0";
        const params = [];
        if (status) {
            sql += " AND status = ?";
            params.push(status);
        }
        if (client_id) {
            sql += " AND client_id = ?";
            params.push(client_id);
        }
        sql += " ORDER BY created_at DESC";
        const rows = db.prepare(sql).all(...params);
        res.json(rows);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch bookings");
    }
});
app.get("/api/bookings/:id", verifyToken, (req, res) => {
    try {
        const b = db
            .prepare("SELECT * FROM bookings WHERE booking_id = ?")
            .get(req.params.id);
        if (!b)
            return res.status(404).json({ message: "Booking not found" });
        res.json(b);
    }
    catch (err) {
        return sendError(res, err, "Failed to fetch booking");
    }
});
app.post("/api/bookings", verifyToken, (req, res) => {
    try {
        const missing = requireFields(req.body, [
            "booking_number",
            "client_id",
            "service_type_id",
            "booking_date",
        ]);
        if (missing)
            return res.status(400).json({ message: `${missing} is required` });
        const { sql, values } = buildInsert("bookings", {
            booking_number: req.body.booking_number,
            quotation_id: req.body.quotation_id || null,
            client_id: req.body.client_id,
            service_type_id: req.body.service_type_id,
            booking_date: req.body.booking_date,
            status: req.body.status || "pending",
            is_deleted: req.body.is_deleted !== undefined ? (req.body.is_deleted ? 1 : 0) : 0,
        });
        const result = db.prepare(sql).run(...values);
        res.json({
            message: "Booking created",
            booking_id: result.lastInsertRowid,
        });
    }
    catch (err) {
        return sendError(res, err, "Failed to create booking");
    }
});
app.put("/api/bookings/:id", verifyToken, (req, res) => {
    try {
        const allowed = [
            "booking_number",
            "quotation_id",
            "client_id",
            "service_type_id",
            "booking_date",
            "status",
            "is_deleted",
        ];
        const payload = {};
        for (const k of allowed)
            if (req.body[k] !== undefined)
                payload[k] = req.body[k];
        payload.updated_at = new Date().toISOString();
        const upd = buildUpdate("bookings", "booking_id", req.params.id, payload);
        if (!upd)
            return res.status(400).json({ message: "No fields to update" });
        db.prepare(upd.sql).run(...upd.values);
        res.json({ message: "Booking updated" });
    }
    catch (err) {
        return sendError(res, err, "Failed to update booking");
    }
});
app.delete("/api/bookings/:id", verifyToken, (req, res) => {
    try {
        db.prepare("UPDATE bookings SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE booking_id = ?").run(req.params.id);
        res.json({ message: "Booking deleted (soft)" });
    }
    catch (err) {
        return sendError(res, err, "Failed to delete booking");
    }
});
// -----------------------------
// APPROVAL MATRIX ROUTES
// -----------------------------
app.get("/api/approval_matrix", verifyToken, (req, res) => {
    try {
        const rules = db
            .prepare("SELECT * FROM approval_matrix ORDER BY id DESC")
            .all();
        // For each rule, include approver levels
        const levelStmt = db.prepare("SELECT * FROM approval_levels WHERE rule_id = ? ORDER BY level ASC");
        const fullRules = rules.map((rule) => ({
            ...rule,
            approvers: levelStmt.all(rule.id),
        }));
        res.json(fullRules);
    }
    catch (err) {
        sendError(res, err, "Failed to fetch approval matrix");
    }
});
// CREATE
app.post("/api/approval_matrix", verifyToken, requireRole(["admin", "manager"]), (req, res) => {
    try {
        const { transactionType, department, minAmount, maxAmount, active, approvers, } = req.body;
        const { sql, values } = buildInsert("approval_matrix", {
            transaction_type: transactionType,
            department,
            min_amount: minAmount,
            max_amount: maxAmount,
            active: active ? 1 : 0,
        });
        const result = db.prepare(sql).run(...values);
        const ruleId = result.lastInsertRowid;
        if (approvers && Array.isArray(approvers)) {
            const insertLevel = db.prepare(`
        INSERT INTO approval_levels (rule_id, level, role, user_id, required, can_delegate)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
            for (const a of approvers) {
                insertLevel.run(ruleId, a.level, a.role, a.userId || null, a.required ? 1 : 0, a.canDelegate ? 1 : 0);
            }
        }
        res.json({ message: "Approval rule created", id: ruleId });
    }
    catch (err) {
        sendError(res, err, "Failed to create approval rule");
    }
});
// UPDATE
app.put("/api/approval_matrix/:id", verifyToken, requireRole(["admin", "manager"]), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { transactionType, department, minAmount, maxAmount, active, approvers, } = req.body;
        const upd = buildUpdate("approval_matrix", "id", id, {
            transaction_type: transactionType,
            department,
            min_amount: minAmount,
            max_amount: maxAmount,
            active: active ? 1 : 0,
            updated_at: new Date().toISOString(),
        });
        if (!upd) {
            return res.status(400).json({ message: "No fields to update" });
        }
        db.prepare(upd.sql).run(...upd.values);
        // Replace all approvers
        db.prepare("DELETE FROM approval_levels WHERE rule_id = ?").run(id);
        if (approvers && Array.isArray(approvers)) {
            const insertLevel = db.prepare(`
        INSERT INTO approval_levels (rule_id, level, role, user_id, required, can_delegate)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
            for (const a of approvers) {
                insertLevel.run(id, a.level, a.role, a.userId || null, a.required ? 1 : 0, a.canDelegate ? 1 : 0);
            }
        }
        res.json({ message: "Approval rule updated" });
    }
    catch (err) {
        sendError(res, err, "Failed to update approval rule");
    }
});
// DELETE
app.delete("/api/approval_matrix/:id", verifyToken, requireRole(["admin", "manager"]), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        db.prepare("DELETE FROM approval_levels WHERE rule_id = ?").run(id);
        db.prepare("DELETE FROM approval_matrix WHERE id = ?").run(id);
        res.json({ message: "Approval rule deleted" });
    }
    catch (err) {
        sendError(res, err, "Failed to delete approval rule");
    }
});
// SINGLE RULE (optional detailed view)
app.get("/api/approval_matrix/:id", verifyToken, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const rule = db
            .prepare("SELECT * FROM approval_matrix WHERE id = ?")
            .get(id);
        if (!rule)
            return res.status(404).json({ message: "Rule not found" });
        const approvers = db
            .prepare("SELECT * FROM approval_levels WHERE rule_id = ? ORDER BY level ASC")
            .all(id);
        res.json({ ...rule, approvers });
    }
    catch (err) {
        sendError(res, err, "Failed to fetch rule");
    }
});
// -----------------------------
// Small misc endpoints
// -----------------------------
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.json({ message: "SBCLC API - ready" }));
// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
