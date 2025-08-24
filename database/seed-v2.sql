-- Akira X Taekwondo Database Seed Data v2
-- 初始化基础数据和开发用户

-- =====================================================
-- LOOKUPS (查找表数据)
-- =====================================================
INSERT INTO lookups (lookup_id, category, code, name_en, name_zh, display_order) VALUES
-- Gender options
('gender-male', 'gender', 'Male', 'Male', '男', 1),
('gender-female', 'gender', 'Female', 'Female', '女', 2),
('gender-other', 'gender', 'Other', 'Other', '其他', 3),

-- Attendance status
('attendance-present', 'attendance_status', 'present', 'Present', '出席', 1),
('attendance-absent', 'attendance_status', 'absent', 'Absent', '缺席', 2),
('attendance-late', 'attendance_status', 'late', 'Late', '迟到', 3),
('attendance-makeup', 'attendance_status', 'makeup', 'Makeup', '补课', 4),

-- Enrollment status
('enrollment-active', 'enrollment_status', 'active', 'Active', '活跃', 1),
('enrollment-waitlist', 'enrollment_status', 'waitlist', 'Waitlist', '等待列表', 2),
('enrollment-paused', 'enrollment_status', 'paused', 'Paused', '暂停', 3),
('enrollment-cancelled', 'enrollment_status', 'cancelled', 'Cancelled', '取消', 4),
('enrollment-ended', 'enrollment_status', 'ended', 'Ended', '结束', 5),

-- Payment methods
('payment-cash', 'payment_method', 'cash', 'Cash', '现金', 1),
('payment-card', 'payment_method', 'card', 'Card', '银行卡', 2),
('payment-transfer', 'payment_method', 'bank_transfer', 'Bank Transfer', '银行转账', 3),
('payment-paynow', 'payment_method', 'paynow', 'PayNow', 'PayNow', 4),
('payment-online', 'payment_method', 'online', 'Online', '在线支付', 5);

-- =====================================================
-- RANK_TRACKS (等级轨道)
-- =====================================================
INSERT INTO rank_tracks (track_id, name, description, display_order) VALUES
('color', 'Color Belts', 'Colored belt progression for beginners and intermediate students', 1),
('poom', 'Poom Belts', 'Junior black belts for students under 16', 2),
('black', 'Black Belts', 'Black belt progression for adult students', 3);

-- =====================================================
-- RANKS (等级)
-- =====================================================
INSERT INTO ranks (rank_id, track_id, name_en, name_zh, color, order_index, is_tip, is_stripe, min_age, min_weeks, min_classes) VALUES
-- Color belt track
('white', 'color', 'White Belt', '白带', 'White', 1, FALSE, FALSE, 0, 0, 0),
('white-yellow-tip', 'color', 'White Belt with Yellow Tip', '白带黄尖', 'White', 2, TRUE, FALSE, 0, 8, 15),
('yellow-tip', 'color', 'Yellow Tip', '黄尖', 'Yellow', 3, TRUE, FALSE, 0, 16, 30),
('yellow', 'color', 'Yellow Belt', '黄带', 'Yellow', 4, FALSE, FALSE, 0, 24, 45),
('yellow-green-tip', 'color', 'Yellow Belt with Green Tip', '黄带绿尖', 'Yellow', 5, TRUE, FALSE, 0, 32, 60),
('green-tip', 'color', 'Green Tip', '绿尖', 'Green', 6, TRUE, FALSE, 0, 40, 75),
('green', 'color', 'Green Belt', '绿带', 'Green', 7, FALSE, FALSE, 0, 48, 90),
('green-blue-tip', 'color', 'Green Belt with Blue Tip', '绿带蓝尖', 'Green', 8, TRUE, FALSE, 0, 56, 105),
('blue-tip', 'color', 'Blue Tip', '蓝尖', 'Blue', 9, TRUE, FALSE, 0, 64, 120),
('blue', 'color', 'Blue Belt', '蓝带', 'Blue', 10, FALSE, FALSE, 0, 72, 135),
('blue-red-tip', 'color', 'Blue Belt with Red Tip', '蓝带红尖', 'Blue', 11, TRUE, FALSE, 0, 80, 150),
('red-tip', 'color', 'Red Tip', '红尖', 'Red', 12, TRUE, FALSE, 0, 88, 165),
('red', 'color', 'Red Belt', '红带', 'Red', 13, FALSE, FALSE, 0, 96, 180),

