const mysql = require('mysql2/promise');

async function run() {
  const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fast',
    database: 'it_asset_mgmt'
  });
  await c.execute("UPDATE roles SET description = 'Full access - manages all assets, users, and settings' WHERE name = 'admin'");
  await c.execute("UPDATE roles SET description = 'Record-only - appears as assignee on asset checkouts' WHERE name = 'employee'");
  c.end();
}
run();
