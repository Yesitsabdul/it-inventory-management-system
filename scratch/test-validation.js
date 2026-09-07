async function testCost() {
  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Login failed: " + JSON.stringify(data));
    const token = data.access_token;
    
    // Try to create model without manufacturer
    try {
      console.log('Testing create model without manufacturer...');
      const r = await fetch('http://localhost:3000/models', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: 'Model No Mfg', unique_id: 'no-mfg-123', category_id: 9 })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(d.message));
      console.log('Model created successfully (THIS IS A BUG!)', d);
    } catch (e) {
      console.log('Model creation failed as expected:', e.message);
    }

    // Try to create asset with negative cost
    try {
      console.log('\nTesting create asset with negative cost...');
      const r = await fetch('http://localhost:3000/assets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ asset_tag: 'TAG-NEG-COST', model_id: 12, purchase_cost: -500 })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(d.message));
      console.log('Asset created successfully (THIS IS A BUG!)', d);
    } catch (e) {
      console.log('Asset creation failed as expected:', e.message);
    }
  } catch(e) {
    console.error('Test failed:', e.message);
  }
}
testCost();
