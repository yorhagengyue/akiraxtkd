/**
 * Debug utilities for environment detection and API configuration
 */

import { getApiConfig, buildApiUrl, ENV_UTILS } from './config';

export function debugEnvironment() {
  if (typeof window === 'undefined') return;
  
  console.group('🔧 Environment Debug Info');
  
  // Basic environment
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Window location:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  
  // Environment utils
  console.log('ENV_UTILS:', ENV_UTILS);
  
  // API configuration
  const apiConfig = getApiConfig();
  console.log('Current API Config:', apiConfig);
  
  // Test API URLs
  console.log('Sample API URLs:');
  console.log('- Login:', buildApiUrl('auth/login'));
  console.log('- Dashboard:', buildApiUrl('dashboard/student/overview'));
  console.log('- Env Info:', buildApiUrl('env-info'));
  
  console.groupEnd();
}

export function testApiConnection() {
  if (typeof window === 'undefined') return;
  
  const testUrl = buildApiUrl('env-info');
  console.log('🧪 Testing API connection to:', testUrl);
  
  fetch(testUrl)
    .then(response => {
      console.log('✅ API Response Status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('✅ API Response Data:', data);
    })
    .catch(error => {
      console.error('❌ API Connection Failed:', error);
      console.error('This might indicate:');
      console.error('1. API server is not running');
      console.error('2. Incorrect API URL configuration');
      console.error('3. CORS issues');
      console.error('4. Network connectivity problems');
    });
}

// Auto-run debug in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run after a short delay to ensure page is loaded
  setTimeout(() => {
    debugEnvironment();
    testApiConnection();
  }, 1000);
}
