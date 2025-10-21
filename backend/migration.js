// migration.js
const Database = require('better-sqlite3');
const db = new Database('sbclc.db');
const fs = require('fs');

// 1️⃣ Load and execute schema
const schema = fs.readFileSync('newdb.sql', 'utf8');
db.exec(schema);
console.log('✅ Database updated successfully');

// 2️⃣ Query for the admin user (if seeded)
try {
  const admin = db.prepare('SELECT email, full_name FROM users WHERE role = ? LIMIT 1').get('admin');

  if (admin) {
    console.log('\n🔐 Default admin credentials:');
    console.log(`   Email:    ${admin.email}`);
    console.log('   Password: admin123');
  } else {
    console.log('\n⚠️  No admin user found in the database.');
  }
} catch (err) {
  console.error('\n❌ Could not read users table:', err.message);
}
