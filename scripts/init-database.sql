-- Akira X Taekwondo Database Schema
-- Cloudflare D1 Database Initialization Script

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS belt_promotions;
DROP TABLE IF EXISTS attendance_records;
DROP TABLE IF EXISTS class_enrollments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS instructors;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS belt_levels;
DROP TABLE IF EXISTS user_accounts;

-- Create user_accounts table (for authentication)
CREATE TABLE user_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    google_id TEXT,
    firebase_uid TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'coach', 'admin')) DEFAULT 'student',
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    display_name TEXT,
    photo_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'email', 'dev')) DEFAULT 'email',
    last_login_at DATETIME,
    login_count INTEGER DEFAULT 0,
    terms_accepted_at DATETIME,
    privacy_accepted_at DATETIME,
    demo_password TEXT, -- For demo accounts only
    password_hash TEXT, -- For email authentication
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create belt_levels table
CREATE TABLE belt_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    belt_name TEXT NOT NULL UNIQUE,
    belt_color TEXT NOT NULL, -- Hex color code
    level_order INTEGER NOT NULL UNIQUE,
    description TEXT,
    requirements TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create locations table
CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_name TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    facilities TEXT,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create instructors table
CREATE TABLE instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    certifications TEXT, -- JSON or comma-separated
    specializations TEXT,
    bio TEXT,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    phone TEXT,
    email TEXT,
    address TEXT,
    postal_code TEXT,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    joined_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Suspended')) DEFAULT 'Active',
    current_belt_id INTEGER NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_belt_id) REFERENCES belt_levels(id)
);

-- Create classes table
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL,
    description TEXT,
    instructor_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    age_group TEXT,
    belt_requirements TEXT,
    monthly_fee DECIMAL(10,2) NOT NULL CHECK (monthly_fee >= 0),
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    CHECK (start_time < end_time)
);

-- Create class_enrollments table (many-to-many relationship between students and classes)
CREATE TABLE class_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    enrollment_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Paused', 'Completed', 'Cancelled')) DEFAULT 'Active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(student_id, class_id) -- Prevent duplicate enrollments
);

-- Create attendance_records table
CREATE TABLE attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Absent')),
    arrival_time TIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(student_id, class_id, attendance_date) -- Prevent duplicate attendance records
);

-- Create belt_promotions table (track belt progression history)
CREATE TABLE belt_promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    from_belt_id INTEGER NOT NULL,
    to_belt_id INTEGER NOT NULL,
    promotion_date DATE NOT NULL,
    examiner TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (from_belt_id) REFERENCES belt_levels(id),
    FOREIGN KEY (to_belt_id) REFERENCES belt_levels(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_belt ON students(current_belt_id);
CREATE INDEX idx_students_joined_date ON students(joined_date);
CREATE INDEX idx_students_code ON students(student_code);

CREATE INDEX idx_classes_day_time ON classes(day_of_week, start_time);
CREATE INDEX idx_classes_instructor ON classes(instructor_id);
CREATE INDEX idx_classes_location ON classes(location_id);
CREATE INDEX idx_classes_status ON classes(status);

CREATE INDEX idx_enrollments_student ON class_enrollments(student_id);
CREATE INDEX idx_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_enrollments_status ON class_enrollments(status);

CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, attendance_date);
CREATE INDEX idx_attendance_class_date ON attendance_records(class_id, attendance_date);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_status ON attendance_records(status);

CREATE INDEX idx_promotions_student ON belt_promotions(student_id);
CREATE INDEX idx_promotions_date ON belt_promotions(promotion_date);

CREATE INDEX idx_user_accounts_email ON user_accounts(email);
CREATE INDEX idx_user_accounts_user_id ON user_accounts(user_id);
CREATE INDEX idx_user_accounts_role ON user_accounts(role);

-- Create triggers to update the updated_at timestamp
CREATE TRIGGER update_students_timestamp 
    AFTER UPDATE ON students
BEGIN
    UPDATE students SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_classes_timestamp 
    AFTER UPDATE ON classes
BEGIN
    UPDATE classes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_enrollments_timestamp 
    AFTER UPDATE ON class_enrollments
BEGIN
    UPDATE class_enrollments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_attendance_timestamp 
    AFTER UPDATE ON attendance_records
BEGIN
    UPDATE attendance_records SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_promotions_timestamp 
    AFTER UPDATE ON belt_promotions
BEGIN
    UPDATE belt_promotions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_user_accounts_timestamp 
    AFTER UPDATE ON user_accounts
BEGIN
    UPDATE user_accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger to automatically update student's current belt when promoted
CREATE TRIGGER update_student_belt_on_promotion
    AFTER INSERT ON belt_promotions
BEGIN
    UPDATE students 
    SET current_belt_id = NEW.to_belt_id, updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.student_id;
END;
