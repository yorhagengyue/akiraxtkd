'use client';

import React from 'react';
import { Clock, MapPin, Users, UserCheck, AlertTriangle } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';
import CapacityBar from './CapacityBar';

interface SessionCardProps {
  session: {
    id: string;
    className: string;
    time: string;
    venue: string;
    plannedStudents: number;
    checkedInStudents: number;
    waitlistCount?: number;
    isOverCapacity?: boolean;
    hasNotes?: boolean;
    status: 'pending' | 'in_progress' | 'completed';
  };
  onTakeAttendance: (sessionId: string) => void;
  onQuickActions?: {
    markAllPresent: (sessionId: string) => void;
    markAllAbsent: (sessionId: string) => void;
  };
  className?: string;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onTakeAttendance,
  onQuickActions,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return designTokens.colors.success[500];
      case 'in_progress': return designTokens.colors.info[500];
      default: return designTokens.colors.warning[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 p-6 
        hover:shadow-md transition-all duration-200
        ${className}
      `}
      style={{ borderRadius: designTokens.borderRadius.card }}
    >
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 
              className="font-semibold text-gray-900 truncate"
              style={{ fontSize: designTokens.typography.scale.h4.size }}
            >
              {session.className}
            </h3>
            {session.hasNotes && (
              <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{session.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{session.venue}</span>
            </div>
          </div>
        </div>

        {/* 状态指示 */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${getStatusColor(session.status)}20`,
              color: getStatusColor(session.status),
            }}
          >
            {getStatusText(session.status)}
          </div>
        </div>
      </div>

      {/* 出勤信息 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {session.checkedInStudents}/{session.plannedStudents} checked in
            </span>
          </div>
          
          {session.waitlistCount > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              {session.waitlistCount} waitlist
            </span>
          )}
        </div>

        <CapacityBar
          current={session.checkedInStudents}
          capacity={session.plannedStudents}
          waitlist={session.waitlistCount || 0}
          size="sm"
          showLabels={false}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onTakeAttendance(session.id)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: designTokens.colors.primary[500],
            color: 'white',
            borderRadius: designTokens.borderRadius.button,
            minHeight: designTokens.components.density.buttonHeight,
          }}
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Take Attendance
        </button>

        {/* 快捷操作 */}
        {onQuickActions && session.status === 'pending' && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onQuickActions.markAllPresent(session.id)}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark all present"
            >
              <UserCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => onQuickActions.markAllAbsent(session.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Mark all absent"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 超容量警告 */}
      {session.isOverCapacity && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs text-red-700">
              Class is over capacity. Consider splitting or moving students to waitlist.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
