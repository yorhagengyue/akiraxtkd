'use client';

import React from 'react';
import { Calendar, Clock, MapPin, User, Award, Trophy, Plus } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface Event {
  id: string;
  title: string;
  type: 'class' | 'grading' | 'competition' | 'workshop';
  date: string;
  time: string;
  location: string;
  instructor?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'full';
  description?: string;
}

interface EventCardProps {
  event: Event;
  onAddToCalendar?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onAddToCalendar,
  onViewDetails,
  className = ''
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return <Calendar className="w-4 h-4" />;
      case 'grading': return <Award className="w-4 h-4" />;
      case 'competition': return <Trophy className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return designTokens.colors.info[500];
      case 'grading': return designTokens.colors.warning[500];
      case 'competition': return designTokens.colors.success[500];
      default: return designTokens.colors.gray[500];
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { 
          bg: `${designTokens.colors.success[500]}20`, 
          text: designTokens.colors.success[700], 
          label: 'Confirmed' 
        };
      case 'pending':
        return { 
          bg: `${designTokens.colors.warning[500]}20`, 
          text: designTokens.colors.warning[700], 
          label: 'Pending' 
        };
      case 'cancelled':
        return { 
          bg: `${designTokens.colors.danger[500]}20`, 
          text: designTokens.colors.danger[700], 
          label: 'Cancelled' 
        };
      case 'full':
        return { 
          bg: `${designTokens.colors.gray[500]}20`, 
          text: designTokens.colors.gray[700], 
          label: 'Full' 
        };
      default:
        return { 
          bg: `${designTokens.colors.gray[500]}20`, 
          text: designTokens.colors.gray[700], 
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(event.status);

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 p-6 
        hover:shadow-md transition-all duration-200
        ${className}
      `}
      style={{ borderRadius: designTokens.borderRadius.card }}
    >
      {/* 头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: `${getTypeColor(event.type)}20`,
              color: getTypeColor(event.type)
            }}
          >
            {getTypeIcon(event.type)}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-600 capitalize">{event.type}</p>
          </div>
        </div>

        {/* 状态标签 */}
        <div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: statusConfig.bg,
            color: statusConfig.text,
          }}
        >
          {statusConfig.label}
        </div>
      </div>

      {/* 详细信息 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        
        {event.instructor && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{event.instructor}</span>
          </div>
        )}
      </div>

      {/* 描述 */}
      {event.description && (
        <p className="text-sm text-gray-600 mb-4">
          {event.description}
        </p>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center space-x-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(event.id)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            style={{ borderRadius: designTokens.borderRadius.button }}
          >
            View Details
          </button>
        )}
        
        {onAddToCalendar && event.status !== 'cancelled' && (
          <button
            onClick={() => onAddToCalendar(event.id)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            style={{ borderRadius: designTokens.borderRadius.button }}
            title="Add to Calendar"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 特殊状态提示 */}
      {event.status === 'cancelled' && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">
            This event has been cancelled. Check with your instructor for updates.
          </p>
        </div>
      )}
      
      {event.status === 'full' && event.type === 'class' && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-700">
            This class is full. You may be added to the waitlist.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventCard;
