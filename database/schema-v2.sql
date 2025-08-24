-- Akira X Taekwondo Database Schema v2
-- Cloudflare D1 SQLite Database
-- Updated with Google Sign-In + Firebase Authentication support

-- =====================================================
-- 1. USER_ACCOUNTS TABLE (用户账户 - 认证系统)
-- =====================================================
CREATE TABLE user_accounts (
    user_id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT UNIQUE NOT NULL,
    google_id TEXT UNIQUE, -- Google OAuth ID
    firebase_uid TEXT UNIQUE NOT NULL, -- Firebase Authentication UID
    
    role TEXT NOT NULL CHECK (role IN ('student', 'coach', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- Profile information from Google
    display_name TEXT,
    photo_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Authentication metadata
    provider TEXT DEFAULT 'google' CHECK (provider IN ('google', 'email', 'dev')),
    last_login_at DATETIME,
    login_count INTEGER DEFAULT 0,
    
    -- Account management
    terms_accepted_at DATETIME,
    privacy_accepted_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. STUDENT_PROFILES TABLE (学员档案)
-- =====================================================
CREATE TABLE student_profiles (
    student_id TEXT PRIMARY KEY REFERENCES user_accounts(user_id),
    student_code TEXT UNIQUE NOT NULL, -- AXT2024001
    legal_name TEXT NOT NULL,
    display_name TEXT,
    name_normalized TEXT, -- 搜索用
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    school_year TEXT,
    medical_notes TEXT,
    
    -- 监护人信息
    primary_guardian_name TEXT,
    primary_guardian_phone TEXT,
    primary_guardian_email TEXT,
    emergency_contacts TEXT, -- JSON: [{name, phone, relationship}]
    
    -- 训练相关
    target_rank_hint TEXT, -- 教练评估的下一个腰带
    cert_profile_ref TEXT, -- 未来GAL链接
    
    -- 地址信息
    address TEXT,
    postal_code TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. COACH_PROFILES TABLE (教练档案)
-- =====================================================
CREATE TABLE coach_profiles (
    coach_id TEXT PRIMARY KEY REFERENCES user_accounts(user_id),
    coach_code TEXT UNIQUE NOT NULL, -- AXT-COACH-001
    legal_name TEXT NOT NULL,
    display_name TEXT,
    phone TEXT,
    email TEXT,
    
    -- 教学相关
    teachable_programs TEXT, -- JSON: 可教授的项目
    availability_note TEXT,
    in_service_status TEXT DEFAULT 'active',
    cert_profile_ref TEXT, -- 认证链接
    compliance_note TEXT,
    
    -- 资质信息
    current_belt_level_id TEXT,
    certification_level TEXT,
    years_experience INTEGER,
    specializations TEXT, -- JSON
    hire_date DATE,
    hourly_rate DECIMAL(8,2),
    
    bio TEXT,
    profile_image_url TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. ADMIN_PROFILES TABLE (管理员档案)
-- =====================================================
CREATE TABLE admin_profiles (
    admin_id TEXT PRIMARY KEY REFERENCES user_accounts(user_id),
    admin_code TEXT UNIQUE NOT NULL,
    legal_name TEXT NOT NULL,
    display_name TEXT,
    scope_notes TEXT, -- 权限范围说明
    mfa_policy TEXT, -- MFA策略
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. PROGRAMS TABLE (项目)
-- =====================================================
CREATE TABLE programs (
    program_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    age_guidance TEXT, -- 年龄指导
    tags TEXT, -- JSON: 标签数组
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. VENUES TABLE (场地)
-- =====================================================
CREATE TABLE venues (
    venue_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT,
    capacity INTEGER,
    map_link TEXT,
    facilities TEXT, -- JSON: 设施列表
    contact_phone TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. CLASSES TABLE (课程)
-- =====================================================
CREATE TABLE classes (
    class_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    program_id TEXT NOT NULL,
    venue_id TEXT NOT NULL,
    coach_id TEXT NOT NULL,
    
    -- 时间安排
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- 容量管理
    capacity INTEGER DEFAULT 20,
    age_group TEXT,
    skill_level TEXT DEFAULT 'All Levels' CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
    class_type TEXT DEFAULT 'Regular' CHECK (class_type IN ('Regular', 'Competition', 'Private', 'Seminar')),
    
    description TEXT,
    policy_doc_url TEXT,
    status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'paused', 'full', 'archived')),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (program_id) REFERENCES programs(program_id),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
    FOREIGN KEY (coach_id) REFERENCES coach_profiles(coach_id)
);

-- =====================================================
-- 8. SESSIONS TABLE (会话)
-- =====================================================
CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    session_date DATE NOT NULL,
    
    -- 计划时间
    planned_start_time TIME NOT NULL,
    planned_end_time TIME NOT NULL,
    
    -- 实际时间
    actual_start_time TIME,
    actual_end_time TIME,
    
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
    cancellation_reason TEXT,
    notes TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    UNIQUE(class_id, session_date)
);

-- =====================================================
-- 9. ENROLLMENTS TABLE (注册)
-- =====================================================
CREATE TABLE enrollments (
    enrollment_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'waitlist', 'paused', 'cancelled', 'ended')),
    join_at DATETIME NOT NULL,
    end_at DATETIME,
    first_activated_at DATETIME, -- "加入时间"
    
    -- 等待列表
    waitlist_position INTEGER,
    
    source TEXT, -- 注册来源
    notes TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- =====================================================
-- 10. ATTENDANCE TABLE (出勤)
-- =====================================================
CREATE TABLE attendance (
    attendance_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'makeup')),
    taken_by_coach_id TEXT NOT NULL,
    taken_at DATETIME NOT NULL,
    
    arrival_time TIME,
    departure_time TIME,
    notes TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    FOREIGN KEY (taken_by_coach_id) REFERENCES coach_profiles(coach_id),
    
    UNIQUE(session_id, student_id)
);

-- =====================================================
-- 11. RANK_TRACKS TABLE (等级轨道)
-- =====================================================
CREATE TABLE rank_tracks (
    track_id TEXT PRIMARY KEY,
    name TEXT NOT NULL, -- Color, Poom, Black
    description TEXT,
    display_order INTEGER NOT NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. RANKS TABLE (等级)
-- =====================================================
CREATE TABLE ranks (
    rank_id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_zh TEXT,
    color TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    
    is_tip BOOLEAN DEFAULT FALSE,
    is_stripe BOOLEAN DEFAULT FALSE,
    
    -- 资格要求
    min_age INTEGER,
    min_weeks INTEGER,
    min_classes INTEGER,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (track_id) REFERENCES rank_tracks(track_id),
    UNIQUE(track_id, order_index)
);

-- =====================================================
-- 13. STUDENT_RANK_HISTORY TABLE (学员等级历史)
-- =====================================================
CREATE TABLE student_rank_history (
    history_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    rank_id TEXT NOT NULL,
    
    source TEXT NOT NULL CHECK (source IN ('join', 'external', 'internal_grading')),
    granted_on DATE NOT NULL,
    granted_by TEXT, -- 授予者
    remarks TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    FOREIGN KEY (rank_id) REFERENCES ranks(rank_id)
);

-- =====================================================
-- 14. GRADING_EVENTS TABLE (升级考试)
-- =====================================================
CREATE TABLE grading_events (
    event_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    event_date DATE NOT NULL,
    venue_id TEXT,
    
    fee DECIMAL(10,2),
    registration_start_date DATE,
    registration_end_date DATE,
    
    eligibility_rules TEXT, -- JSON: 资格规则快照
    rulebook_url TEXT,
    application_form_url TEXT,
    examiner_cert_snapshot TEXT, -- JSON: 考官认证快照
    
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'open', 'closed', 'completed')),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
);

-- =====================================================
-- 15. GRADING_REGISTRATIONS TABLE (升级报名)
-- =====================================================
CREATE TABLE grading_registrations (
    registration_id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    target_rank_id TEXT NOT NULL,
    
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    
    remarks TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES grading_events(event_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    FOREIGN KEY (target_rank_id) REFERENCES ranks(rank_id),
    
    UNIQUE(event_id, student_id)
);

-- =====================================================
-- 16. GRADING_RESULTS TABLE (升级结果)
-- =====================================================
CREATE TABLE grading_results (
    result_id TEXT PRIMARY KEY,
    registration_id TEXT NOT NULL,
    
    result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'pending', 'no_show')),
    score DECIMAL(5,2),
    comments TEXT,
    awarded_on DATE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (registration_id) REFERENCES grading_registrations(registration_id),
    UNIQUE(registration_id)
);

