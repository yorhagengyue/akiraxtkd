/**
 * Mock Data for Dashboard Demonstrations
 * 为三个角色的 Dashboard 提供演示数据，与实际数据库环境分离
 */

// ========== Admin Dashboard Mock Data ==========
export const mockAdminData = {
  kpis: {
    activeStudents: 127,
    activeStudentsDelta: 8, // +8 this month
    occupancyRate: 0.82, // 82%
    occupancyDelta: 0.05, // +5%
    arOutstanding: 4250, // $4,250
    arDelta: -850, // -$850 (improved)
    attendanceThisWeek: 0.89, // 89%
    attendanceDelta: 0.03, // +3%
    upcomingSessionsToday: 6,
    upcomingEvents: 3, // gradings + competitions
  },
  
  riskAlerts: [
    {
      id: 'overdue_1',
      type: 'overdue_payment',
      severity: 'high',
      title: 'Payment Overdue',
      description: 'Sarah Chen - $180 overdue for 3 weeks',
      studentId: 'student_sarah_001',
      amount: 180,
      daysOverdue: 21,
      action: 'Send final notice'
    },
    {
      id: 'capacity_1',
      type: 'over_capacity',
      severity: 'medium',
      title: 'Class Over Capacity',
      description: 'Junior Tigers (Mon 6PM) - 18/15 students',
      classId: 'class_junior_tigers',
      currentCapacity: 18,
      maxCapacity: 15,
      action: 'Consider splitting class'
    },
    {
      id: 'attendance_1',
      type: 'low_attendance',
      severity: 'medium',
      title: 'Consecutive Absences',
      description: 'Marcus Wong - missed 4 sessions in a row',
      studentId: 'student_marcus_001',
      missedSessions: 4,
      action: 'Contact parent'
    },
    {
      id: 'grading_1',
      type: 'grading_deadline',
      severity: 'low',
      title: 'Grading Requirements Not Met',
      description: '3 students need 2+ sessions before next grading',
      count: 3,
      deadline: '2025-09-15',
      action: 'Review eligibility'
    }
  ],
  
  recentActivities: [
    {
      id: 'activity_1',
      type: 'enrollment',
      timestamp: '2025-08-24T10:30:00Z',
      description: 'Emma Liu enrolled in Adult Beginners',
      details: { studentName: 'Emma Liu', className: 'Adult Beginners', fee: 120 }
    },
    {
      id: 'activity_2',
      type: 'payment',
      timestamp: '2025-08-24T09:15:00Z',
      description: 'Payment received from David Park - $240',
      details: { studentName: 'David Park', amount: 240, method: 'Card' }
    },
    {
      id: 'activity_3',
      type: 'grading_result',
      timestamp: '2025-08-23T16:45:00Z',
      description: 'Grading results uploaded for Yellow Belt test',
      details: { eventName: 'Yellow Belt Grading', candidates: 8, passed: 7 }
    },
    {
      id: 'activity_4',
      type: 'class_cancelled',
      timestamp: '2025-08-23T14:20:00Z',
      description: 'Advanced Sparring cancelled due to instructor illness',
      details: { className: 'Advanced Sparring', date: '2025-08-24', reason: 'Instructor illness' }
    }
  ],
  
  studentOverview: [
    {
      id: 'student_001',
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      belt: { color: 'yellow', stripes: 1 },
      age: 12,
      enrolledClasses: 2,
      attendanceRate: 0.92,
      lastAttendance: '2025-08-23',
      status: 'active',
      nextGrading: '2025-09-15',
      outstandingFees: 0
    },
    {
      id: 'student_002',
      name: 'Sarah Kim',
      email: 'sarah.kim@email.com',
      belt: { color: 'green', stripes: 0 },
      age: 15,
      enrolledClasses: 1,
      attendanceRate: 0.88,
      lastAttendance: '2025-08-22',
      status: 'active',
      nextGrading: '2025-10-20',
      outstandingFees: 0
    },
    {
      id: 'student_003',
      name: 'Marcus Wong',
      email: 'marcus.wong@email.com',
      belt: { color: 'white', stripes: 2 },
      age: 8,
      enrolledClasses: 1,
      attendanceRate: 0.65,
      lastAttendance: '2025-08-15',
      status: 'at_risk',
      nextGrading: null,
      outstandingFees: 120
    },
    {
      id: 'student_004',
      name: 'Emma Liu',
      email: 'emma.liu@email.com',
      belt: { color: 'white', stripes: 0 },
      age: 28,
      enrolledClasses: 1,
      attendanceRate: 1.0,
      lastAttendance: '2025-08-23',
      status: 'active',
      nextGrading: '2025-09-15',
      outstandingFees: 0
    }
  ]
};