-- Poom belt track (junior black belts)
('poom-1', 'poom', '1st Poom', '一品', 'Poom', 14, FALSE, FALSE, 8, 104, 200),
('poom-2', 'poom', '2nd Poom', '二品', 'Poom', 15, FALSE, FALSE, 10, 156, 300),
('poom-3', 'poom', '3rd Poom', '三品', 'Poom', 16, FALSE, FALSE, 12, 208, 400),

-- Black belt track
('black-1', 'black', '1st Dan Black Belt', '一段黑带', 'Black', 14, FALSE, FALSE, 16, 104, 200),
('black-2', 'black', '2nd Dan Black Belt', '二段黑带', 'Black', 15, FALSE, FALSE, 18, 156, 300),
('black-3', 'black', '3rd Dan Black Belt', '三段黑带', 'Black', 16, FALSE, FALSE, 21, 208, 400),
('black-4', 'black', '4th Dan Black Belt', '四段黑带', 'Black', 17, FALSE, FALSE, 25, 260, 500),
('black-5', 'black', '5th Dan Black Belt', '五段黑带', 'Black', 18, FALSE, FALSE, 30, 312, 600);

-- =====================================================
-- PROGRAMS (项目)
-- =====================================================
INSERT INTO programs (program_id, name, description, age_guidance, tags, is_active) VALUES
('beginner', 'Beginner Program', 'Introduction to Taekwondo fundamentals', '6-12 years', '["fundamentals", "kids", "beginner"]', TRUE),
('intermediate', 'Intermediate Program', 'Intermediate level training with forms and sparring', '10-16 years', '["intermediate", "forms", "sparring"]', TRUE),
('advanced', 'Advanced Program', 'Advanced techniques and competition preparation', '14+ years', '["advanced", "competition", "black-belt"]', TRUE),
('adult', 'Adult Program', 'Adult-focused training sessions', '18+ years', '["adult", "fitness", "self-defense"]', TRUE),
('competition', 'Competition Team', 'Competitive training for tournaments', 'All ages', '["competition", "tournament", "elite"]', TRUE);

-- =====================================================
-- VENUES (场地)
-- =====================================================
INSERT INTO venues (venue_id, name, address, postal_code, capacity, contact_phone, facilities, is_active) VALUES
('tampines', 'Tampines Training Center', '604 Tampines Avenue 9', '521604', 30, '+65 8766 8794', '["mats", "mirrors", "changing-room", "parking"]', TRUE),
('compassvale-a', 'Compassvale Training Center A', '211C Compassvale Lane', '540211', 25, '+65 8766 8794', '["mats", "mirrors", "air-con"]', TRUE),
('compassvale-b', 'Compassvale Training Center B', '217C Compassvale Drive', '540217', 25, '+65 8766 8794', '["mats", "mirrors", "storage"]', TRUE),
('fengshan', 'Fengshan Community Club', 'Fengshan CC, Bedok North Street 2', '469661', 40, '+65 8766 8794', '["large-space", "mats", "sound-system", "parking"]', TRUE),
('compassvale-c', 'Compassvale Training Center C', '207A Compassvale Lane', '540207', 20, '+65 8766 8794', '["mats", "mirrors", "compact"]', TRUE);

