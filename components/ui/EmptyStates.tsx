/**
 * Empty State Components
 * 统一的空状态组件
 */

import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Search, 
  Plus, 
  BookOpen,
  Award,
  Clock,
  UserCheck
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className={`
            inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${action.variant === 'secondary' 
              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
              : 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }
          `}
        >
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </button>
      )}
    </div>
  );
}

// 预定义的空状态组件
export function EmptyStudents({ onAddStudent }: { onAddStudent?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-gray-400" />}
      title="No students found"
      description="Get started by adding your first student to the academy."
      action={onAddStudent ? {
        label: 'Add Student',
        onClick: onAddStudent
      } : undefined}
    />
  );
}

export function EmptyClasses({ onAddClass }: { onAddClass?: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-gray-400" />}
      title="No classes scheduled"
      description="Create your first class to start organizing training sessions."
      action={onAddClass ? {
        label: 'Add Class',
        onClick: onAddClass
      } : undefined}
    />
  );
}

export function EmptyAttendance({ onRecordAttendance }: { onRecordAttendance?: () => void }) {
  return (
    <EmptyState
      icon={<UserCheck className="h-8 w-8 text-gray-400" />}
      title="No attendance records"
      description="Start tracking student attendance by recording your first session."
      action={onRecordAttendance ? {
        label: 'Record Attendance',
        onClick: onRecordAttendance
      } : undefined}
    />
  );
}

export function EmptySearchResults({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-gray-400" />}
      title="No results found"
      description={searchTerm 
        ? `No results found for "${searchTerm}". Try adjusting your search terms.`
        : "Try adjusting your search terms or filters."
      }
    />
  );
}

export function EmptyBelts({ onAddBelt }: { onAddBelt?: () => void }) {
  return (
    <EmptyState
      icon={<Award className="h-8 w-8 text-gray-400" />}
      title="No belt levels configured"
      description="Set up your belt ranking system by adding belt levels."
      action={onAddBelt ? {
        label: 'Add Belt Level',
        onClick: onAddBelt
      } : undefined}
    />
  );
}

export function EmptyEvents() {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-gray-400" />}
      title="No upcoming events"
      description="There are no scheduled events at the moment. Check back later for updates."
    />
  );
}

export function EmptyReports({ onCreateReport }: { onCreateReport?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-gray-400" />}
      title="No reports available"
      description="Generate your first report to analyze academy performance and student progress."
      action={onCreateReport ? {
        label: 'Create Report',
        onClick: onCreateReport
      } : undefined}
    />
  );
}

export function EmptyLessons({ onAddLesson }: { onAddLesson?: () => void }) {
  return (
    <EmptyState
      icon={<BookOpen className="h-8 w-8 text-gray-400" />}
      title="No lessons planned"
      description="Start building your curriculum by adding lesson plans and training materials."
      action={onAddLesson ? {
        label: 'Add Lesson',
        onClick: onAddLesson
      } : undefined}
    />
  );
}

export function EmptyHistory() {
  return (
    <EmptyState
      icon={<Clock className="h-8 w-8 text-gray-400" />}
      title="No history available"
      description="Activity history will appear here as students engage with the system."
    />
  );
}

// 通用的列表空状态
export function EmptyList({ 
  resource, 
  onAdd 
}: { 
  resource: string; 
  onAdd?: () => void;
}) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-gray-400" />}
      title={`No ${resource.toLowerCase()} found`}
      description={`You haven't created any ${resource.toLowerCase()} yet. Get started by adding your first one.`}
      action={onAdd ? {
        label: `Add ${resource}`,
        onClick: onAdd
      } : undefined}
    />
  );
}