// ========== Coach Dashboard Mock Data ==========
export const mockCoachData = {
  kpis: {
    todaySessions: 4,
    attendancePending: 2, // 2 classes need attendance taken
    enrollmentChanges: {
      added: 3,
      removed: 1,
      net: 2
    },
    readyForGrading: 5 // 5 students ready for next grading
  },
  
  todaySessions: [
    {
      id: 'session_1',
      className: 'Junior Tigers',
      time: '16:00',
      duration: '1h',
      location: 'Main Dojang',
      enrolledCount: 15,
      expectedCount: 13,
      checkedInCount: 0,
      status: 'upcoming',
      notes: 'Focus on poomsae practice',
      attendanceStatus: 'pending'
    },
    {
      id: 'session_2',
      className: 'Teen Advanced',
      time: '17:30',
      duration: '1h 30min',
      location: 'Main Dojang',
      enrolledCount: 12,
      expectedCount: 11,
      checkedInCount: 0,
      status: 'upcoming',
      notes: 'Sparring tournament prep',
      attendanceStatus: 'pending'
    },
    {
      id: 'session_3',
      className: 'Adult Beginners',
      time: '19:00',
      duration: '1h',
      location: 'Training Room B',
      enrolledCount: 8,
      expectedCount: 7,
      checkedInCount: 0,
      status: 'upcoming',
      notes: 'Basic kicks review',
      attendanceStatus: 'pending'
    },
    {
      id: 'session_4',
      className: 'Black Belt Club',
      time: '20:30',
      duration: '1h',
      location: 'Main Dojang',
      enrolledCount: 6,
      expectedCount: 6,
      checkedInCount: 0,
      status: 'upcoming',
      notes: 'Leadership training',
      attendanceStatus: 'pending'
    }
  ],
  
  studentRoster: [
    {
      id: 'student_001',
      name: 'Alex Chen',
      belt: { color: 'yellow', stripes: 1 },
      age: 12,
      classes: ['Junior Tigers', 'Little Dragons'],
      attendanceRate: 0.92,
      recentAttendance: [true, true, false, true, true], // last 5 sessions
      nextGrading: '2025-09-15',
      notes: 'Excellent progress in forms',
      status: 'active',
      gradingEligible: true
    },
    {
      id: 'student_002',
      name: 'Sarah Kim',
      belt: { color: 'green', stripes: 0 },
      age: 15,
      classes: ['Teen Advanced'],
      attendanceRate: 0.88,
      recentAttendance: [true, true, true, false, true],
      nextGrading: '2025-10-20',
      notes: 'Strong sparring skills, needs poomsae work',
      status: 'active',
      gradingEligible: false
    },
    {
      id: 'student_003',
      name: 'David Park',
      belt: { color: 'blue', stripes: 2 },
      age: 17,
      classes: ['Teen Advanced', 'Black Belt Club'],
      attendanceRate: 0.95,
      recentAttendance: [true, true, true, true, true],
      nextGrading: '2025-11-10',
      notes: 'Leadership potential, helping junior students',
      status: 'active',
      gradingEligible: true
    },
    {
      id: 'student_004',
      name: 'Emma Liu',
      belt: { color: 'white', stripes: 0 },
      age: 28,
      classes: ['Adult Beginners'],
      attendanceRate: 1.0,
      recentAttendance: [true, true, true, true, true],
      nextGrading: '2025-09-15',
      notes: 'New student, very motivated',
      status: 'active',
      gradingEligible: true
    },
    {
      id: 'student_005',
      name: 'Marcus Wong',
      belt: { color: 'white', stripes: 2 },
      age: 8,
      classes: ['Little Dragons'],
      attendanceRate: 0.65,
      recentAttendance: [false, false, false, false, true],
      nextGrading: null,
      notes: 'Attendance issues, contact parents',
      status: 'at_risk',
      gradingEligible: false
    }
  ]
};

