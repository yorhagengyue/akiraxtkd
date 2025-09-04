-- Akira X Taekwondo Seed Data
-- Initial data for development and testing

-- Insert demo user accounts
INSERT INTO user_accounts (user_id, email, role, status, display_name, provider, demo_password, email_verified, login_count) VALUES
('demo_admin_001', 'admin@akiraxtkd.com', 'admin', 'active', 'Demo Admin', 'dev', 'admin123', TRUE, 1),
('demo_coach_001', 'coach@akiraxtkd.com', 'coach', 'active', 'Demo Coach', 'dev', 'coach123', TRUE, 1),
('demo_student_001', 'student@akiraxtkd.com', 'student', 'active', 'Demo Student', 'dev', 'student123', TRUE, 1);

-- Insert belt levels (Taekwondo progression)
INSERT INTO belt_levels (belt_name, belt_color, level_order, description, requirements) VALUES
('White Belt', '#e5e7eb', 1, 'Beginner level - Learning basic stances and movements', 'Basic stances, simple kicks, respect and discipline'),
('Yellow Belt', '#fbbf24', 2, 'Elementary level - Basic techniques and forms', 'Taeguek Il Jang, basic kicks, breaking techniques'),
('Yellow Belt with Green Tip', '#fbbf24', 3, 'Intermediate elementary - Enhanced basic skills', 'Taeguek E Jang, improved kicking techniques'),
('Green Belt', '#22c55e', 4, 'Intermediate level - Advanced techniques and sparring', 'Taeguek Sam Jang, sparring techniques, board breaking'),
('Green Belt with Blue Tip', '#22c55e', 5, 'Advanced intermediate - Complex combinations', 'Taeguek Sa Jang, advanced sparring, leadership skills'),
('Blue Belt', '#3b82f6', 6, 'Advanced level - Mastery of intermediate techniques', 'Taeguek O Jang, advanced combinations, teaching assistance'),
('Blue Belt with Red Tip', '#3b82f6', 7, 'Pre-advanced level - Preparation for red belt', 'Taeguek Yuk Jang, competition readiness, mentoring'),
('Red Belt', '#ef4444', 8, 'Senior level - Advanced mastery and leadership', 'Taeguek Chil Jang, tournament participation, teaching'),
('Red Belt with Black Tip', '#ef4444', 9, 'Pre-black belt - Final preparation for black belt', 'Taeguek Pal Jang, advanced sparring, leadership demonstration'),
('Black Belt (1st Dan)', '#1f2937', 10, 'Expert level - Beginning of mastery', 'All Taeguek forms, advanced techniques, teaching capability');

-- Insert locations
INSERT INTO locations (location_name, address, postal_code, contact_person, contact_phone, facilities, status) VALUES
('Tampines Training Center', '604 Tampines Avenue 9', '520604', 'Jasterfer Kellen', '+65 8766 8794', 'Air-conditioned, Matted floor, Changing rooms, Water dispenser', 'Active'),
('Compassvale Center', '211C Compassvale Lane', '540211', 'Assistant Coach', '+65 8766 8794', 'Matted floor, Changing rooms, Parking available', 'Active'),
('Compassvale Drive Center', '217C Compassvale Drive', '540217', 'Assistant Coach', '+65 8766 8794', 'Large training area, Air-conditioned, Parking', 'Active'),
('Fengshan Community Center', 'Bedok North Street 2', '460001', 'Community Manager', '+65 6000 0000', 'Multi-purpose hall, Parking, Public transport nearby', 'Active'),
('Compassvale Lane Center', '207A Compassvale Lane', '540207', 'Assistant Coach', '+65 8766 8794', 'Matted floor, Good lighting, Changing rooms', 'Active');

-- Insert instructors
INSERT INTO instructors (first_name, last_name, email, phone, certifications, specializations, bio, status) VALUES
('Jasterfer', 'Kellen', 'jasterfer@akiraxtkd.com', '+65 8766 8794', 'NROC Certified Coach,Taekwondo Kyorugi Referee,Taekwondo Poomsae Referee,First-Aid Certified,MOE Certified Coach,NCAP Technical Level 2', 'Traditional Taekwondo,Competition Training,Youth Development', 'Head instructor with over 15 years of experience in Taekwondo. Specializes in traditional forms and competitive sparring.', 'Active'),
('Assistant', 'Coach', 'assistant@akiraxtkd.com', '+65 8000 0000', 'Certified Assistant Instructor,First-Aid Certified', 'Beginner Training,Forms Practice', 'Experienced assistant instructor focusing on beginner development and forms practice.', 'Active');

