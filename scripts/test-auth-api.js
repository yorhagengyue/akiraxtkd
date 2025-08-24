/**
 * Authentication API Test Script
 * Tests the authentication endpoints
 */

const API_BASE = 'http://localhost:8787/api'; // Wrangler dev server

/**
 * Test development user login
 */
async function testDevLogin() {
  console.log('\n🧪 Testing Development User Login...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dev_user_email: 'admin@dev.local'
      }),
    });

    const data = await response.json();
    console.log('✅ Dev Login Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.session_token) {
      return data.session_token;
    } else {
      console.error('❌ Dev login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Dev login error:', error.message);
    return null;
  }
}

/**
 * Test getting current user info
 */
async function testMe(token) {
  console.log('\n🧪 Testing Get Current User...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('✅ Me Response:', JSON.stringify(data, null, 2));
    
    return data.success;
  } catch (error) {
    console.error('❌ Me endpoint error:', error.message);
    return false;
  }
}

/**
 * Test getting development users
 */
async function testDevUsers() {
  console.log('\n🧪 Testing Get Development Users...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/dev-users`, {
      method: 'GET',
    });

    const data = await response.json();
    console.log('✅ Dev Users Response:', JSON.stringify(data, null, 2));
    
    return data.success;
  } catch (error) {
    console.error('❌ Dev users error:', error.message);
    return false;
  }
}

/**
 * Test environment info endpoint
 */
async function testEnvInfo() {
  console.log('\n🧪 Testing Environment Info...');
  
  try {
    const response = await fetch(`${API_BASE}/env-info`, {
      method: 'GET',
    });

    const data = await response.json();
    console.log('✅ Environment Info Response:', JSON.stringify(data, null, 2));
    
    return data.success;
  } catch (error) {
    console.error('❌ Environment info error:', error.message);
    return false;
  }
}

/**
 * Test invalid login
 */
async function testInvalidLogin() {
  console.log('\n🧪 Testing Invalid Login...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dev_user_email: 'nonexistent@dev.local'
      }),
    });

    const data = await response.json();
    console.log('✅ Invalid Login Response:', JSON.stringify(data, null, 2));
    
    return !data.success; // Should fail
  } catch (error) {
    console.error('❌ Invalid login test error:', error.message);
    return false;
  }
}

/**
 * Test unauthorized access
 */
async function testUnauthorized() {
  console.log('\n🧪 Testing Unauthorized Access...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid_token',
      },
    });

    const data = await response.json();
    console.log('✅ Unauthorized Response:', JSON.stringify(data, null, 2));
    
    return !data.success; // Should fail
  } catch (error) {
    console.error('❌ Unauthorized test error:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Authentication API Tests...');
  console.log('📡 API Base URL:', API_BASE);
  
  const results = [];
  
  // Test 1: Environment Info
  results.push({
    name: 'Environment Info',
    passed: await testEnvInfo()
  });
  
  // Test 2: Get Development Users
  results.push({
    name: 'Get Development Users',
    passed: await testDevUsers()
  });
  
  // Test 3: Development User Login
  const token = await testDevLogin();
  results.push({
    name: 'Development User Login',
    passed: !!token
  });
  
  // Test 4: Get Current User (with valid token)
  if (token) {
    results.push({
      name: 'Get Current User (Valid Token)',
      passed: await testMe(token)
    });
  }
  
  // Test 5: Invalid Login
  results.push({
    name: 'Invalid Login (Should Fail)',
    passed: await testInvalidLogin()
  });
  
  // Test 6: Unauthorized Access
  results.push({
    name: 'Unauthorized Access (Should Fail)',
    passed: await testUnauthorized()
  });
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  let passed = 0;
  let total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (result.passed) passed++;
  });
  
  console.log('========================');
  console.log(`📈 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the API endpoints.');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testDevLogin,
  testMe,
  testDevUsers,
  testEnvInfo,
  testInvalidLogin,
  testUnauthorized,
};
