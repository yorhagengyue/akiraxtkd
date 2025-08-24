var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-0fpfi7/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-0fpfi7/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../AppData/Roaming/npm/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// functions/lib/jwt.ts
function getJWTSecret(env) {
  return env.JWT_SECRET || "dev-secret-key-change-in-production";
}
function generateJTI() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function createJWTComponents(payload, expirySeconds) {
  const now = Math.floor(Date.now() / 1e3);
  const header = {
    alg: JWT_CONFIG.ALGORITHM,
    typ: "JWT"
  };
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expirySeconds,
    jti: generateJTI(),
    iss: JWT_CONFIG.ISSUER
  };
  return { header, payload: fullPayload };
}
function base64UrlEncode(str) {
  const base64 = btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return atob(str);
}
async function createSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const signatureArray = new Uint8Array(signature);
  const signatureString = String.fromCharCode.apply(null, Array.from(signatureArray));
  return base64UrlEncode(signatureString);
}
async function verifySignature(data, signature, secret) {
  try {
    const expectedSignature = await createSignature(data, secret);
    return expectedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
async function generateJWT(user, env, expirySeconds = JWT_CONFIG.ACCESS_TOKEN_EXPIRY) {
  try {
    const secret = getJWTSecret(env);
    const { header, payload } = createJWTComponents(user, expirySeconds);
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    const data = `${headerEncoded}.${payloadEncoded}`;
    const signature = await createSignature(data, secret);
    return `${data}.${signature}`;
  } catch (error) {
    console.error("JWT generation error:", error);
    throw new Error("Failed to generate JWT token");
  }
}
async function verifyJWT(token, env) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const [headerEncoded, payloadEncoded, signature] = parts;
    const data = `${headerEncoded}.${payloadEncoded}`;
    const secret = getJWTSecret(env);
    const isValid = await verifySignature(data, signature, secret);
    if (!isValid) {
      return null;
    }
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1e3);
    if (payload.exp < now) {
      return null;
    }
    if (payload.iss !== JWT_CONFIG.ISSUER) {
      return null;
    }
    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}
async function generateTokenPair(user, env) {
  try {
    const accessToken = await generateJWT(user, env, JWT_CONFIG.ACCESS_TOKEN_EXPIRY);
    const refreshToken = await generateJWT(user, env, JWT_CONFIG.REFRESH_TOKEN_EXPIRY);
    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY
    };
  } catch (error) {
    console.error("Token pair generation error:", error);
    throw new Error("Failed to generate token pair");
  }
}
async function refreshAccessToken(refreshToken, env) {
  try {
    const payload = await verifyJWT(refreshToken, env);
    if (!payload) {
      return null;
    }
    const user = {
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
      display_name: payload.display_name
    };
    return await generateJWT(user, env, JWT_CONFIG.ACCESS_TOKEN_EXPIRY);
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}
async function getUserFromToken(token, env) {
  const payload = await verifyJWT(token, env);
  if (!payload) {
    return null;
  }
  return {
    user_id: payload.user_id,
    email: payload.email,
    role: payload.role,
    display_name: payload.display_name
  };
}
function blacklistToken(jti) {
  tokenBlacklist.add(jti);
}
function isTokenBlacklisted(jti) {
  return tokenBlacklist.has(jti);
}
function decodeJWTUnsafe(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}
async function requireAuth(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authentication required");
  }
  const token = authHeader.substring(7);
  const user = await getUserFromToken(token, env);
  if (!user) {
    throw new Error("Invalid or expired token");
  }
  const payload = decodeJWTUnsafe(token);
  if (payload && isTokenBlacklisted(payload.jti)) {
    throw new Error("Token has been revoked");
  }
  return user;
}
var JWT_CONFIG, tokenBlacklist;
var init_jwt = __esm({
  "functions/lib/jwt.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    JWT_CONFIG = {
      ACCESS_TOKEN_EXPIRY: 15 * 60,
      // 15 minutes
      REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60,
      // 7 days
      ISSUER: "akiraxtkd.com",
      ALGORITHM: "HS256"
    };
    __name(getJWTSecret, "getJWTSecret");
    __name(generateJTI, "generateJTI");
    __name(createJWTComponents, "createJWTComponents");
    __name(base64UrlEncode, "base64UrlEncode");
    __name(base64UrlDecode, "base64UrlDecode");
    __name(createSignature, "createSignature");
    __name(verifySignature, "verifySignature");
    __name(generateJWT, "generateJWT");
    __name(verifyJWT, "verifyJWT");
    __name(generateTokenPair, "generateTokenPair");
    __name(refreshAccessToken, "refreshAccessToken");
    __name(getUserFromToken, "getUserFromToken");
    tokenBlacklist = /* @__PURE__ */ new Set();
    __name(blacklistToken, "blacklistToken");
    __name(isTokenBlacklisted, "isTokenBlacklisted");
    __name(decodeJWTUnsafe, "decodeJWTUnsafe");
    __name(requireAuth, "requireAuth");
  }
});

// functions/lib/password.ts
async function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 1e5,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  const hashArray = new Uint8Array(exported);
  return Array.from(hashArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function createPasswordHash(password) {
  const salt = await generateSalt();
  const hash = await hashPassword(password, salt);
  return `${salt}:${hash}`;
}
async function verifyPassword(password, storedHash) {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) {
      return false;
    }
    const newHash = await hashPassword(password, salt);
    return newHash === hash;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}
var init_password = __esm({
  "functions/lib/password.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    __name(generateSalt, "generateSalt");
    __name(hashPassword, "hashPassword");
    __name(createPasswordHash, "createPasswordHash");
    __name(verifyPassword, "verifyPassword");
  }
});

