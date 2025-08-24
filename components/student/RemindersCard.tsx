'use client';

import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Settings } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface ReminderSettings {
  nextSession24h: boolean;
  nextSession2h: boolean;
  competitionDeadline: boolean;
  announcementNew: boolean;
  invoiceDue: boolean;
  channel: 'email' | 'whatsapp' | 'both';
}

interface RemindersCardProps {
  settings: ReminderSettings;
  loading?: boolean;
  onUpdateSettings: (settings: ReminderSettings) => void;
  className?: string;
}

const RemindersCard: React.FC<RemindersCardProps> = ({
  settings,
  loading = false,
  onUpdateSettings,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key: keyof ReminderSettings, value: boolean | string) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      case 'both': return 'Email & WhatsApp';
      default: return 'Email';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900">Reminders</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 简化视图 */}
      {!isExpanded && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Next session reminders</span>
            <div className="flex items-center space-x-1">
              {localSettings.nextSession24h && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">24h</span>
              )}
              {localSettings.nextSession2h && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">2h</span>
              )}
              {!localSettings.nextSession24h && !localSettings.nextSession2h && (
                <span className="text-xs text-gray-500">Off</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Notification method</span>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {getChannelIcon(localSettings.channel)}
              <span>{getChannelLabel(localSettings.channel)}</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            Customize settings →
          </button>
        </div>
      )}

      {/* 详细设置 */}
      {isExpanded && (
        <div className="space-y-4">
          {/* 通知渠道选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'email', label: 'Email', icon: Mail },
                { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                { value: 'both', label: 'Both', icon: Bell }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleToggle('channel', value)}
                  className={`
                    flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${localSettings.channel === value
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                  style={{ borderRadius: designTokens.borderRadius.button }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 提醒类型开关 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Reminder Types
            </label>
            
            <div className="space-y-3">
              {[
                {
                  key: 'nextSession24h' as const,
                  label: '24 hours before next session',
                  description: 'Get reminded the day before your class'
                },
                {
                  key: 'nextSession2h' as const,
                  label: '2 hours before next session',
                  description: 'Last-minute reminder to prepare for class'
                },
                {
                  key: 'competitionDeadline' as const,
                  label: 'Competition registration deadlines',
                  description: 'Never miss a registration deadline'
                },
                {
                  key: 'announcementNew' as const,
                  label: 'New announcements',
                  description: 'Stay updated with academy news'
                },
                {
                  key: 'invoiceDue' as const,
                  label: 'Invoice due dates',
                  description: 'Payment reminders and due dates'
                }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <button
                      onClick={() => handleToggle(key, !localSettings[key])}
                      className={`
                        relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none
                        ${localSettings[key] 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300'
                        }
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${localSettings[key] ? 'translate-x-5' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full text-sm text-gray-600 hover:text-gray-700 font-medium py-2"
            >
              ← Back to summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersCard;