-- =====================================================
-- DEVELOPMENT USERS (开发用户)
-- =====================================================
INSERT INTO user_accounts (
    user_id, firebase_uid, email, google_id, role, display_name, 
    photo_url, email_verified, provider, status, 
    terms_accepted_at, privacy_accepted_at, created_at
) VALUES
-- Development Admin
('dev-admin-001', 'dev-admin-001', 'admin@dev.local', 'google-dev-admin-001', 'admin', 'Development Admin', 
 'https://via.placeholder.com/150/0066cc/ffffff?text=Admin', TRUE, 'dev', 'active',
 '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

-- Development Coach
('dev-coach-001', 'dev-coach-001', 'coach@dev.local', 'google-dev-coach-001', 'coach', 'Development Coach',
 'https://via.placeholder.com/150/009900/ffffff?text=Coach', TRUE, 'dev', 'active',
 '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

-- Development Student
('dev-student-001', 'dev-student-001', 'student@dev.local', 'google-dev-student-001', 'student', 'Development Student',
 'https://via.placeholder.com/150/cc6600/ffffff?text=Student', TRUE, 'dev', 'active',
 '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- =====================================================
-- DEVELOPMENT PROFILES (开发用户档案)
-- =====================================================

-- Admin Profile
INSERT INTO admin_profiles (
    admin_id, admin_code, legal_name, display_name, scope_notes
) VALUES (
    'dev-admin-001', 'DEV-A-001', 'Development Admin', 'Dev Admin', 'Full system administrator for development'
);

-- Coach Profile
INSERT INTO coach_profiles (
    coach_id, coach_code, legal_name, display_name, phone, email,
    teachable_programs, in_service_status, current_belt_level_id,
    certification_level, years_experience, hire_date
) VALUES (
    'dev-coach-001', 'DEV-C-001', 'Development Coach', 'Dev Coach', '+65 8766 8794', 'coach@dev.local',
    '["beginner", "intermediate", "advanced"]', 'active', 'black-3',
    'Master Instructor', 10, '2020-01-01'
);

-- Student Profile
INSERT INTO student_profiles (
    student_id, student_code, legal_name, display_name, name_normalized,
    date_of_birth, gender, primary_guardian_name, primary_guardian_phone,
    primary_guardian_email, address, postal_code
) VALUES (
    'dev-student-001', 'DEV-S-001', 'Development Student', 'Dev Student', 'development student',
    '2010-01-01', 'Male', 'Dev Guardian', '+65 8766 8794',
    'guardian@dev.local', '123 Development Street', '123456'
);

-- =====================================================
-- SAMPLE CLASSES (示例课程)
-- =====================================================
INSERT INTO classes (
    class_id, name, program_id, venue_id, coach_id,
    day_of_week, start_time, end_time, capacity, age_group, skill_level, description
) VALUES
('monday-tampines', 'Monday Classes', 'beginner', 'tampines', 'dev-coach-001',
 1, '20:00', '21:00', 30, 'All Ages', 'All Levels', 'Weekly taekwondo training sessions with focus on technique and discipline'),

('tuesday-compassvale', 'Tuesday Classes', 'intermediate', 'compassvale-a', 'dev-coach-001',
 2, '19:30', '20:30', 25, 'All Ages', 'All Levels', 'Mid-week training focusing on forms and sparring techniques'),

('thursday-compassvale', 'Thursday Classes', 'advanced', 'compassvale-b', 'dev-coach-001',
 4, '19:30', '21:00', 25, 'All Ages', 'All Levels', 'Extended training session with comprehensive skill development'),

('friday-fengshan-1', 'Friday Classes - Session 1', 'beginner', 'fengshan', 'dev-coach-001',
 5, '18:30', '20:00', 20, 'All Ages', 'Beginner', 'Friday fundamentals training'),

('friday-fengshan-2', 'Friday Classes - Session 2', 'advanced', 'fengshan', 'dev-coach-001',
 5, '20:00', '21:30', 20, 'All Ages', 'Advanced', 'Friday advanced training'),

('saturday-compassvale', 'Saturday Classes', 'adult', 'compassvale-c', 'dev-coach-001',
 6, '10:00', '11:30', 20, 'All Ages', 'All Levels', 'Weekend training sessions for all skill levels');

-- =====================================================
-- SAMPLE SESSIONS (示例会话)
-- =====================================================
INSERT INTO sessions (
    session_id, class_id, session_date, planned_start_time, planned_end_time, status
) VALUES
-- This week's sessions
('session-monday-2024-12-23', 'monday-tampines', '2024-12-23', '20:00', '21:00', 'scheduled'),
('session-tuesday-2024-12-24', 'tuesday-compassvale', '2024-12-24', '19:30', '20:30', 'scheduled'),
('session-thursday-2024-12-26', 'thursday-compassvale', '2024-12-26', '19:30', '21:00', 'scheduled'),
('session-friday-1-2024-12-27', 'friday-fengshan-1', '2024-12-27', '18:30', '20:00', 'scheduled'),
('session-friday-2-2024-12-27', 'friday-fengshan-2', '2024-12-27', '20:00', '21:30', 'scheduled'),
('session-saturday-2024-12-28', 'saturday-compassvale', '2024-12-28', '10:00', '11:30', 'scheduled'),

-- Next week's sessions
('session-monday-2024-12-30', 'monday-tampines', '2024-12-30', '20:00', '21:00', 'scheduled'),
('session-tuesday-2024-12-31', 'tuesday-compassvale', '2024-12-31', '19:30', '20:30', 'scheduled'),
('session-thursday-2025-01-02', 'thursday-compassvale', '2025-01-02', '19:30', '21:00', 'scheduled'),
('session-friday-1-2025-01-03', 'friday-fengshan-1', '2025-01-03', '18:30', '20:00', 'scheduled'),
('session-friday-2-2025-01-03', 'friday-fengshan-2', '2025-01-03', '20:00', '21:30', 'scheduled'),
('session-saturday-2025-01-04', 'saturday-compassvale', '2025-01-04', '10:00', '11:30', 'scheduled');

-- =====================================================
-- SAMPLE ENROLLMENTS (示例注册)
-- =====================================================
INSERT INTO enrollments (
    enrollment_id, student_id, class_id, status, join_at, first_activated_at, source
) VALUES
('enrollment-dev-student-monday', 'dev-student-001', 'monday-tampines', 'active', 
 '2024-12-01T00:00:00Z', '2024-12-01T00:00:00Z', 'direct_registration'),

('enrollment-dev-student-friday-1', 'dev-student-001', 'friday-fengshan-1', 'active',
 '2024-12-01T00:00:00Z', '2024-12-01T00:00:00Z', 'direct_registration');

-- =====================================================
-- SAMPLE STUDENT RANK HISTORY (示例学员等级历史)
-- =====================================================
INSERT INTO student_rank_history (
    history_id, student_id, rank_id, source, granted_on, granted_by, remarks
) VALUES
-- Dev student starts with white belt
('rank-history-dev-student-white', 'dev-student-001', 'white', 'join', '2024-12-01', 'System', 'Initial rank upon joining'),

-- Progress to yellow tip
('rank-history-dev-student-yellow-tip', 'dev-student-001', 'yellow-tip', 'internal_grading', '2024-12-15', 'Development Coach', 'Good progress in basic techniques');

-- =====================================================
-- SAMPLE ATTENDANCE (示例出勤)
-- =====================================================
INSERT INTO attendance (
    attendance_id, session_id, student_id, status, taken_by_coach_id, taken_at, arrival_time
) VALUES
('attendance-dev-student-monday-1223', 'session-monday-2024-12-23', 'dev-student-001', 'present', 
 'dev-coach-001', '2024-12-23T20:00:00Z', '19:55'),

('attendance-dev-student-friday-1227', 'session-friday-1-2024-12-27', 'dev-student-001', 'present',
 'dev-coach-001', '2024-12-27T18:30:00Z', '18:25');

-- =====================================================
-- SAMPLE GRADING EVENT (示例升级考试)
-- =====================================================
INSERT INTO grading_events (
    event_id, name, event_date, venue_id, fee, registration_start_date, registration_end_date,
    eligibility_rules, status
) VALUES
('grading-2025-q1', 'Q1 2025 Belt Grading', '2025-03-15', 'fengshan', 50.00, '2025-02-01', '2025-03-01',
 '{"min_classes": 15, "min_weeks": 8, "current_rank_required": true}', 'planned');

-- =====================================================
-- SAMPLE COMPETITION (示例比赛)
-- =====================================================
INSERT INTO competitions (
    competition_id, name, host_organization, start_date, end_date, main_venue_id,
    disciplines, fees, registration_deadline, status
) VALUES
('singapore-open-2025', 'Singapore Open Taekwondo Championship 2025', 'Singapore Taekwondo Federation',
 '2025-06-15', '2025-06-16', 'fengshan',
 '["Poomsae", "Sparring", "Breaking"]', '{"individual": 80, "team": 200}', '2025-05-15', 'planned');

-- =====================================================
-- SAMPLE DOCUMENT TEMPLATES (示例文档模板)
-- =====================================================
INSERT INTO document_templates (
    template_id, name, version, template_type, content_url, is_active, effective_from
) VALUES
('waiver-v1', 'Liability Waiver', '1.0', 'waiver', '/templates/waiver-v1.pdf', TRUE, '2024-01-01'),
('medical-v1', 'Medical Information Form', '1.0', 'medical', '/templates/medical-v1.pdf', TRUE, '2024-01-01'),
('media-release-v1', 'Media Release Form', '1.0', 'media_release', '/templates/media-release-v1.pdf', TRUE, '2024-01-01');

-- =====================================================
-- SAMPLE ANNOUNCEMENTS (示例公告)
-- =====================================================
INSERT INTO announcements (
    announcement_id, title, content, audience, created_by_user_id, status, published_at
) VALUES
('welcome-announcement', 'Welcome to Akira X Taekwondo!', 
 'Welcome to our martial arts family! We are excited to have you join us on your Taekwondo journey. Please make sure to complete all required forms and bring appropriate training attire to your first class.',
 'students', 'dev-admin-001', 'published', '2024-12-01T00:00:00Z'),

('holiday-schedule', 'Holiday Training Schedule',
 'Please note that our training schedule will be adjusted during the holiday period. Some classes may be cancelled or rescheduled. Please check with your instructor for specific details.',
 'all', 'dev-admin-001', 'published', '2024-12-20T00:00:00Z');