-- =====================================================
-- 17. COMPETITIONS TABLE (比赛)
-- =====================================================
CREATE TABLE competitions (
    competition_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    host_organization TEXT,
    co_host_organization TEXT,
    sanction_code TEXT,
    level_code TEXT,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    main_venue_id TEXT,
    
    disciplines TEXT, -- JSON: ['Sparring', 'Poomsae', 'Board-break']
    fees TEXT, -- JSON: {registration: 50, late: 75}
    registration_deadline DATE,
    
    rules_version TEXT,
    contact_info TEXT, -- JSON
    rulebook_url TEXT,
    registration_portal_url TEXT,
    weight_rules_url TEXT,
    
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'open', 'closed', 'ongoing', 'completed')),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (main_venue_id) REFERENCES venues(venue_id)
);

-- =====================================================
-- 18. COMP_DIVISIONS TABLE (比赛组别)
-- =====================================================
CREATE TABLE comp_divisions (
    division_id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL,
    
    discipline TEXT NOT NULL, -- Sparring, Poomsae, etc.
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Mixed')),
    age_min INTEGER,
    age_max INTEGER,
    weight_min DECIMAL(5,2),
    weight_max DECIMAL(5,2),
    
    allowed_tracks TEXT, -- JSON: 允许的等级轨道
    rank_min INTEGER,
    rank_max INTEGER,
    
    is_team BOOLEAN DEFAULT FALSE,
    capacity INTEGER,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id)
);

