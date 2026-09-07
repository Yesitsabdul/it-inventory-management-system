const { DataSource } = require('typeorm');
const path = require('path');
const { Category } = require('./dist/database/entities/category.entity');
const { Model } = require('./dist/database/entities/model.entity');
const { Manufacturer } = require('./dist/database/entities/manufacturer.entity');
const { AppBaseEntity } = require('./dist/common/base/base.entity');

const ds = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'fast',
  database: 'it_asset_mgmt',
  entities: [path.join(__dirname, 'dist/database/entities/*.entity.js')]
});

async function test() {
  await ds.initialize();
  const repo = ds.getRepository(Category);
  
  const [data, count] = await repo.createQueryBuilder('category')
      .loadRelationCountAndMap('category.referenceCount', 'category.models')
      .take(1)
      .getManyAndCount();
      
  console.log("Raw TypeORM output:", data[0]);
  console.log("referenceCount:", data[0].referenceCount);
  await ds.destroy();
}

test();
