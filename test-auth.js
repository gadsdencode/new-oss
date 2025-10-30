/**
 * Test script for LangGraph Agent Authentication
 * 
 * This script tests the authentication by attempting to make requests
 * to the LangGraph agent with and without valid API keys.
 * 
 * Usage: node test-auth.js
 */

const https = require('http');

const AGENT_URL = process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://localhost:8123';
const API_KEY = process.env.LANGGRAPH_API_KEY;

console.log('🔒 Testing LangGraph Agent Authentication');
console.log('=' .repeat(60));
console.log(`Agent URL: ${AGENT_URL}`);
console.log(`API Key configured: ${API_KEY ? '✅ Yes' : '❌ No'}`);
console.log('=' .repeat(60));
console.log('');

// Test 1: Request without API key (should fail with 401)
async function testWithoutApiKey() {
  console.log('Test 1: Request WITHOUT API key');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch(`${AGENT_URL}/threads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      console.log('✅ PASS: Request correctly rejected with 401 Unauthorized');
      const body = await response.text();
      console.log(`   Response: ${body}`);
    } else {
      console.log(`❌ FAIL: Expected 401, got ${response.status}`);
      console.log('   ⚠️  WARNING: Agent endpoint is NOT secured!');
    }
  } catch (error) {
    console.log(`⚠️  Error: ${error.message}`);
  }
  console.log('');
}

// Test 2: Request with invalid API key (should fail with 401)
async function testWithInvalidApiKey() {
  console.log('Test 2: Request with INVALID API key');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch(`${AGENT_URL}/threads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-langgraph-api-key': 'invalid-key-12345',
      },
    });
    
    if (response.status === 401) {
      console.log('✅ PASS: Invalid key correctly rejected with 401 Unauthorized');
      const body = await response.text();
      console.log(`   Response: ${body}`);
    } else {
      console.log(`❌ FAIL: Expected 401, got ${response.status}`);
      console.log('   ⚠️  WARNING: Invalid keys are being accepted!');
    }
  } catch (error) {
    console.log(`⚠️  Error: ${error.message}`);
  }
  console.log('');
}

// Test 3: Request with valid API key (should succeed with 200)
async function testWithValidApiKey() {
  console.log('Test 3: Request with VALID API key');
  console.log('-'.repeat(60));
  
  if (!API_KEY) {
    console.log('⚠️  SKIP: LANGGRAPH_API_KEY not set in environment');
    console.log('   Set the key in .env.local and restart to test');
    console.log('');
    return;
  }
  
  try {
    const response = await fetch(`${AGENT_URL}/threads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-langgraph-api-key': API_KEY,
      },
    });
    
    if (response.status === 200 || response.status === 404) {
      console.log('✅ PASS: Request accepted with valid API key');
      console.log(`   Status: ${response.status}`);
    } else if (response.status === 401) {
      console.log('❌ FAIL: Valid key was rejected');
      const body = await response.text();
      console.log(`   Response: ${body}`);
      console.log('   ⚠️  Check that the key matches on both client and server');
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(`⚠️  Error: ${error.message}`);
    console.log('   Make sure the LangGraph agent is running (npm run dev:agent)');
  }
  console.log('');
}

// Run all tests
async function runTests() {
  console.log('Starting authentication tests...\n');
  
  await testWithoutApiKey();
  await testWithInvalidApiKey();
  await testWithValidApiKey();
  
  console.log('=' .repeat(60));
  console.log('Testing complete!');
  console.log('=' .repeat(60));
  console.log('');
  console.log('📝 Next Steps:');
  console.log('  1. Ensure LANGGRAPH_API_KEY is set in .env.local');
  console.log('  2. Ensure LANGGRAPH_API_KEY is set in agent/.env');
  console.log('  3. Restart both services after setting the key');
  console.log('  4. All tests should pass (except Test 3 will skip if key not set)');
  console.log('');
}

// Check if we can actually run the tests
if (typeof fetch === 'undefined') {
  console.log('❌ Error: fetch is not available');
  console.log('   This script requires Node.js v18+ or you can use node-fetch');
  console.log('   Run: pnpm add -D node-fetch');
  process.exit(1);
}

runTests().catch(console.error);

