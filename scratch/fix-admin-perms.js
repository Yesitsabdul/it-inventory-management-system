const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'it_asset_mgmt',
});

async function run() {
  await AppDataSource.initialize();
  console.log('Updating Admin role...');
  const res = await AppDataSource.query(`UPDATE roles SET permissions = '{"admin.super":true}' WHERE name = 'Admin'`);
  console.log(res);
  process.exit(0);
}

run().catch(console.error);