// ========== Student Dashboard Mock Data ==========
export const mockStudentData = {
  nextSession: {
    id: 'session_next_001',
    className: 'Teen Advanced',
    date: '2025-08-24',
    time: '17:30',
    location: 'Main Dojang',
    instructor: 'Master Kim',
    checkinWindow: '17:15 - 17:35',
    equipmentReminder: 'Bring sparring gear for tournament prep',
    status: 'today' as const,
    canRequestLeave: true
  },
  
  thisWeekSessions: [
    {
      id: 'session_week_1',
      className: 'Teen Advanced',
      date: '2025-08-24',
      time: '17:30',
      location: 'Main Dojang',
      instructor: 'Master Kim',
      status: 'today',
      hasLeaveRequest: null
    },
    {
      id: 'session_week_2',
      className: 'Teen Advanced',
      date: '2025-08-26',
      time: '17:30',
      location: 'Main Dojang',
      instructor: 'Master Kim',
      status: 'upcoming',
      hasLeaveRequest: null
    },
    {
      id: 'session_week_3',
      className: 'Black Belt Club',
      date: '2025-08-28',
      time: '20:30',
      location: 'Main Dojang',
      instructor: 'Master Kim',
      status: 'upcoming',
      hasLeaveRequest: null
    }
  ],
  
  competitions: [
    {
      id: 'comp_001',
      name: 'Singapore Open Championships',
      date: '2025-10-15',
      location: 'Singapore Sports Centre',
      registrationDeadline: '2025-09-15',
      divisions: ['Teen Sparring', 'Teen Poomsae'],
      fee: 80,
      status: 'registration_open',
      myRegistration: null
    },
    {
      id: 'comp_002',
      name: 'Inter-Academy Tournament',
      date: '2025-11-20',
      location: 'Akira X Taekwondo',
      registrationDeadline: '2025-10-20',
      divisions: ['All Ages Poomsae'],
      fee: 50,
      status: 'registration_open',
      myRegistration: null
    }
  ],
  
  announcements: [
    {
      id: 'ann_001',
      title: 'Tournament Preparation Classes',
      content: 'Extra sparring sessions every Saturday 2-4 PM leading up to Singapore Open',
      date: '2025-08-23',
      priority: 'high',
      read: false,
      author: 'Master Kim',
      targetAudience: 'competition_team'
    },
    {
      id: 'ann_002',
      title: 'Grading Schedule Released',
      content: 'Next belt grading will be held on September 15th. Check your eligibility status.',
      date: '2025-08-22',
      priority: 'medium',
      read: true,
      author: 'Admin',
      targetAudience: 'all_students'
    },
    {
      id: 'ann_003',
      title: 'New Uniform Policy',
      content: 'All students must wear academy uniform during classes. Available at reception.',
      date: '2025-08-20',
      priority: 'medium',
      read: true,
      author: 'Admin',
      targetAudience: 'all_students'
    }
  ],
  
  billing: [
    {
      id: 'invoice_001',
      invoiceNumber: 'INV-2025-001234',
      description: 'Monthly Training Fee - September 2025',
      amount: 120,
      dueDate: '2025-09-01',
      status: 'pending',
      items: [
        { description: 'Teen Advanced Classes (8 sessions)', amount: 100 },
        { description: 'Black Belt Club (4 sessions)', amount: 20 }
      ]
    }
  ],
  
  notificationPreferences: {
    channel: 'email',
    nextSession24h: true,
    nextSession2h: false,
    competitionDeadline: true,
    announcementNew: true,
    invoiceDue: true
  },
  
  studentProfile: {
    id: 'student_demo_001',
    name: 'Demo Student',
    email: 'student@akiraxtkd.com',
    belt: { color: 'green', stripes: 0 },
    joinDate: '2024-01-15',
    attendanceRate: 0.88,
    totalSessions: 156,
    nextGrading: '2025-10-20',
    classes: ['Teen Advanced', 'Black Belt Club']
  }
};

// ========== Utility Functions ==========
export function getRandomMockData(role: 'admin' | 'coach' | 'student') {
  switch (role) {
    case 'admin':
      return mockAdminData;
    case 'coach':
      return mockCoachData;
    case 'student':
      return mockStudentData;
    default:
      return null;
  }
}

// Helper function to simulate API delay
export function simulateApiDelay(ms: number = 800): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to check if we should use mock data
export function shouldUseMockData(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true';
}
