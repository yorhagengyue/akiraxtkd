'use client';

import React from 'react';
import { Calendar, Search, MessageSquare, Clock } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  onRequestLeave: () => void;
  onFindMakeup: () => void;
  onViewClasses: () => void;
  onContactCoach: () => void;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onRequestLeave,
  onFindMakeup,
  onViewClasses,
  onContactCoach,
  className = ''
}) => {
  const actions: QuickAction[] = [
    {
      id: 'request_leave',
      label: 'Request Leave',
      description: 'Apply for absence from upcoming sessions',
      icon: Clock,
      color: 'orange',
      onClick: onRequestLeave
    },
    {
      id: 'find_makeup',
      label: 'Find Make-up',
      description: 'Search for alternative class sessions',
      icon: Search,
      color: 'blue',
      onClick: onFindMakeup
    },
    {
      id: 'view_classes',
      label: 'My Classes',
      description: 'View your enrolled classes and schedule',
      icon: Calendar,
      color: 'green',
      onClick: onViewClasses
    },
    {
      id: 'contact_coach',
      label: 'Contact Coach',
      description: 'Send a message to your instructor',
      icon: MessageSquare,
      color: 'purple',
      onClick: onContactCoach
    }
  ];

  const getColorConfig = (color: string) => {
    const colors = {
      orange: {
        bg: `${designTokens.colors.warning[500]}20`,
        text: designTokens.colors.warning[700],
        hover: `${designTokens.colors.warning[500]}30`,
        icon: designTokens.colors.warning[600]
      },
      blue: {
        bg: `${designTokens.colors.info[500]}20`,
        text: designTokens.colors.info[700],
        hover: `${designTokens.colors.info[500]}30`,
        icon: designTokens.colors.info[600]
      },
      green: {
        bg: `${designTokens.colors.success[500]}20`,
        text: designTokens.colors.success[700],
        hover: `${designTokens.colors.success[500]}30`,
        icon: designTokens.colors.success[600]
      },
      purple: {
        bg: '#8b5cf620',
        text: '#7c3aed',
        hover: '#8b5cf630',
        icon: '#8b5cf6'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Actions</h3>
        <p className="text-sm text-gray-600">
          Common tasks and shortcuts for students
        </p>
      </div>

      {/* 操作网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const colorConfig = getColorConfig(action.color);
          const IconComponent = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                group p-4 rounded-xl border transition-all duration-200 text-left
                ${action.disabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
              style={{
                borderRadius: designTokens.borderRadius.card,
                backgroundColor: action.disabled ? undefined : colorConfig.bg,
              }}
              onMouseEnter={(e) => {
                if (!action.disabled) {
                  e.currentTarget.style.backgroundColor = colorConfig.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!action.disabled) {
                  e.currentTarget.style.backgroundColor = colorConfig.bg;
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: action.disabled ? designTokens.colors.gray[300] : colorConfig.icon + '20',
                  }}
                >
                  <IconComponent 
                    className="w-5 h-5" 
                    style={{ 
                      color: action.disabled ? designTokens.colors.gray[500] : colorConfig.icon 
                    }} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold mb-1 ${
                    action.disabled ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {action.label}
                  </h4>
                  <p className={`text-sm ${
                    action.disabled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
              
              {!action.disabled && (
                <div className="mt-3 flex justify-end">
                  <span 
                    className="text-xs font-medium group-hover:underline"
                    style={{ color: colorConfig.text }}
                  >
                    Go →
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 底部提示 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Need help with something else? Contact the academy office or your instructor.
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