-- =====================================================
-- 19. COMP_REGISTRATIONS TABLE (比赛报名)
-- =====================================================
CREATE TABLE comp_registrations (
    registration_id TEXT PRIMARY KEY,
    division_id TEXT NOT NULL,
    student_id TEXT,
    team_id TEXT,
    
    club_name TEXT,
    coach_reference TEXT,
    
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    
    registered_at DATETIME NOT NULL,
    athlete_cert_snapshot TEXT, -- JSON
    coach_cert_snapshot TEXT, -- JSON
    
    notes TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (division_id) REFERENCES comp_divisions(division_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    
    CHECK ((student_id IS NOT NULL) OR (team_id IS NOT NULL))
);

-- =====================================================
-- 20. INVOICES TABLE (发票)
-- =====================================================
CREATE TABLE invoices (
    invoice_id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    student_id TEXT NOT NULL,
    
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'void', 'refund')),
    currency TEXT DEFAULT 'SGD',
    
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    issue_date DATE,
    due_date DATE,
    paid_date DATE,
    
    notes TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id)
);

-- =====================================================
-- 21. FEE_ITEMS TABLE (费用项目)
-- =====================================================
CREATE TABLE fee_items (
    item_id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    
    item_type TEXT NOT NULL CHECK (item_type IN ('tuition', 'grading', 'competition', 'equipment', 'other')),
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- 关联引用
    class_id TEXT,
    grading_event_id TEXT,
    competition_id TEXT,
    registration_id TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (grading_event_id) REFERENCES grading_events(event_id),
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id)
);

-- =====================================================
-- 22. PAYMENTS TABLE (支付)
-- =====================================================
CREATE TABLE payments (
    payment_id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'SGD',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'paynow', 'online')),
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    transaction_ref TEXT,
    idempotency_key TEXT UNIQUE,
    
    payment_date DATETIME,
    processed_by TEXT,
    
    notes TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);

