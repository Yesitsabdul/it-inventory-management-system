const fs = require('fs');

async function testApi() {
  console.log('--- STARTING RIGOROUS API INTEGRATION TESTS ---');
  let token = '';
  let ids = {};
  
  const BASE = 'http://localhost:3000';
  
  async function request(method, path, body = null, expectStatus = 200) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${BASE}${path}`, {
      method, headers, body: body ? JSON.stringify(body) : null
    });
    
    const data = await res.json().catch(() => null);
    
    if (res.status !== expectStatus) {
      console.error(`❌ [${method} ${path}] Expected status ${expectStatus}, got ${res.status}`);
      console.error(data);
      process.exit(1);
    }
    
    console.log(`✅ [${method} ${path}] -> ${res.status}`);
    return data;
  }

  // 1. Authentication (Login with superadmin)
  console.log('\n--- 1. Authentication ---');
  const authRes = await request('POST', '/auth/login', { email: 'superadmin@example.com', password: 'Admin@1234' }, 200);
  token = authRes.access_token;
  ids.user = authRes.user.id;
  
  // 2. Setup Prerequisites (Categories, Manufacturers, Status Labels, Locations, Models)
  console.log('\n--- 2. Create Prerequisites ---');
  const cat = await request('POST', '/categories', { name: 'Test Laptops', type: 'asset' }, 201);
  ids.cat = cat.id;
  
  const mfr = await request('POST', '/manufacturers', { name: 'Test Dell' }, 201);
  ids.mfr = mfr.id;
  
  const loc = await request('POST', '/locations', { name: 'Test HQ' }, 201);
  ids.loc = loc.id;
  
  const status = await request('POST', '/status-labels', { name: 'Test Deployable', type: 'deployable' }, 201);
  ids.status = status.id;

  const statusPending = await request('POST', '/status-labels', { name: 'Test Deployed', type: 'pending' }, 201);
  ids.statusPending = statusPending.id;
  
  const model = await request('POST', '/models', { 
    name: 'Test XPS 15', 
    unique_id: 'TEST-XPS-' + Date.now(), 
    category_id: ids.cat, 
    manufacturer_id: ids.mfr 
  }, 201);
  ids.model = model.id;

  // 3. Create Asset
  console.log('\n--- 3. Create Asset ---');
  const assetTag = 'TEST-ASSET-' + Date.now();
  const asset = await request('POST', '/assets', {
    asset_tag: assetTag,
    name: 'Test Laptop 1',
    model_id: ids.model,
    status_label_id: ids.status,
    location_id: ids.loc
  }, 201);
  ids.asset = asset.id;

  // 4. Asset Assignment Business Logic (Checkout / Checkin)
  console.log('\n--- 4. Business Logic: Asset Assignment ---');
  // 4a. Checkout
  const checkout = await request('POST', '/asset-assignments/checkout', {
    asset_id: ids.asset,
    assigned_to_id: ids.user,
    assigned_by_id: ids.user,
    status_label_id: ids.statusPending
  }, 201);
  ids.assignment = checkout.id;

  // 4b. Verify Asset Status Changed
  const updatedAsset = await request('GET', `/assets/${ids.asset}`, null, 200);
  if (updatedAsset.status_label?.id !== ids.statusPending) {
    console.error('❌ Asset status did not update upon checkout!');
    process.exit(1);
  }

  // 4c. Double Checkout Prevention
  console.log('Testing double checkout prevention...');
  await request('POST', '/asset-assignments/checkout', {
    asset_id: ids.asset,
    assigned_to_id: ids.user,
    assigned_by_id: ids.user
  }, 409); // Should Conflict

  // 4d. Checkin
  console.log('Testing asset checkin...');
  await request('POST', '/asset-assignments/checkin', {
    asset_id: ids.asset,
    status_label_id: ids.status // Return to deployable
  }, 201);

  // 4e. Verify Checkin Status
  const checkedInAsset = await request('GET', `/assets/${ids.asset}`, null, 200);
  if (checkedInAsset.status_label?.id !== ids.status) {
    console.error('❌ Asset status did not update upon checkin!');
    process.exit(1);
  }

  // 4f. Double Checkin Prevention
  console.log('Testing double checkin prevention...');
  await request('POST', '/asset-assignments/checkin', {
    asset_id: ids.asset
  }, 400); // Should Bad Request

  // 5. Validation Testing
  console.log('\n--- 5. Validation Testing ---');
  await request('POST', '/users', { email: 'not-an-email', first_name: 'A' }, 400);
  await request('POST', '/assets', { name: 'Missing Tag' }, 400);

  // 6. Cleanup (Soft Delete)
  console.log('\n--- 6. Soft Delete Testing ---');
  await request('DELETE', `/assets/${ids.asset}`, null, 204);
  await request('GET', `/assets/${ids.asset}`, null, 404); // Should be soft deleted

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
}

testApi().catch(console.error);