-- Insert students
INSERT INTO students (student_code, first_name, last_name, date_of_birth, gender, phone, email, address, postal_code, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, joined_date, status, current_belt_id, notes) VALUES
('AXT2024001', 'Alex', 'Chen', '2010-05-15', 'Male', '+65 8123 4567', 'alex.chen@example.com', '123 Main Street', '123456', 'Linda Chen', '+65 8765 4321', 'Mother', '2024-01-15', 'Active', 4, 'Excellent student with great potential'),
('AXT2024002', 'Sarah', 'Wong', '2012-08-22', 'Female', '+65 8234 5678', 'sarah.wong@example.com', '456 Oak Avenue', '654321', 'David Wong', '+65 8876 5432', 'Father', '2024-02-01', 'Active', 2, 'Very dedicated and hardworking'),
('AXT2024003', 'Michael', 'Tan', '2011-03-10', 'Male', '+65 8345 6789', 'michael.tan@example.com', '789 Pine Road', '789012', 'Jennifer Tan', '+65 8987 6543', 'Mother', '2024-01-20', 'Active', 4, 'Shows good leadership qualities'),
('AXT2024004', 'Emily', 'Lim', '2013-11-05', 'Female', '+65 8456 7890', 'emily.lim@example.com', '321 Birch Lane', '321654', 'Robert Lim', '+65 8098 7654', 'Father', '2024-03-01', 'Active', 3, 'Quick learner with excellent technique'),
('AXT2024005', 'Daniel', 'Ng', '2009-07-18', 'Male', '+65 8567 8901', 'daniel.ng@example.com', '654 Cedar Street', '654987', 'Grace Ng', '+65 8109 8765', 'Mother', '2024-01-10', 'Active', 6, 'Advanced student ready for competition'),
('AXT2024006', 'Sophia', 'Lee', '2014-02-28', 'Female', '+65 8678 9012', 'sophia.lee@example.com', '987 Maple Drive', '987321', 'Kevin Lee', '+65 8210 9876', 'Father', '2024-04-15', 'Active', 1, 'New student with enthusiasm to learn'),
('AXT2024007', 'Ryan', 'Teo', '2010-12-03', 'Male', '+65 8789 0123', 'ryan.teo@example.com', '147 Elm Street', '147258', 'Michelle Teo', '+65 8321 0987', 'Mother', '2024-02-20', 'Active', 3, 'Consistent attendance and good progress'),
('AXT2024008', 'Chloe', 'Koh', '2012-09-14', 'Female', '+65 8890 1234', 'chloe.koh@example.com', '258 Willow Avenue', '258369', 'James Koh', '+65 8432 1098', 'Father', '2024-03-15', 'Active', 2, 'Excellent in forms and patterns');

-- Insert classes
INSERT INTO classes (class_name, description, instructor_id, location_id, day_of_week, start_time, end_time, max_capacity, age_group, belt_requirements, monthly_fee, status) VALUES
('Monday Evening Class', 'Technical training and belt progression for all levels', 1, 1, 'Monday', '20:00', '21:00', 30, 'All Ages', 'All Levels', 120.00, 'Active'),
('Tuesday Evening Session', 'Poomsae practice and sparring techniques', 2, 2, 'Tuesday', '19:30', '20:30', 25, 'All Ages', 'All Levels', 110.00, 'Active'),
('Thursday Extended Practice', 'Extended practice session and competition preparation', 1, 3, 'Thursday', '19:30', '21:00', 25, 'All Ages', 'Green Belt and Above', 130.00, 'Active'),
('Friday Beginner Session', 'Fundamentals and technique development for beginners', 2, 4, 'Friday', '18:30', '20:00', 20, 'Children (6-12)', 'White to Green Belt', 100.00, 'Active'),
('Friday Advanced Training', 'Advanced training and competition preparation', 1, 4, 'Friday', '20:00', '21:30', 15, 'Teens & Adults', 'Blue Belt and Above', 150.00, 'Active'),
('Saturday Morning Class', 'Weekend training for all skill levels', 1, 5, 'Saturday', '09:00', '10:30', 30, 'All Ages', 'All Levels', 120.00, 'Active');

-- Insert class enrollments
INSERT INTO class_enrollments (student_id, class_id, enrollment_date, status) VALUES
-- Monday Evening Class enrollments
(1, 1, '2024-01-15', 'Active'),
(2, 1, '2024-02-01', 'Active'),
(3, 1, '2024-01-20', 'Active'),
(4, 1, '2024-03-01', 'Active'),
(7, 1, '2024-02-20', 'Active'),

-- Thursday Extended Practice (Green belt and above)
(1, 3, '2024-03-01', 'Active'),
(3, 3, '2024-02-01', 'Active'),
(5, 3, '2024-01-15', 'Active'),

-- Friday Beginner Session
(6, 4, '2024-04-15', 'Active'),
(8, 4, '2024-03-15', 'Active'),

-- Friday Advanced Training (Blue belt and above)
(5, 5, '2024-02-01', 'Active'),

-- Saturday Morning Class
(1, 6, '2024-02-01', 'Active'),
(2, 6, '2024-02-15', 'Active'),
(4, 6, '2024-03-15', 'Active'),
(6, 6, '2024-04-20', 'Active'),
(7, 6, '2024-03-01', 'Active'),
(8, 6, '2024-04-01', 'Active');

