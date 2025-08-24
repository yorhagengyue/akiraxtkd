-- Student Home Extension Tables
-- 为友善事务型学员主页添加的新表结构

-- 请假申请表
CREATE TABLE IF NOT EXISTS leave_requests (
    leave_request_id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    student_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('sick', 'travel', 'exam', 'family', 'other')),
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto_approved')),
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    approved_by_coach_id TEXT,
    approved_at TEXT,
    
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (approved_by_coach_id) REFERENCES coach_profiles(coach_id)
);

-- 补课申请表
CREATE TABLE IF NOT EXISTS makeup_requests (
    makeup_request_id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    student_id TEXT NOT NULL,
    from_session_id TEXT NOT NULL, -- 原课次
    to_session_id TEXT NOT NULL,   -- 补课课次
    reason TEXT, -- 补课原因
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto_approved')),
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    approved_by_coach_id TEXT,
    approved_at TEXT,
    
    FOREIGN KEY (student_id) REFERENCES student_profiles(student_id),
    FOREIGN KEY (from_session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (to_session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (approved_by_coach_id) REFERENCES coach_profiles(coach_id)
);

-- 通知偏好设置表
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id TEXT PRIMARY KEY,
    channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'whatsapp', 'push')),
    next_session_24h BOOLEAN NOT NULL DEFAULT TRUE,
    next_session_2h BOOLEAN NOT NULL DEFAULT TRUE,
    competition_deadline BOOLEAN NOT NULL DEFAULT TRUE,
    announcement_new BOOLEAN NOT NULL DEFAULT TRUE,
    invoice_due BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    
    FOREIGN KEY (user_id) REFERENCES user_accounts(user_id)
);

-- 消息已读记录表 (轻量化实现)
CREATE TABLE IF NOT EXISTS message_read_status (
    user_id TEXT NOT NULL,
    announcement_id TEXT NOT NULL,
    read_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
    
    PRIMARY KEY (user_id, announcement_id),
    FOREIGN KEY (user_id) REFERENCES user_accounts(user_id),
    FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id)
);

-- 为请假申请添加索引
CREATE INDEX IF NOT EXISTS idx_leave_requests_student_id ON leave_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_session_id ON leave_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_created_at ON leave_requests(created_at);

-- 为补课申请添加索引
CREATE INDEX IF NOT EXISTS idx_makeup_requests_student_id ON makeup_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_makeup_requests_from_session ON makeup_requests(from_session_id);
CREATE INDEX IF NOT EXISTS idx_makeup_requests_to_session ON makeup_requests(to_session_id);
CREATE INDEX IF NOT EXISTS idx_makeup_requests_status ON makeup_requests(status);

-- 为消息已读状态添加索引
CREATE INDEX IF NOT EXISTS idx_message_read_user_id ON message_read_status(user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_announcement_id ON message_read_status(announcement_id);

-- 添加触发器自动更新 updated_at
CREATE TRIGGER IF NOT EXISTS update_leave_requests_timestamp 
    AFTER UPDATE ON leave_requests
    BEGIN
        UPDATE leave_requests SET updated_at = datetime('now', 'utc') WHERE leave_request_id = NEW.leave_request_id;
    END;

CREATE TRIGGER IF NOT EXISTS update_makeup_requests_timestamp 
    AFTER UPDATE ON makeup_requests
    BEGIN
        UPDATE makeup_requests SET updated_at = datetime('now', 'utc') WHERE makeup_request_id = NEW.makeup_request_id;
    END;

CREATE TRIGGER IF NOT EXISTS update_notification_preferences_timestamp 
    AFTER UPDATE ON notification_preferences
    BEGIN
        UPDATE notification_preferences SET updated_at = datetime('now', 'utc') WHERE user_id = NEW.user_id;
    END;
