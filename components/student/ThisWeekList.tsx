'use client';

import React from 'react';
import { Calendar, Clock, MapPin, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface WeekSession {
  id: string;
  className: string;
  date: string;
  dayName: string;
  time: string;
  location: string;
  instructor: string;
  status: 'upcoming' | 'today' | 'completed' | 'absent' | 'leave_requested' | 'makeup';
  canRequestLeave: boolean;
  leaveRequest?: {
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
  };
}

interface ThisWeekListProps {
  sessions: WeekSession[];
  loading?: boolean;
  onRequestLeave: (sessionId: string) => void;
  onViewDetails: (sessionId: string) => void;
  className?: string;
}

const ThisWeekList: React.FC<ThisWeekListProps> = ({
  sessions,
  loading = false,
  onRequestLeave,
  onViewDetails,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: `${designTokens.colors.success[500]}20`,
          text: designTokens.colors.success[700],
          label: 'Attended',
          icon: CheckCircle
        };
      case 'absent':
        return {
          bg: `${designTokens.colors.danger[500]}20`,
          text: designTokens.colors.danger[700],
          label: 'Absent',
          icon: XCircle
        };
      case 'leave_requested':
        return {
          bg: `${designTokens.colors.warning[500]}20`,
          text: designTokens.colors.warning[700],
          label: 'Leave Requested',
          icon: AlertTriangle
        };
      case 'makeup':
        return {
          bg: `${designTokens.colors.info[500]}20`,
          text: designTokens.colors.info[700],
          label: 'Make-up',
          icon: Calendar
        };
      case 'today':
        return {
          bg: `${designTokens.colors.warning[500]}20`,
          text: designTokens.colors.warning[700],
          label: 'Today',
          icon: Clock
        };
      default:
        return {
          bg: `${designTokens.colors.gray[500]}20`,
          text: designTokens.colors.gray[700],
          label: 'Upcoming',
          icon: Calendar
        };
    }
  };

  const isPastSession = (status: string) => {
    return ['completed', 'absent'].includes(status);
  };

  const canRequestLeave = (session: WeekSession) => {
    return session.canRequestLeave && 
           !isPastSession(session.status) && 
           session.status !== 'leave_requested' &&
           !session.leaveRequest;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">This Week</h3>
        <p className="text-sm text-gray-600">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      {/* 课程列表 */}
      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => {
            const statusConfig = getStatusConfig(session.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={session.id}
                className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                style={{ borderRadius: designTokens.borderRadius.button }}
              >
                <div className="flex items-start justify-between">
                  {/* 课程信息 */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{session.className}</h4>
                      <div
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.text,
                        }}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{session.dayName}, {session.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{session.instructor}</span>
                      </div>
                    </div>

                    {/* 请假状态详情 */}
                    {session.leaveRequest && (
                      <div className="mt-2 text-xs text-gray-500">
                        Leave request ({session.leaveRequest.reason}): {session.leaveRequest.status}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-4">
                    {canRequestLeave(session) && (
                      <button
                        onClick={() => onRequestLeave(session.id)}
                        className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                        style={{ borderRadius: designTokens.borderRadius.button }}
                      >
                        Request Leave
                      </button>
                    )}
                    
                    <button
                      onClick={() => onViewDetails(session.id)}
                      className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      style={{ borderRadius: designTokens.borderRadius.button }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No sessions this week</p>
          <p className="text-sm text-gray-400">
            Looking for other time slots? Check your class schedule or find make-up sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default ThisWeekList;