-- Insert sample attendance records (last 2 weeks)
INSERT INTO attendance_records (student_id, class_id, attendance_date, status, arrival_time, notes) VALUES
-- Monday Evening Class (Class ID: 1) - December 16, 2024
(1, 1, '2024-12-16', 'Present', '20:00', NULL),
(2, 1, '2024-12-16', 'Late', '20:10', 'Traffic jam'),
(3, 1, '2024-12-16', 'Absent', NULL, 'Sick'),
(4, 1, '2024-12-16', 'Present', '19:55', NULL),
(7, 1, '2024-12-16', 'Present', '20:05', NULL),

-- Monday Evening Class - December 9, 2024
(1, 1, '2024-12-09', 'Present', '20:00', NULL),
(2, 1, '2024-12-09', 'Present', '19:58', NULL),
(3, 1, '2024-12-09', 'Present', '20:02', NULL),
(4, 1, '2024-12-09', 'Late', '20:15', 'School activity ran late'),
(7, 1, '2024-12-09', 'Present', '20:00', NULL),

-- Thursday Extended Practice (Class ID: 3) - December 12, 2024
(1, 3, '2024-12-12', 'Present', '19:30', NULL),
(3, 3, '2024-12-12', 'Present', '19:25', NULL),
(5, 3, '2024-12-12', 'Present', '19:35', NULL),

-- Thursday Extended Practice - December 5, 2024
(1, 3, '2024-12-05', 'Present', '19:30', NULL),
(3, 3, '2024-12-05', 'Late', '19:45', 'Transport delay'),
(5, 3, '2024-12-05', 'Present', '19:28', NULL),

-- Saturday Morning Class (Class ID: 6) - December 14, 2024
(1, 6, '2024-12-14', 'Present', '09:00', NULL),
(2, 6, '2024-12-14', 'Present', '08:58', NULL),
(4, 6, '2024-12-14', 'Present', '09:02', NULL),
(6, 6, '2024-12-14', 'Present', '09:00', NULL),
(7, 6, '2024-12-14', 'Absent', NULL, 'Family event'),
(8, 6, '2024-12-14', 'Present', '09:05', NULL),

-- Saturday Morning Class - December 7, 2024
(1, 6, '2024-12-07', 'Present', '09:00', NULL),
(2, 6, '2024-12-07', 'Present', '09:03', NULL),
(4, 6, '2024-12-07', 'Present', '08:55', NULL),
(6, 6, '2024-12-07', 'Late', '09:15', 'Overslept'),
(7, 6, '2024-12-07', 'Present', '09:00', NULL),
(8, 6, '2024-12-07', 'Present', '09:02', NULL);

-- Insert belt promotion history
INSERT INTO belt_promotions (student_id, from_belt_id, to_belt_id, promotion_date, examiner, notes) VALUES
-- Alex Chen progression
(1, 1, 2, '2024-03-15', 'Jasterfer Kellen', 'Good progress in basics'),
(1, 2, 3, '2024-06-15', 'Jasterfer Kellen', 'Improved techniques and forms'),
(1, 3, 4, '2024-09-15', 'Jasterfer Kellen', 'Excellent performance in grading'),

-- Sarah Wong progression
(2, 1, 2, '2024-04-01', 'Jasterfer Kellen', 'Consistent improvement'),

-- Michael Tan progression
(3, 1, 2, '2024-03-20', 'Jasterfer Kellen', 'Strong fundamentals'),
(3, 2, 3, '2024-06-20', 'Jasterfer Kellen', 'Good sparring skills'),
(3, 3, 4, '2024-10-01', 'Jasterfer Kellen', 'Leadership qualities emerging'),

-- Emily Lim progression
(4, 1, 2, '2024-05-01', 'Jasterfer Kellen', 'Quick learner'),
(4, 2, 3, '2024-08-01', 'Jasterfer Kellen', 'Excellent technique'),

-- Daniel Ng progression (advanced student)
(5, 1, 2, '2024-02-10', 'Jasterfer Kellen', 'Prior experience evident'),
(5, 2, 3, '2024-04-10', 'Jasterfer Kellen', 'Rapid progression'),
(5, 3, 4, '2024-06-10', 'Jasterfer Kellen', 'Advanced techniques mastered'),
(5, 4, 5, '2024-08-10', 'Jasterfer Kellen', 'Competition ready'),
(5, 5, 6, '2024-11-10', 'Jasterfer Kellen', 'Excellent leadership and skills'),

-- Ryan Teo progression
(7, 1, 2, '2024-04-20', 'Jasterfer Kellen', 'Steady progress'),
(7, 2, 3, '2024-07-20', 'Jasterfer Kellen', 'Good attendance paying off'),

-- Chloe Koh progression
(8, 1, 2, '2024-05-15', 'Jasterfer Kellen', 'Excellent in patterns');
