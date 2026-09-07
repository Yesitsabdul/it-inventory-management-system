import { AppDataSource } from '../src/database/data-source';

async function run() {
  await AppDataSource.initialize();
  console.log('Updating Admin role...');
  const res = await AppDataSource.query(`UPDATE roles SET permissions = '{"admin.super":true}' WHERE name = 'Admin'`);
  console.log(res);
  process.exit(0);
}

run().catch(console.error);
