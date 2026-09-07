const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fast',
    database: 'it_asset_mgmt'
  });

  try {
    // 1. Ensure 'Admin' role exists
    const [roles] = await connection.execute('SELECT id FROM roles WHERE name = "Admin"');
    let roleId;
    if (roles.length === 0) {
      const [result] = await connection.execute('INSERT INTO roles (name) VALUES ("Admin")');
      roleId = result.insertId;
      console.log('Created Admin role with ID', roleId);
    } else {
      roleId = roles[0].id;
      console.log('Admin role exists with ID', roleId);
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // 3. Create user
    const [users] = await connection.execute('SELECT id FROM users WHERE email = "admin@example.com"');
    if (users.length === 0) {
      await connection.execute(`
        INSERT INTO users (first_name, last_name, email, password, employee_number, is_active, role_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['Super', 'Admin', 'admin@example.com', hashedPassword, 'EMP-001', 1, roleId]);
      console.log('Created admin user: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

seed();
