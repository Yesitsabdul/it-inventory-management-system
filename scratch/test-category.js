const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  try {
    console.log("=== Logging in ===");
    const loginRes = await request('POST', '/auth/login', { email: 'admin@example.com', password: 'admin123' });
    const token = loginRes.data.access_token;
    
    // Create a category to test
    await request('POST', '/categories', { name: 'TestCat', type: 'asset' }, token);
    const catRes = await request('GET', '/categories?page=1&limit=10', null, token);
    console.log("First Category:", JSON.stringify(catRes.data.data[0], null, 2));

  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

test();
