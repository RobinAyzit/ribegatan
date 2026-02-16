/**
 * Manual test för auth-middleware
 * Kör detta med: node admin/api/middleware/auth-middleware.test.js
 */

const { authenticateToken, requireAdmin } = require('./auth-middleware');
const { generateToken } = require('../services/auth-service');

// Mock request och response objekt
function createMockReq(token = null) {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {}
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    jsonData: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

// Test 1: Ingen token - ska returnera 401
console.log('Test 1: Ingen token tillhandahållen');
const req1 = createMockReq();
const res1 = createMockRes();
let nextCalled1 = false;
authenticateToken(req1, res1, () => { nextCalled1 = true; });

if (res1.statusCode === 401 && !nextCalled1) {
  console.log('✓ PASS: Returnerar 401 när ingen token finns');
} else {
  console.log('✗ FAIL: Förväntade 401, fick', res1.statusCode);
}

// Test 2: Ogiltig token - ska returnera 401
console.log('\nTest 2: Ogiltig token');
const req2 = createMockReq('invalid-token-123');
const res2 = createMockRes();
let nextCalled2 = false;
authenticateToken(req2, res2, () => { nextCalled2 = true; });

if (res2.statusCode === 401 && !nextCalled2) {
  console.log('✓ PASS: Returnerar 401 för ogiltig token');
} else {
  console.log('✗ FAIL: Förväntade 401, fick', res2.statusCode);
}

// Test 3: Giltig token - ska anropa next() och sätta req.user
console.log('\nTest 3: Giltig token');
const validUser = { id: 'admin-001', username: 'ADMIN', role: 'admin' };
const validToken = generateToken(validUser);
const req3 = createMockReq(validToken);
const res3 = createMockRes();
let nextCalled3 = false;
authenticateToken(req3, res3, () => { nextCalled3 = true; });

if (nextCalled3 && req3.user && req3.user.username === 'ADMIN') {
  console.log('✓ PASS: Anropar next() och sätter req.user för giltig token');
  console.log('  User data:', req3.user);
} else {
  console.log('✗ FAIL: next() anropades inte eller req.user sattes inte korrekt');
}

// Test 4: requireAdmin med admin-användare
console.log('\nTest 4: requireAdmin med admin-användare');
const req4 = { user: { id: 'admin-001', username: 'ADMIN', role: 'admin' } };
const res4 = createMockRes();
let nextCalled4 = false;
requireAdmin(req4, res4, () => { nextCalled4 = true; });

if (nextCalled4 && res4.statusCode === 200) {
  console.log('✓ PASS: Admin-användare får åtkomst');
} else {
  console.log('✗ FAIL: Admin-användare nekades åtkomst');
}

// Test 5: requireAdmin utan användare
console.log('\nTest 5: requireAdmin utan autentiserad användare');
const req5 = {};
const res5 = createMockRes();
let nextCalled5 = false;
requireAdmin(req5, res5, () => { nextCalled5 = true; });

if (res5.statusCode === 401 && !nextCalled5) {
  console.log('✓ PASS: Returnerar 401 när ingen användare är autentiserad');
} else {
  console.log('✗ FAIL: Förväntade 401, fick', res5.statusCode);
}

console.log('\n=== Alla tester slutförda ===');
