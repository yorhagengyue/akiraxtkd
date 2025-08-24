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

// .wrangler/tmp/bundle-98xaVL/checked-fetch.js
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
  ".wrangler/tmp/bundle-98xaVL/checked-fetch.js"() {
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
function generateSessionToken(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1e3
    // 24 hours
  };
  return btoa(JSON.stringify(payload));
}
async function handleLogin(request, env) {
  try {
    const body = await request.json();
    const isDev = env.DEV_MODE === "true";
    const authEnabled = env.AUTH_ENABLED === "true";
    const devUsersEnabled = env.DEV_USERS_ENABLED === "true";
    if (isDev && !authEnabled && devUsersEnabled && body.dev_user_email) {
      const devUser = await getDevUser(env.DB, body.dev_user_email);
      if (!devUser) {
        return jsonResponse({
          success: false,
          error: "Development user not found",
          dev_mode: true
        }, 404);
      }
      const sessionToken = generateSessionToken(devUser);
      return jsonResponse({
        success: true,
        user: devUser,
        session_token: sessionToken,
        dev_mode: true
      });
    }
    if (authEnabled && body.firebase_token) {
      try {
        const firebaseUser = await verifyFirebaseToken(body.firebase_token);
        const user = await getOrCreateUser(env.DB, firebaseUser);
        const sessionToken = generateSessionToken(user);
        return jsonResponse({
          success: true,
          user,
          session_token: sessionToken,
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
    __name(generateSessionToken, "generateSessionToken");
    __name(handleLogin, "handleLogin");
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

// functions/api/students.ts
var students_exports = {};
__export(students_exports, {
  onRequest: () => onRequest3
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
async function onRequest3(context) {
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
    const ctx = { request, env, params };
    switch (request.method) {
      case "GET":
        return params?.id ? await getStudent(ctx) : await getStudents(ctx);
      case "POST":
        return await createStudent(ctx);
      case "PUT":
        return await updateStudent(ctx);
      case "DELETE":
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
    __name(generateStudentCode, "generateStudentCode");
    __name(validateStudentData, "validateStudentData");
    __name(buildWhereClause, "buildWhereClause");
    __name(getStudents, "getStudents");
    __name(createStudent, "createStudent");
    __name(getStudent, "getStudent");
    __name(updateStudent, "updateStudent");
    __name(deleteStudent, "deleteStudent");
    __name(onRequest3, "onRequest");
  }
});

// .wrangler/tmp/bundle-98xaVL/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-98xaVL/middleware-insertion-facade.js
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
        const { onRequest: onRequest4 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
        return onRequest4({ request, env, ctx });
      }
      if (pathname === "/api/env-info") {
        const { onRequest: onRequest4 } = await Promise.resolve().then(() => (init_env_info(), env_info_exports));
        return onRequest4({ request, env, ctx });
      }
      if (pathname.startsWith("/api/students")) {
        const { onRequest: onRequest4 } = await Promise.resolve().then(() => (init_students(), students_exports));
        return onRequest4({ request, env, ctx });
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

// .wrangler/tmp/bundle-98xaVL/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-98xaVL/middleware-loader.entry.ts
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
