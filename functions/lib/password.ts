/**
 * Password Hashing and Verification Utilities
 * Using Web Crypto API for secure password hashing
 */

/**
 * Generate a random salt
 */
async function generateSalt(): Promise<string> {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password using PBKDF2
 */
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', key);
  const hashArray = new Uint8Array(exported);
  return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create password hash with salt
 */
export async function createPasswordHash(password: string): Promise<string> {
  const salt = await generateSalt();
  const hash = await hashPassword(password, salt);
  return `${salt}:${hash}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) {
      return false;
    }
    
    const newHash = await hashPassword(password, salt);
    return newHash === hash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Check if password meets security requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Optional: special characters
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   errors.push('Password must contain at least one special character');
  // }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  createPasswordHash,
  verifyPassword,
  validatePasswordStrength
};
