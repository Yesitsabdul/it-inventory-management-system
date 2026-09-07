const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function run() {
  const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fast',
    database: 'it_asset_mgmt'
  });
  
  const hash = await bcrypt.hash('admin123', 10);
  
  await c.execute("INSERT IGNORE INTO roles (name, description) VALUES ('admin', 'Administrator')");
  
  const [rows] = await c.execute("SELECT id FROM roles WHERE name = 'admin'");
  const roleId = rows[0].id;
  
  await c.execute(
    "INSERT INTO users (first_name, last_name, email, password, employee_number, is_active, role_id) VALUES ('Admin', 'User', 'admin@example.com', ?, 'ADM001', 1, ?)",
    [hash, roleId]
  );
  
  c.end();
  console.log('User created.');
}

run();
