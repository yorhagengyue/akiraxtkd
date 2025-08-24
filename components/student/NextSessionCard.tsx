'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface NextSession {
  id: string;
  className: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  checkinWindow: string; // "30 minutes before class"
  equipmentReminder: string; // "Bring your belt and protective gear"
  status: 'upcoming' | 'today' | 'in_progress';
  canRequestLeave: boolean;
  hasLeaveRequest?: {
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
  };
}

interface NextSessionCardProps {
  session: NextSession | null;
  loading?: boolean;
  onRequestLeave: (sessionId: string) => void;
  onFindMakeup: () => void;
  onAddToCalendar: (sessionId: string) => void;
  className?: string;
}

const NextSessionCard: React.FC<NextSessionCardProps> = ({
  session,
  loading = false,
  onRequestLeave,
  onFindMakeup,
  onAddToCalendar,
  className = ''
}) => {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex space-x-3 mt-6">
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center ${className}`}>
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
        <p className="text-gray-600 mb-6">
          Looking for another day? Find a class that fits your schedule.
        </p>
        <button
          onClick={onFindMakeup}
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors"
          style={{
            backgroundColor: designTokens.colors.primary[500],
            borderRadius: designTokens.borderRadius.button,
          }}
        >
          Find a Class
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'today': return designTokens.colors.warning[500];
      case 'in_progress': return designTokens.colors.success[500];
      default: return designTokens.colors.info[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'today': return 'Today';
      case 'in_progress': return 'In Progress';
      default: return 'Upcoming';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Next Session</h3>
        <div className="flex items-center space-x-2">
          <div
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${getStatusColor(session.status)}20`,
              color: getStatusColor(session.status),
            }}
          >
            {getStatusText(session.status)}
          </div>
        </div>
      </div>

      {/* 请假状态提示 */}
      {session.hasLeaveRequest && (
        <div className={`mb-4 p-3 rounded-lg border ${
          session.hasLeaveRequest.status === 'approved' 
            ? 'bg-green-50 border-green-200' 
            : session.hasLeaveRequest.status === 'rejected'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            {session.hasLeaveRequest.status === 'approved' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
            <span className={`text-sm font-medium ${
              session.hasLeaveRequest.status === 'approved' 
                ? 'text-green-800' 
                : session.hasLeaveRequest.status === 'rejected'
                ? 'text-red-800'
                : 'text-yellow-800'
            }`}>
              Leave request {session.hasLeaveRequest.status}
              {session.hasLeaveRequest.status === 'pending' && ' - Your coach will be notified'}
            </span>
          </div>
        </div>
      )}

      {/* 课程信息 */}
      <div className="space-y-3 mb-6">
        <h4 className="text-lg font-semibold text-gray-900">{session.className}</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium">{session.date}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="w-5 h-5 text-gray-500" />
            <span>{session.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>{session.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="w-5 h-5 text-gray-500" />
            <span>{session.instructor}</span>
          </div>
        </div>
      </div>

      {/* 提醒信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-blue-800">
              <strong>Check-in:</strong> {session.checkinWindow}
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-blue-800">
              <strong>Remember:</strong> {session.equipmentReminder}
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => session.canRequestLeave && !session.hasLeaveRequest && onRequestLeave(session.id)}
          disabled={!session.canRequestLeave || !!session.hasLeaveRequest}
          className={`
            inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${session.canRequestLeave && !session.hasLeaveRequest
              ? 'text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-200'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }
          `}
          style={{ borderRadius: designTokens.borderRadius.button }}
        >
          {session.hasLeaveRequest ? 'Leave Requested' : 'Request Leave'}
        </button>

        <button
          onClick={onFindMakeup}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200 rounded-lg transition-colors"
          style={{ borderRadius: designTokens.borderRadius.button }}
        >
          Find Make-up
        </button>

        <button
          onClick={() => onAddToCalendar(session.id)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors"
          style={{ borderRadius: designTokens.borderRadius.button }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Calendar
        </button>
      </div>
    </div>
  );
};

export default NextSessionCard;