-- =====================================================
-- 23. DOCUMENT_TEMPLATES TABLE (文档模板)
-- =====================================================
CREATE TABLE document_templates (
    template_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('waiver', 'media_release', 'medical', 'registration')),
    
    content_url TEXT, -- R2存储的模板文件
    fields_schema TEXT, -- JSON: 字段定义
    
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(name, version)
);

-- =====================================================
-- 24. DOCUMENT_RECORDS TABLE (文档记录)
-- =====================================================
CREATE TABLE document_records (
    record_id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL,
    person_id TEXT NOT NULL, -- student_id, coach_id, admin_id
    person_type TEXT NOT NULL CHECK (person_type IN ('student', 'coach', 'admin')),
    
    signed_at DATETIME,
    valid_to DATE,
    
    document_url TEXT, -- R2存储的签名文档
    signature_data TEXT, -- JSON: 签名相关数据
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'expired', 'revoked')),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (template_id) REFERENCES document_templates(template_id)
);

-- =====================================================
-- 25. ANNOUNCEMENTS TABLE (公告)
-- =====================================================
CREATE TABLE announcements (
    announcement_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    
    audience TEXT NOT NULL CHECK (audience IN ('all', 'students', 'coaches', 'parents', 'by_class', 'by_competition')),
    audience_filter TEXT, -- JSON: 受众筛选条件
    
    link_url TEXT,
    image_url TEXT,
    
    published_at DATETIME,
    expires_at DATETIME,
    
    created_by_user_id TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by_user_id) REFERENCES user_accounts(user_id)
);

-- =====================================================
-- 26. NOTES TABLE (备注)
-- =====================================================
CREATE TABLE notes (
    note_id TEXT PRIMARY KEY,
    object_type TEXT NOT NULL CHECK (object_type IN ('student', 'class', 'competition', 'grading_event')),
    object_id TEXT NOT NULL,
    
    content TEXT NOT NULL,
    visibility TEXT DEFAULT 'coach' CHECK (visibility IN ('coach', 'admin')),
    
    author_user_id TEXT NOT NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_user_id) REFERENCES user_accounts(user_id)
);

-- =====================================================
-- 27. AUDIT_LOGS TABLE (审计日志)
-- =====================================================
CREATE TABLE audit_logs (
    log_id TEXT PRIMARY KEY,
    
    object_type TEXT NOT NULL,
    object_id TEXT NOT NULL,
    action TEXT NOT NULL, -- create, update, delete, approve, etc.
    
    actor_user_id TEXT NOT NULL,
    actor_ip TEXT,
    actor_user_agent TEXT,
    
    change_summary TEXT, -- JSON: 变更摘要
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (actor_user_id) REFERENCES user_accounts(user_id)
);

-- =====================================================
-- 28. LOOKUPS TABLE (查找表)
-- =====================================================
CREATE TABLE lookups (
    lookup_id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- gender, attendance_status, enrollment_status, etc.
    code TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_zh TEXT,
    description TEXT,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(category, code)
);

