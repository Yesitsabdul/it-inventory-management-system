import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function run() {
  const ds = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'fast',
    database: 'it_asset_mgmt'
  });
  await ds.initialize();
  const hash = await bcrypt.hash('password', 10);
  await ds.query('UPDATE users SET password = ? WHERE id = 1', [hash]);
  console.log('Password successfully reset to "password"!');
  process.exit(0);
}
run().catch(console.error);