// functions/api/auth.ts
var auth_exports = {};
__export(auth_exports, {
  onRequest: () => onRequest
});
function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
async function verifyFirebaseToken(token) {
  return {
    uid: "firebase_" + Date.now(),
    email: "user@example.com",
    name: "Test User",
    picture: "https://example.com/avatar.jpg",
    email_verified: true
  };
}
async function getOrCreateUser(db, firebaseUser, provider = "google") {
  const existingUser = await db.prepare("SELECT * FROM user_accounts WHERE firebase_uid = ? OR email = ?").bind(firebaseUser.uid, firebaseUser.email).first();
  if (existingUser) {
    await db.prepare(`
        UPDATE user_accounts 
        SET last_login_at = CURRENT_TIMESTAMP, 
            login_count = login_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(existingUser.user_id).run();
    return existingUser;
  }
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.prepare(`
      INSERT INTO user_accounts (
        user_id, email, firebase_uid, role, status, display_name, 
        photo_url, email_verified, provider, login_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
    userId,
    firebaseUser.email,
    firebaseUser.uid,
    "student",
    // Default role
    "active",
    firebaseUser.name || firebaseUser.email,
    firebaseUser.picture || null,
    firebaseUser.email_verified || false,
    provider,
    1
  ).run();
  const newUser = await db.prepare("SELECT * FROM user_accounts WHERE user_id = ?").bind(userId).first();
  if (!newUser) {
    throw new Error("Failed to create user account");
  }
  return newUser;
}
async function getDevUser(db, email) {
  const user = await db.prepare("SELECT * FROM user_accounts WHERE email = ? AND provider = ?").bind(email, "dev").first();
  if (user) {
    await db.prepare(`
        UPDATE user_accounts 
        SET last_login_at = CURRENT_TIMESTAMP, 
            login_count = login_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(user.user_id).run();
  }
  return user;
}
async function handleLogin(request, env) {
  try {
    const body = await request.json();
    const isDev = env.DEV_MODE === "true";
    const authEnabled = env.AUTH_ENABLED === "true";
    const devUsersEnabled = env.DEV_USERS_ENABLED === "true";
    if (body.email && body.password) {
      const user = await env.DB.prepare("SELECT * FROM user_accounts WHERE email = ?").bind(body.email).first();
      if (!user) {
        return jsonResponse({
          success: false,
          error: "Invalid email or password",
          dev_mode: isDev
        }, 401);
      }
      let passwordValid = false;
      if (user.demo_password && user.demo_password === body.password) {
        passwordValid = true;
        if (!user.password_hash) {
          const hashedPassword = await createPasswordHash(body.password);
          await env.DB.prepare("UPDATE user_accounts SET password_hash = ? WHERE user_id = ?").bind(hashedPassword, user.user_id).run();
        }
      } else if (user.password_hash) {
        passwordValid = await verifyPassword(body.password, user.password_hash);
      }
      if (!passwordValid) {
        return jsonResponse({
          success: false,
          error: "Invalid email or password",
          dev_mode: isDev
        }, 401);
      }
      await env.DB.prepare(`
          UPDATE user_accounts 
          SET last_login_at = CURRENT_TIMESTAMP, 
              login_count = login_count + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `).bind(user.user_id).run();
      const tokenPair = await generateTokenPair({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        display_name: user.display_name || user.email
      }, env);
      return jsonResponse({
        success: true,
        user,
        access_token: tokenPair.accessToken,
        refresh_token: tokenPair.refreshToken,
        expires_in: tokenPair.expiresIn,
        token_type: "Bearer",
        dev_mode: isDev
      });
    }
    if (isDev && !authEnabled && devUsersEnabled && body.dev_user_email) {
      const devUser = await getDevUser(env.DB, body.dev_user_email);
      if (!devUser) {
        return jsonResponse({
          success: false,
          error: "Development user not found",
          dev_mode: true
        }, 404);
      }
      const tokenPair = await generateTokenPair({
        user_id: devUser.user_id,
        email: devUser.email,
        role: devUser.role,
        display_name: devUser.display_name || devUser.email
      }, env);
      return jsonResponse({
        success: true,
        user: devUser,
        access_token: tokenPair.accessToken,
        refresh_token: tokenPair.refreshToken,
        expires_in: tokenPair.expiresIn,
        token_type: "Bearer",
        dev_mode: true
      });
    }
    if (authEnabled && body.firebase_token) {
      try {
        const firebaseUser = await verifyFirebaseToken(body.firebase_token);
        const user = await getOrCreateUser(env.DB, firebaseUser);
        const tokenPair = await generateTokenPair({
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          display_name: user.display_name || user.email
        }, env);
        return jsonResponse({
          success: true,
          user,
          access_token: tokenPair.accessToken,
          refresh_token: tokenPair.refreshToken,
          expires_in: tokenPair.expiresIn,
          token_type: "Bearer",
          dev_mode: false
        });
      } catch (error) {
        return jsonResponse({
          success: false,
          error: "Invalid Firebase token",
          dev_mode: false
        }, 401);
      }
    }
    return jsonResponse({
      success: false,
      error: "Invalid login request",
      dev_mode: isDev
    }, 400);
  } catch (error) {
    console.error("Login error:", error);
    return jsonResponse({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}
async function handleLogout(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = decodeJWTUnsafe(token);
      if (payload && payload.jti) {
        blacklistToken(payload.jti);
      }
    }
    return jsonResponse({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return jsonResponse({
      success: false,
      error: "Logout failed"
    }, 500);
  }
}
async function handleRefresh(request, env) {
  try {
    const body = await request.json();
    const { refresh_token } = body;
    if (!refresh_token) {
      return jsonResponse({
        success: false,
        error: "Refresh token required"
      }, 400);
    }
    const newAccessToken = await refreshAccessToken(refresh_token, env);
    if (!newAccessToken) {
      return jsonResponse({
        success: false,
        error: "Invalid or expired refresh token"
      }, 401);
    }
    return jsonResponse({
      success: true,
      access_token: newAccessToken,
      token_type: "Bearer",
      expires_in: 15 * 60
      // 15 minutes
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return jsonResponse({
      success: false,
      error: "Token refresh failed"
    }, 500);
  }
}
async function handleMe(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({
        success: false,
        error: "No authorization token provided"
      }, 401);
    }
    const token = authHeader.substring(7);
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return jsonResponse({
          success: false,
          error: "Token expired"
        }, 401);
      }
      const user = await env.DB.prepare("SELECT * FROM user_accounts WHERE user_id = ?").bind(payload.user_id).first();
      if (!user) {
        return jsonResponse({
          success: false,
          error: "User not found"
        }, 404);
      }
      return jsonResponse({
        success: true,
        user
      });
    } catch (error) {
      return jsonResponse({
        success: false,
        error: "Invalid token"
      }, 401);
    }
  } catch (error) {
    console.error("Me endpoint error:", error);
    return jsonResponse({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}
async function handleDevUsers(request, env) {
  const isDev = env.DEV_MODE === "true";
  const devUsersEnabled = env.DEV_USERS_ENABLED === "true";
  if (!isDev || !devUsersEnabled) {
    return jsonResponse({
      success: false,
      error: "Development users not available"
    }, 403);
  }
  try {
    const devUsers = await env.DB.prepare("SELECT user_id, email, role, display_name, status FROM user_accounts WHERE provider = ? ORDER BY role").bind("dev").all();
    return jsonResponse({
      success: true,
      users: devUsers.results,
      dev_mode: true
    });
  } catch (error) {
    console.error("Dev users error:", error);
    return jsonResponse({
      success: false,
      error: "Failed to fetch development users"
    }, 500);
  }
}
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  if (method === "OPTIONS") {
    return handleCORS();
  }
  if (method === "POST" && url.pathname.endsWith("/login")) {
    return handleLogin(request, env);
  }
  if (method === "POST" && url.pathname.endsWith("/logout")) {
    return handleLogout(request, env);
  }
  if (method === "POST" && url.pathname.endsWith("/refresh")) {
    return handleRefresh(request, env);
  }
  if (method === "GET" && url.pathname.endsWith("/me")) {
    return handleMe(request, env);
  }
  if (method === "GET" && url.pathname.endsWith("/dev-users")) {
    return handleDevUsers(request, env);
  }
  return jsonResponse({
    success: false,
    error: "Endpoint not found",
    available_endpoints: {
      "POST /api/auth/login": "User login",
      "POST /api/auth/logout": "User logout",
      "POST /api/auth/refresh": "Refresh access token",
      "GET /api/auth/me": "Get current user",
      "GET /api/auth/dev-users": "Get development users (dev mode only)"
    }
  }, 404);
}
var corsHeaders;
var init_auth = __esm({
  "functions/api/auth.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_jwt();
    init_password();
    corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    __name(handleCORS, "handleCORS");
    __name(jsonResponse, "jsonResponse");
    __name(verifyFirebaseToken, "verifyFirebaseToken");
    __name(getOrCreateUser, "getOrCreateUser");
    __name(getDevUser, "getDevUser");
    __name(handleLogin, "handleLogin");
    __name(handleLogout, "handleLogout");
    __name(handleRefresh, "handleRefresh");
    __name(handleMe, "handleMe");
    __name(handleDevUsers, "handleDevUsers");
    __name(onRequest, "onRequest");
  }
});

// functions/api/env-info.ts
var env_info_exports = {};
__export(env_info_exports, {
  onRequest: () => onRequest2
});
function handleCORS2() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders2
  });
}
function jsonResponse2(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders2
    }
  });
}
async function handleEnvInfo(request, env) {
  const isDev = env.DEV_MODE === "true";
  if (!isDev) {
    return jsonResponse2({
      success: false,
      error: "Environment information not available in production"
    }, 403);
  }
  try {
    const envInfo = {
      success: true,
      environment: env.ENVIRONMENT || "unknown",
      devMode: env.DEV_MODE === "true",
      authEnabled: env.AUTH_ENABLED === "true",
      devUsersEnabled: env.DEV_USERS_ENABLED === "true",
      databaseName: "akiraxtkd-db-dev",
      // From wrangler.toml
      appInfo: {
        name: env.APP_NAME || "Akira X Taekwondo",
        contact: env.CONTACT_EMAIL || "",
        whatsapp: env.WHATSAPP_NUMBER || ""
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      buildInfo: {
        version: "1.0.0-dev",
        node_env: "development",
        platform: "cloudflare-workers"
      }
    };
    return jsonResponse2(envInfo);
  } catch (error) {
    console.error("Environment info error:", error);
    return jsonResponse2({
      success: false,
      error: "Failed to retrieve environment information"
    }, 500);
  }
}
async function onRequest2(context) {
  const { request, env } = context;
  const method = request.method;
  if (method === "OPTIONS") {
    return handleCORS2();
  }
  if (method !== "GET") {
    return jsonResponse2({
      success: false,
      error: "Method not allowed"
    }, 405);
  }
  return handleEnvInfo(request, env);
}
var corsHeaders2;
var init_env_info = __esm({
  "functions/api/env-info.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    corsHeaders2 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    __name(handleCORS2, "handleCORS");
    __name(jsonResponse2, "jsonResponse");
    __name(handleEnvInfo, "handleEnvInfo");
    __name(onRequest2, "onRequest");
  }
});

// functions/api/dashboard.ts
var dashboard_exports = {};
__export(dashboard_exports, {
  onRequest: () => onRequest3
});
async function getAdminStats(db) {
  try {
    const totalStudentsResult = await db.prepare("SELECT COUNT(*) as count FROM student_profiles WHERE created_at IS NOT NULL").first();
    const activeClassesResult = await db.prepare("SELECT COUNT(*) as count FROM classes WHERE status = ?").bind("ongoing").first();
    const newEnrollmentsResult = await db.prepare(`
        SELECT COUNT(*) as count 
        FROM enrollments 
        WHERE status = 'active' 
        AND datetime(created_at) >= datetime('now', '-1 month')
      `).first();
    const attendanceResult = await db.prepare(`
        SELECT 
          COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
          COUNT(*) as total_count
        FROM attendance 
        WHERE datetime(created_at) >= datetime('now', '-1 month')
      `).first();
    const attendanceRate = attendanceResult?.total_count > 0 ? Math.round(attendanceResult.present_count / attendanceResult.total_count * 100) : 0;
    const upcomingGradingsResult = await db.prepare(`
        SELECT COUNT(DISTINCT sp.student_id) as count
        FROM student_profiles sp
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        WHERE sp.created_at IS NOT NULL
      `).first();
    return {
      totalStudents: totalStudentsResult?.count || 0,
      activeClasses: activeClassesResult?.count || 0,
      monthlyRevenue: 12500,
      // TODO: Calculate from invoices/payments
      attendanceRate,
      newEnrollments: newEnrollmentsResult?.count || 0,
      upcomingGradings: Math.min(upcomingGradingsResult?.count || 0, 15)
    };
  } catch (error) {
    console.error("Error getting admin stats:", error);
    return {
      totalStudents: 0,
      activeClasses: 0,
      monthlyRevenue: 0,
      attendanceRate: 0,
      newEnrollments: 0,
      upcomingGradings: 0
    };
  }
}
async function getCoachStats(db, coachId) {
  try {
    const studentsResult = await db.prepare(`
        SELECT COUNT(DISTINCT e.student_id) as count
        FROM enrollments e
        JOIN classes c ON e.class_id = c.class_id
        WHERE c.coach_id = ? AND e.status = 'active'
      `).bind(coachId).first();
    const classesResult = await db.prepare("SELECT COUNT(*) as count FROM classes WHERE coach_id = ? AND status = ?").bind(coachId, "ongoing").first();
    const todaySessionsResult = await db.prepare(`
        SELECT COUNT(*) as count
        FROM sessions s
        JOIN classes c ON s.class_id = c.class_id
        WHERE c.coach_id = ? 
        AND DATE(s.session_date) = DATE('now')
        AND s.status != 'cancelled'
      `).bind(coachId).first();
    const attendanceResult = await db.prepare(`
        SELECT 
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
          COUNT(*) as total_count
        FROM attendance a
        JOIN sessions s ON a.session_id = s.session_id
        JOIN classes c ON s.class_id = c.class_id
        WHERE c.coach_id = ?
        AND datetime(a.created_at) >= datetime('now', '-1 month')
      `).bind(coachId).first();
    const attendanceRate = attendanceResult?.total_count > 0 ? Math.round(attendanceResult.present_count / attendanceResult.total_count * 100) : 0;
    return {
      totalStudents: studentsResult?.count || 0,
      activeClasses: classesResult?.count || 0,
      todaysSessions: todaySessionsResult?.count || 0,
      attendanceRate,
      upcomingGradings: 8
      // TODO: Calculate based on student progress
    };
  } catch (error) {
    console.error("Error getting coach stats:", error);
    return {
      totalStudents: 0,
      activeClasses: 0,
      todaysSessions: 0,
      attendanceRate: 0,
      upcomingGradings: 0
    };
  }
}
async function getStudentStats(db, studentId) {
  try {
    const studentResult = await db.prepare(`
        SELECT sp.*, 
               r.name_en as current_belt,
               r.color as belt_color
        FROM student_profiles sp
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        LEFT JOIN ranks r ON srh.rank_id = r.rank_id
        WHERE sp.student_id = ?
        ORDER BY srh.granted_on DESC
        LIMIT 1
      `).bind(studentId).first();
    const attendanceResult = await db.prepare(`
        SELECT COUNT(*) as count
        FROM attendance a
        JOIN sessions s ON a.session_id = s.session_id
        WHERE a.student_id = ?
        AND a.status = 'present'
        AND datetime(s.session_date) >= datetime('now', '-1 month')
      `).bind(studentId).first();
    const totalSessionsResult = await db.prepare(`
        SELECT COUNT(*) as count
        FROM attendance a
        JOIN sessions s ON a.session_id = s.session_id
        WHERE a.student_id = ?
        AND datetime(s.session_date) >= datetime('now', '-1 month')
      `).bind(studentId).first();
    const attendanceRate = totalSessionsResult?.count > 0 ? Math.round((attendanceResult?.count || 0) / totalSessionsResult.count * 100) : 0;
    return {
      currentBelt: studentResult?.current_belt || "White Belt",
      beltColor: studentResult?.belt_color || "white",
      classesAttended: attendanceResult?.count || 0,
      attendanceRate,
      nextGrading: "January 15, 2025",
      // TODO: Calculate based on requirements
      daysUntilGrading: 23
    };
  } catch (error) {
    console.error("Error getting student stats:", error);
    return {
      currentBelt: "White Belt",
      beltColor: "white",
      classesAttended: 0,
      attendanceRate: 0,
      nextGrading: "TBD",
      daysUntilGrading: 0
    };
  }
}
async function getAllStudents(db) {
  try {
    const students = await db.prepare(`
        SELECT 
          sp.*,
          r.name_en as current_belt,
          r.color as belt_color,
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0) as attendance_rate,
          MAX(s.session_date) as last_attended
        FROM student_profiles sp
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        LEFT JOIN ranks r ON srh.rank_id = r.rank_id
        LEFT JOIN attendance a ON sp.student_id = a.student_id
        LEFT JOIN sessions s ON a.session_id = s.session_id
        WHERE sp.created_at IS NOT NULL
        GROUP BY sp.student_id
        ORDER BY sp.created_at DESC
      `).all();
    return students.results || [];
  } catch (error) {
    console.error("Error getting all students:", error);
    return [];
  }
}
async function getCoachStudents(db, coachId) {
  try {
    const students = await db.prepare(`
        SELECT DISTINCT
          sp.*,
          r.name_en as current_belt,
          r.color as belt_color,
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0) as attendance_rate,
          MAX(s.session_date) as last_attended
        FROM student_profiles sp
        JOIN enrollments e ON sp.student_id = e.student_id
        JOIN classes c ON e.class_id = c.class_id
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        LEFT JOIN ranks r ON srh.rank_id = r.rank_id
        LEFT JOIN attendance a ON sp.student_id = a.student_id
        LEFT JOIN sessions s ON a.session_id = s.session_id
        WHERE c.coach_id = ? AND e.status = 'active'
        GROUP BY sp.student_id
        ORDER BY sp.legal_name
      `).bind(coachId).all();
    return students.results || [];
  } catch (error) {
    console.error("Error getting coach students:", error);
    return [];
  }
}
async function getTodaySessions(db, coachId) {
  try {
    const sessions = await db.prepare(`
        SELECT 
          s.*,
          c.name as class_name,
          v.name as venue_name,
          cp.display_name as coach_name,
          COUNT(e.student_id) as enrolled_students,
          CASE 
            WHEN COUNT(a.attendance_id) > 0 THEN 'completed'
            WHEN datetime('now') > datetime(s.session_date || ' ' || s.planned_end_time) THEN 'completed'
            ELSE 'pending'
          END as attendance_status
        FROM sessions s
        JOIN classes c ON s.class_id = c.class_id
        JOIN venues v ON c.venue_id = v.venue_id
        JOIN coach_profiles cp ON c.coach_id = cp.coach_id
        LEFT JOIN enrollments e ON c.class_id = e.class_id AND e.status = 'active'
        LEFT JOIN attendance a ON s.session_id = a.session_id
        WHERE c.coach_id = ?
        AND DATE(s.session_date) = DATE('now')
        AND s.status != 'cancelled'
        GROUP BY s.session_id
        ORDER BY s.planned_start_time
      `).bind(coachId).all();
    return sessions.results || [];
  } catch (error) {
    console.error("Error getting today sessions:", error);
    return [];
  }
}
async function getStudentClasses(db, studentId) {
  try {
    const classes = await db.prepare(`
        SELECT 
          c.*,
          p.name as program_name,
          v.name as venue_name,
          cp.display_name as coach_name,
          e.status as enrollment_status,
          CASE c.day_of_week
            WHEN 0 THEN 'Sunday'
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
          END as day_name
        FROM classes c
        JOIN enrollments e ON c.class_id = e.class_id
        JOIN programs p ON c.program_id = p.program_id
        JOIN venues v ON c.venue_id = v.venue_id
        JOIN coach_profiles cp ON c.coach_id = cp.coach_id
        WHERE e.student_id = ? AND e.status IN ('active', 'waitlist')
        ORDER BY c.day_of_week, c.start_time
      `).bind(studentId).all();
    return classes.results || [];
  } catch (error) {
    console.error("Error getting student classes:", error);
    return [];
  }
}
async function getRecentActivities(db) {
  try {
    const activities = [];
    const enrollments = await db.prepare(`
        SELECT 
          e.enrollment_id as id,
          'enrollment' as type,
          sp.legal_name || ' enrolled in ' || c.name as message,
          e.created_at as timestamp,
          'success' as status
        FROM enrollments e
        JOIN student_profiles sp ON e.student_id = sp.student_id
        JOIN classes c ON e.class_id = c.class_id
        WHERE datetime(e.created_at) >= datetime('now', '-7 days')
        ORDER BY e.created_at DESC
        LIMIT 5
      `).all();
    activities.push(...(enrollments.results || []).map((item) => ({
      ...item,
      timestamp: formatTimeAgo(item.timestamp)
    })));
    return activities.slice(0, 10);
  } catch (error) {
    console.error("Error getting recent activities:", error);
    return [];
  }
}
function formatTimeAgo(timestamp) {
  const now = /* @__PURE__ */ new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1e3 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString();
}
async function onRequest3(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/dashboard", "");
  const corsHeaders3 = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  try {
    let currentUser = null;
    try {
      currentUser = await requireAuth(request, env);
    } catch (authError) {
      return new Response(JSON.stringify({
        success: false,
        error: "Authentication required"
      }), {
        status: 401,
        headers: { ...corsHeaders3, "Content-Type": "application/json" }
      });
    }
    const response = await handleDashboardRequest(path, request.method, env.DB, currentUser);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders3, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { ...corsHeaders3, "Content-Type": "application/json" }
    });
  }
}
async function handleDashboardRequest(path, method, db, user) {
  const [, role, action] = path.split("/");
  if (method === "GET") {
    switch (`${role}/${action}`) {
      case "admin/stats":
        if (user.role !== "admin") throw new Error("Unauthorized");
        const adminStats = await getAdminStats(db);
        return { success: true, data: adminStats };
      case "admin/students":
        if (user.role !== "admin") throw new Error("Unauthorized");
        const allStudents = await getAllStudents(db);
        return { success: true, data: allStudents };
      case "admin/activities":
        if (user.role !== "admin") throw new Error("Unauthorized");
        const activities = await getRecentActivities(db);
        return { success: true, data: activities };
      case "coach/stats":
        if (user.role !== "coach") throw new Error("Unauthorized");
        const coachStats = await getCoachStats(db, user.user_id);
        return { success: true, data: coachStats };
      case "coach/students":
        if (user.role !== "coach") throw new Error("Unauthorized");
        const coachStudents = await getCoachStudents(db, user.user_id);
        return { success: true, data: coachStudents };
      case "coach/sessions":
        if (user.role !== "coach") throw new Error("Unauthorized");
        const todaySessions = await getTodaySessions(db, user.user_id);
        return { success: true, data: todaySessions };
      case "student/stats":
        if (user.role !== "student") throw new Error("Unauthorized");
        const studentStats = await getStudentStats(db, user.user_id);
        return { success: true, data: studentStats };
      case "student/classes":
        if (user.role !== "student") throw new Error("Unauthorized");
        const studentClasses = await getStudentClasses(db, user.user_id);
        return { success: true, data: studentClasses };
      default:
        throw new Error("Not found");
    }
  }
  throw new Error("Method not allowed");
}
var init_dashboard = __esm({
  "functions/api/dashboard.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_jwt();
    __name(getAdminStats, "getAdminStats");
    __name(getCoachStats, "getCoachStats");
    __name(getStudentStats, "getStudentStats");
    __name(getAllStudents, "getAllStudents");
    __name(getCoachStudents, "getCoachStudents");
    __name(getTodaySessions, "getTodaySessions");
    __name(getStudentClasses, "getStudentClasses");
    __name(getRecentActivities, "getRecentActivities");
    __name(formatTimeAgo, "formatTimeAgo");
    __name(onRequest3, "onRequest");
    __name(handleDashboardRequest, "handleDashboardRequest");
  }
});

// functions/api/students.ts
var students_exports = {};
__export(students_exports, {
  onRequest: () => onRequest4
});
function generateStudentCode() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `AXT${year}${randomNum.toString().padStart(3, "0")}`;
}
function validateStudentData(data) {
  const errors = [];
  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.push("First name is required");
  }
  if (!data.last_name || data.last_name.trim().length === 0) {
    errors.push("Last name is required");
  }
  if (!data.date_of_birth) {
    errors.push("Date of birth is required");
  } else {
    const birthDate = new Date(data.date_of_birth);
    const today = /* @__PURE__ */ new Date();
    if (birthDate > today) {
      errors.push("Date of birth cannot be in the future");
    }
  }
  if (!data.gender || !["Male", "Female", "Other"].includes(data.gender)) {
    errors.push("Valid gender is required");
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  return { isValid: errors.length === 0, errors };
}
function buildWhereClause(filters) {
  const conditions = [];
  const params = [];
  let paramIndex = 1;
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      const placeholders = filters.status.map(() => `?${paramIndex++}`).join(",");
      conditions.push(`status IN (${placeholders})`);
      params.push(...filters.status);
    } else {
      conditions.push(`status = ?${paramIndex++}`);
      params.push(filters.status);
    }
  }
  if (filters.gender) {
    if (Array.isArray(filters.gender)) {
      const placeholders = filters.gender.map(() => `?${paramIndex++}`).join(",");
      conditions.push(`gender IN (${placeholders})`);
      params.push(...filters.gender);
    } else {
      conditions.push(`gender = ?${paramIndex++}`);
      params.push(filters.gender);
    }
  }
  if (filters.search) {
    conditions.push(`(first_name LIKE ?${paramIndex} OR last_name LIKE ?${paramIndex + 1} OR email LIKE ?${paramIndex + 2})`);
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
    paramIndex += 3;
  }
  if (filters.date_from) {
    conditions.push(`joined_date >= ?${paramIndex++}`);
    params.push(filters.date_from);
  }
  if (filters.date_to) {
    conditions.push(`joined_date <= ?${paramIndex++}`);
    params.push(filters.date_to);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, params };
}
async function getStudents(context) {
  try {
    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 100);
    const offset = (page - 1) * limit;
    const filters = {
      status: url.searchParams.get("status"),
      gender: url.searchParams.get("gender"),
      search: url.searchParams.get("search"),
      date_from: url.searchParams.get("date_from"),
      date_to: url.searchParams.get("date_to")
    };
    const sortField = url.searchParams.get("sort_field") || "created_at";
    const sortOrder = url.searchParams.get("sort_order") || "DESC";
    const { where, params } = buildWhereClause(filters);
    const countQuery = `SELECT COUNT(*) as total FROM students ${where}`;
    const countResult = await context.env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult?.total || 0;
    const studentsQuery = `
      SELECT 
        s.*,
        bl.belt_name,
        bl.belt_color,
        bl.level_order
      FROM students s
      LEFT JOIN (
        SELECT 
          sbh.student_id,
          sbh.belt_level_id,
          ROW_NUMBER() OVER (PARTITION BY sbh.student_id ORDER BY sbh.achieved_date DESC) as rn
        FROM student_belt_history sbh
      ) latest_belt ON s.id = latest_belt.student_id AND latest_belt.rn = 1
      LEFT JOIN belt_levels bl ON latest_belt.belt_level_id = bl.id
      ${where}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}
    `;
    const studentsResult = await context.env.DB.prepare(studentsQuery).bind(...params, limit, offset).all();
    const students = studentsResult.results.map((row) => ({
      id: row.id,
      student_code: row.student_code,
      first_name: row.first_name,
      last_name: row.last_name,
      full_name: row.full_name,
      date_of_birth: row.date_of_birth,
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      joined_date: row.joined_date,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      current_belt: row.belt_name ? {
        belt_name: row.belt_name,
        belt_color: row.belt_color,
        level_order: row.level_order
      } : null
    }));
    const response = {
      data: students,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        has_next: offset + limit < total,
        has_prev: page > 1
      }
    };
    return new Response(JSON.stringify({ success: true, ...response }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Failed to fetch students"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function createStudent(context) {
  try {
    const data = await context.request.json();
    const validation = validateStudentData(data);
    if (!validation.isValid) {
      return new Response(JSON.stringify({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Invalid student data",
        details: { field_errors: validation.errors }
      }), {
        status: 422,
        headers: { "Content-Type": "application/json" }
      });
    }
    let studentCode = generateStudentCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await context.env.DB.prepare(
        "SELECT id FROM students WHERE student_code = ?"
      ).bind(studentCode).first();
      if (!existing) break;
      studentCode = generateStudentCode();
      attempts++;
    }
    if (attempts >= 10) {
      return new Response(JSON.stringify({
        success: false,
        error: "GENERATION_ERROR",
        message: "Failed to generate unique student code"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const insertQuery = `
      INSERT INTO students (
        student_code, first_name, last_name, date_of_birth, gender,
        phone, email, emergency_contact_name, emergency_contact_phone,
        emergency_contact_relationship, address, postal_code, joined_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const joinedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const result = await context.env.DB.prepare(insertQuery).bind(
      studentCode,
      data.first_name,
      data.last_name,
      data.date_of_birth,
      data.gender,
      data.phone || null,
      data.email || null,
      data.emergency_contact_name || null,
      data.emergency_contact_phone || null,
      data.emergency_contact_relationship || null,
      data.address || null,
      data.postal_code || null,
      joinedDate,
      data.notes || null
    ).run();
    if (!result.success) {
      throw new Error("Failed to insert student");
    }
    const newStudent = await context.env.DB.prepare(
      "SELECT * FROM students WHERE id = ?"
    ).bind(result.meta.last_row_id).first();
    return new Response(JSON.stringify({
      success: true,
      data: newStudent,
      message: "Student created successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Failed to create student"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function getStudent(context) {
  try {
    const studentId = context.params?.id;
    if (!studentId || isNaN(parseInt(studentId))) {
      return new Response(JSON.stringify({
        success: false,
        error: "INVALID_ID",
        message: "Valid student ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const studentQuery = `
      SELECT 
        s.*,
        bl.belt_name as current_belt_name,
        bl.belt_color as current_belt_color,
        bl.level_order as current_belt_order
      FROM students s
      LEFT JOIN (
        SELECT 
          sbh.student_id,
          sbh.belt_level_id,
          ROW_NUMBER() OVER (PARTITION BY sbh.student_id ORDER BY sbh.achieved_date DESC) as rn
        FROM student_belt_history sbh
      ) latest_belt ON s.id = latest_belt.student_id AND latest_belt.rn = 1
      LEFT JOIN belt_levels bl ON latest_belt.belt_level_id = bl.id
      WHERE s.id = ?
    `;
    const student = await context.env.DB.prepare(studentQuery).bind(studentId).first();
    if (!student) {
      return new Response(JSON.stringify({
        success: false,
        error: "NOT_FOUND",
        message: "Student not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const beltHistoryQuery = `
      SELECT 
        sbh.*,
        bl.belt_name,
        bl.belt_color,
        bl.level_order
      FROM student_belt_history sbh
      LEFT JOIN belt_levels bl ON sbh.belt_level_id = bl.id
      WHERE sbh.student_id = ?
      ORDER BY sbh.achieved_date DESC
    `;
    const beltHistory = await context.env.DB.prepare(beltHistoryQuery).bind(studentId).all();
    const studentWithDetails = {
      ...student,
      current_belt: student.current_belt_name ? {
        belt_name: student.current_belt_name,
        belt_color: student.current_belt_color,
        level_order: student.current_belt_order
      } : null,
      belt_history: beltHistory.results
    };
    return new Response(JSON.stringify({
      success: true,
      data: studentWithDetails
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Failed to fetch student"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function updateStudent(context) {
  try {
    const studentId = context.params?.id;
    if (!studentId || isNaN(parseInt(studentId))) {
      return new Response(JSON.stringify({
        success: false,
        error: "INVALID_ID",
        message: "Valid student ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await context.request.json();
    if (Object.keys(data).length > 0) {
      const validation = validateStudentData({ ...data, first_name: data.first_name || "dummy", last_name: data.last_name || "dummy", date_of_birth: data.date_of_birth || "2000-01-01", gender: data.gender || "Male" });
      if (!validation.isValid && (data.first_name || data.last_name || data.date_of_birth || data.gender || data.email)) {
        return new Response(JSON.stringify({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Invalid student data",
          details: { field_errors: validation.errors }
        }), {
          status: 422,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const existing = await context.env.DB.prepare("SELECT id FROM students WHERE id = ?").bind(studentId).first();
    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: "NOT_FOUND",
        message: "Student not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const updateFields = [];
    const updateValues = [];
    if (data.first_name !== void 0) {
      updateFields.push("first_name = ?");
      updateValues.push(data.first_name);
    }
    if (data.last_name !== void 0) {
      updateFields.push("last_name = ?");
      updateValues.push(data.last_name);
    }
    if (data.date_of_birth !== void 0) {
      updateFields.push("date_of_birth = ?");
      updateValues.push(data.date_of_birth);
    }
    if (data.gender !== void 0) {
      updateFields.push("gender = ?");
      updateValues.push(data.gender);
    }
    if (data.phone !== void 0) {
      updateFields.push("phone = ?");
      updateValues.push(data.phone);
    }
    if (data.email !== void 0) {
      updateFields.push("email = ?");
      updateValues.push(data.email);
    }
    if (data.status !== void 0) {
      updateFields.push("status = ?");
      updateValues.push(data.status);
    }
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "NO_UPDATES",
        message: "No fields to update"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateValues.push(studentId);
    const updateQuery = `UPDATE students SET ${updateFields.join(", ")} WHERE id = ?`;
    await context.env.DB.prepare(updateQuery).bind(...updateValues).run();
    const updatedStudent = await context.env.DB.prepare("SELECT * FROM students WHERE id = ?").bind(studentId).first();
    return new Response(JSON.stringify({
      success: true,
      data: updatedStudent,
      message: "Student updated successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Failed to update student"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function deleteStudent(context) {
  try {
    const studentId = context.params?.id;
    if (!studentId || isNaN(parseInt(studentId))) {
      return new Response(JSON.stringify({
        success: false,
        error: "INVALID_ID",
        message: "Valid student ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existing = await context.env.DB.prepare("SELECT id FROM students WHERE id = ?").bind(studentId).first();
    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: "NOT_FOUND",
        message: "Student not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await context.env.DB.prepare(
      "UPDATE students SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind("Inactive", studentId).run();
    return new Response(JSON.stringify({
      success: true,
      message: "Student deleted successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Failed to delete student"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function onRequest4(context) {
  const { request, env, params } = context;
  const corsHeaders3 = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders3 });
  }
  try {
    let currentUser;
    try {
      currentUser = await requireAuth(request, env);
    } catch (authError) {
      return new Response(JSON.stringify({
        success: false,
        error: "AUTHENTICATION_REQUIRED",
        message: "Authentication required to access student data"
      }), {
        status: 401,
        headers: { ...corsHeaders3, "Content-Type": "application/json" }
      });
    }
    if (!["admin", "coach"].includes(currentUser.role)) {
      return new Response(JSON.stringify({
        success: false,
        error: "INSUFFICIENT_PERMISSIONS",
        message: "Insufficient permissions to access student data"
      }), {
        status: 403,
        headers: { ...corsHeaders3, "Content-Type": "application/json" }
      });
    }
    const ctx = { request, env, params };
    switch (request.method) {
      case "GET":
        return params?.id ? await getStudent(ctx) : await getStudents(ctx);
      case "POST":
        if (currentUser.role !== "admin") {
          return new Response(JSON.stringify({
            success: false,
            error: "INSUFFICIENT_PERMISSIONS",
            message: "Only administrators can create students"
          }), {
            status: 403,
            headers: { ...corsHeaders3, "Content-Type": "application/json" }
          });
        }
        return await createStudent(ctx);
      case "PUT":
        if (currentUser.role !== "admin") {
          return new Response(JSON.stringify({
            success: false,
            error: "INSUFFICIENT_PERMISSIONS",
            message: "Only administrators can update students"
          }), {
            status: 403,
            headers: { ...corsHeaders3, "Content-Type": "application/json" }
          });
        }
        return await updateStudent(ctx);
      case "DELETE":
        if (currentUser.role !== "admin") {
          return new Response(JSON.stringify({
            success: false,
            error: "INSUFFICIENT_PERMISSIONS",
            message: "Only administrators can delete students"
          }), {
            status: 403,
            headers: { ...corsHeaders3, "Content-Type": "application/json" }
          });
        }
        return await deleteStudent(ctx);
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "METHOD_NOT_ALLOWED",
          message: "Method not allowed"
        }), {
          status: 405,
          headers: { ...corsHeaders3, "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    }), {
      status: 500,
      headers: { ...corsHeaders3, "Content-Type": "application/json" }
    });
  }
}
var init_students = __esm({
  "functions/api/students.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_jwt();
    __name(generateStudentCode, "generateStudentCode");
    __name(validateStudentData, "validateStudentData");
    __name(buildWhereClause, "buildWhereClause");
    __name(getStudents, "getStudents");
    __name(createStudent, "createStudent");
    __name(getStudent, "getStudent");
    __name(updateStudent, "updateStudent");
    __name(deleteStudent, "deleteStudent");
    __name(onRequest4, "onRequest");
  }
});

// .wrangler/tmp/bundle-0fpfi7/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-0fpfi7/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// functions/_worker.js
init_checked_fetch();
init_modules_watch_stub();
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname.startsWith("/api/")) {
      if (pathname.startsWith("/api/auth")) {
        const { onRequest: onRequest5 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
        return onRequest5({ request, env, ctx });
      }
      if (pathname === "/api/env-info") {
        const { onRequest: onRequest5 } = await Promise.resolve().then(() => (init_env_info(), env_info_exports));
        return onRequest5({ request, env, ctx });
      }
      if (pathname.startsWith("/api/dashboard")) {
        const { onRequest: onRequest5 } = await Promise.resolve().then(() => (init_dashboard(), dashboard_exports));
        return onRequest5({ request, env, ctx });
      }
      if (pathname.startsWith("/api/students")) {
        const { onRequest: onRequest5 } = await Promise.resolve().then(() => (init_students(), students_exports));
        return onRequest5({ request, env, ctx });
      }
    }
    return new Response(JSON.stringify({
      success: false,
      error: "API endpoint not found",
      path: pathname,
      available_endpoints: [
        "POST /api/auth/login",
        "GET /api/auth/me",
        "GET /api/auth/dev-users",
        "GET /api/env-info",
        "GET /api/students",
        "POST /api/students"
      ]
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
};

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-0fpfi7/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-0fpfi7/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=_worker.js.map
