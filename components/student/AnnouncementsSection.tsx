'use client';

import React, { useState } from 'react';
import { Bell, MessageSquare, Eye, Filter, CheckCircle } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'class' | 'competition' | 'billing' | 'emergency';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  author: string;
  publishedAt: string;
  isRead: boolean;
  audience: string; // "All Students", "Advanced Class", etc.
  hasAttachment?: boolean;
}

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  loading?: boolean;
  onReadAnnouncement: (announcementId: string) => void;
  onOpenAnnouncement: (announcementId: string) => void;
  className?: string;
}

const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  loading = false,
  onReadAnnouncement,
  onOpenAnnouncement,
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'class'>('all');

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'emergency':
        return {
          bg: `${designTokens.colors.danger[500]}20`,
          text: designTokens.colors.danger[700],
          label: 'Emergency'
        };
      case 'competition':
        return {
          bg: `${designTokens.colors.warning[500]}20`,
          text: designTokens.colors.warning[700],
          label: 'Competition'
        };
      case 'class':
        return {
          bg: `${designTokens.colors.info[500]}20`,
          text: designTokens.colors.info[700],
          label: 'Class'
        };
      case 'billing':
        return {
          bg: `${designTokens.colors.success[500]}20`,
          text: designTokens.colors.success[700],
          label: 'Billing'
        };
      default:
        return {
          bg: `${designTokens.colors.gray[500]}20`,
          text: designTokens.colors.gray[700],
          label: 'General'
        };
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    switch (filter) {
      case 'unread':
        return !announcement.isRead;
      case 'class':
        return announcement.type === 'class';
      default:
        return true;
    }
  });

  const unreadCount = announcements.filter(a => !a.isRead).length;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Announcements</h3>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6 text-blue-500" />
          {unreadCount > 0 && (
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: designTokens.colors.danger[500] }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* 筛选器 */}
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <div className="flex items-center space-x-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'class', label: 'My Classes' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                filter === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ borderRadius: designTokens.borderRadius.button }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 公告列表 */}
      {filteredAnnouncements.length > 0 ? (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => {
            const typeConfig = getTypeConfig(announcement.type);
            const priorityColor = getPriorityIndicator(announcement.priority);
            
            return (
              <div
                key={announcement.id}
                className={`
                  border rounded-lg p-4 transition-all duration-200 cursor-pointer
                  ${announcement.isRead 
                    ? 'border-gray-100 hover:border-gray-200 bg-white' 
                    : 'border-blue-200 hover:border-blue-300 bg-blue-50'
                  }
                `}
                style={{ borderRadius: designTokens.borderRadius.button }}
                onClick={() => onOpenAnnouncement(announcement.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* 优先级指示器 */}
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${priorityColor}`}></div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${
                        announcement.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {announcement.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2 ml-2">
                        <div
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: typeConfig.bg,
                            color: typeConfig.text,
                          }}
                        >
                          {typeConfig.label}
                        </div>
                      </div>
                    </div>

                    <p className={`text-sm line-clamp-2 mb-2 ${
                      announcement.isRead ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {announcement.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span>{announcement.publishedAt}</span>
                        <span>•</span>
                        <span>{announcement.audience}</span>
                        {announcement.hasAttachment && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">📎 Attachment</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {!announcement.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReadAnnouncement(announcement.id);
                            }}
                            className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark as read
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAnnouncement(announcement.id);
                          }}
                          className="inline-flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-700 font-medium"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {filter === 'unread' ? 'No unread messages' : 
             filter === 'class' ? 'No class announcements' : 
             'No announcements'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === 'all' 
              ? 'Announcements will appear here when posted'
              : 'Try changing the filter to see more messages'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsSection;
