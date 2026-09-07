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
    console.log("Login Status:", loginRes.status);
    const token = loginRes.data.access_token;
    if (!token) throw new Error("No token returned");
    
    console.log("\n=== Testing Models ===");
    const modelsRes = await request('GET', '/models?page=1&limit=10', null, token);
    console.log("Models Status:", modelsRes.status);
    if (modelsRes.data && modelsRes.data.data && modelsRes.data.data.length > 0) {
      console.log("First Model:", JSON.stringify(modelsRes.data.data[0], null, 2));
    } else {
      console.log("No models found.");
    }
    
    console.log("\n=== Testing Users ===");
    const usersRes = await request('GET', '/users?page=1&limit=10', null, token);
    console.log("Users Status:", usersRes.status);
    if (usersRes.data && usersRes.data.data && usersRes.data.data.length > 0) {
      console.log("First User:", JSON.stringify(usersRes.data.data[0], null, 2));
    } else {
      console.log("No users found.");
    }
    
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

test();