-- =====================================================
-- 29. ROLE_CHANGE_REQUESTS TABLE (角色变更请求)
-- =====================================================
CREATE TABLE role_change_requests (
    request_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    current_role TEXT NOT NULL,
    requested_role TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_by TEXT NOT NULL,
    reviewed_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    
    FOREIGN KEY (user_id) REFERENCES user_accounts(user_id),
    FOREIGN KEY (requested_by) REFERENCES user_accounts(user_id),
    FOREIGN KEY (reviewed_by) REFERENCES user_accounts(user_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- User accounts indexes
CREATE INDEX idx_user_accounts_email ON user_accounts(email);
CREATE INDEX idx_user_accounts_firebase_uid ON user_accounts(firebase_uid);
CREATE INDEX idx_user_accounts_role ON user_accounts(role);
CREATE INDEX idx_user_accounts_status ON user_accounts(status);

-- Student profiles indexes
CREATE INDEX idx_student_profiles_code ON student_profiles(student_code);
CREATE INDEX idx_student_profiles_name_norm ON student_profiles(name_normalized);

-- Coach profiles indexes
CREATE INDEX idx_coach_profiles_code ON coach_profiles(coach_code);
CREATE INDEX idx_coach_profiles_status ON coach_profiles(in_service_status);

-- Classes indexes
CREATE INDEX idx_classes_program ON classes(program_id);
CREATE INDEX idx_classes_venue ON classes(venue_id);
CREATE INDEX idx_classes_coach ON classes(coach_id);
CREATE INDEX idx_classes_day ON classes(day_of_week);
CREATE INDEX idx_classes_status ON classes(status);

-- Sessions indexes
CREATE INDEX idx_sessions_class ON sessions(class_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_status ON sessions(status);

-- Enrollments indexes
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Attendance indexes
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(taken_at);

-- Ranks indexes
CREATE INDEX idx_ranks_track ON ranks(track_id);
CREATE INDEX idx_ranks_order ON ranks(track_id, order_index);

-- Student rank history indexes
CREATE INDEX idx_student_rank_history_student ON student_rank_history(student_id);
CREATE INDEX idx_student_rank_history_date ON student_rank_history(granted_on);

-- Grading events indexes
CREATE INDEX idx_grading_events_date ON grading_events(event_date);
CREATE INDEX idx_grading_events_status ON grading_events(status);

-- Competitions indexes
CREATE INDEX idx_competitions_date ON competitions(start_date);
CREATE INDEX idx_competitions_status ON competitions(status);

-- Financial indexes
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_object ON audit_logs(object_type, object_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);

-- =====================================================
-- TRIGGERS for auto-updating timestamps
-- =====================================================

-- User accounts trigger
CREATE TRIGGER update_user_accounts_timestamp 
    AFTER UPDATE ON user_accounts
    FOR EACH ROW
    BEGIN
        UPDATE user_accounts SET updated_at = CURRENT_TIMESTAMP WHERE user_id = NEW.user_id;
    END;

-- Student profiles trigger
CREATE TRIGGER update_student_profiles_timestamp 
    AFTER UPDATE ON student_profiles
    FOR EACH ROW
    BEGIN
        UPDATE student_profiles SET updated_at = CURRENT_TIMESTAMP WHERE student_id = NEW.student_id;
    END;

-- Coach profiles trigger
CREATE TRIGGER update_coach_profiles_timestamp 
    AFTER UPDATE ON coach_profiles
    FOR EACH ROW
    BEGIN
        UPDATE coach_profiles SET updated_at = CURRENT_TIMESTAMP WHERE coach_id = NEW.coach_id;
    END;

-- Admin profiles trigger
CREATE TRIGGER update_admin_profiles_timestamp 
    AFTER UPDATE ON admin_profiles
    FOR EACH ROW
    BEGIN
        UPDATE admin_profiles SET updated_at = CURRENT_TIMESTAMP WHERE admin_id = NEW.admin_id;
    END;

-- Classes trigger
CREATE TRIGGER update_classes_timestamp 
    AFTER UPDATE ON classes
    FOR EACH ROW
    BEGIN
        UPDATE classes SET updated_at = CURRENT_TIMESTAMP WHERE class_id = NEW.class_id;
    END;

-- Sessions trigger
CREATE TRIGGER update_sessions_timestamp 
    AFTER UPDATE ON sessions
    FOR EACH ROW
    BEGIN
        UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = NEW.session_id;
    END;

-- Enrollments trigger
CREATE TRIGGER update_enrollments_timestamp 
    AFTER UPDATE ON enrollments
    FOR EACH ROW
    BEGIN
        UPDATE enrollments SET updated_at = CURRENT_TIMESTAMP WHERE enrollment_id = NEW.enrollment_id;
    END;

-- Default role trigger
CREATE TRIGGER set_default_role 
    AFTER INSERT ON user_accounts
    FOR EACH ROW
    WHEN NEW.role IS NULL
    BEGIN
        UPDATE user_accounts SET role = 'student' WHERE user_id = NEW.user_id;
    END;
