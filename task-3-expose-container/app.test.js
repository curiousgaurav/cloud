const http = require('http');
const app = require('../app');
const assert = require('assert');

let server;
const TEST_PORT = 9876;

function request(method, path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: 'localhost', port: TEST_PORT, path, method },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return fn()
      .then(() => { passed++; console.log(`  ✓ ${name}`); })
      .catch((err) => { failed++; console.error(`  ✗ ${name}\n    ${err.message}`); });
  }

  console.log('\n  App Tests\n');

  await test('GET / returns 200 with welcome message', async () => {
    const res = await request('GET', '/');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message.includes('Welcome'));
    assert.strictEqual(res.body.status, 'running');
  });

  await test('GET /health returns 200 with healthy status', async () => {
    const res = await request('GET', '/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'healthy');
    assert.ok(res.body.uptime >= 0);
  });

  await test('GET /status returns 200 with online status', async () => {
    const res = await request('GET', '/status');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'online');
    assert.ok(res.body.memory);
  });

  await test('GET /api/info returns endpoint list', async () => {
    const res = await request('GET', '/api/info');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.available_endpoints));
    assert.ok(res.body.available_endpoints.length > 0);
  });

  await test('GET /api/server-details returns server info', async () => {
    const res = await request('GET', '/api/server-details');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.listening_port);
  });

  await test('GET /metrics returns metrics', async () => {
    const res = await request('GET', '/metrics');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.uptime_ms >= 0);
  });

  await test('GET /nonexistent returns 404', async () => {
    const res = await request('GET', '/nonexistent');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'Endpoint not found');
  });

  console.log(`\n  ${passed} passing, ${failed} failing\n`);

  if (failed > 0) process.exit(1);
}

// Start server, run tests, then close
server = app.listen(TEST_PORT, '0.0.0.0', () => {
  runTests()
    .then(() => server.close())
    .catch((err) => {
      console.error(err);
      server.close();
      process.exit(1);
    });
});
