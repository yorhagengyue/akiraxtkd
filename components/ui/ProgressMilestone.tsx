'use client';

import React from 'react';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  completedDate?: string;
}

interface ProgressMilestoneProps {
  milestones: Milestone[];
  loading?: boolean;
  className?: string;
}

const ProgressMilestone: React.FC<ProgressMilestoneProps> = ({
  milestones,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedCount = milestones.filter(m => m.completed).length;
  const requiredCount = milestones.filter(m => m.required).length;
  const completedRequired = milestones.filter(m => m.completed && m.required).length;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Progress Milestones</h3>
          <p className="text-sm text-gray-600 mt-1">
            {completedCount} of {milestones.length} completed · {completedRequired} of {requiredCount} required
          </p>
        </div>
        
        {/* 进度环 */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            {/* 背景圆 */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={designTokens.colors.gray[200]}
              strokeWidth="4"
              fill="none"
            />
            {/* 进度圆 */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={designTokens.colors.primary[500]}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(completedCount / milestones.length) * 125.6} 125.6`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-900">
              {Math.round((completedCount / milestones.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 里程碑列表 */}
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="flex items-start space-x-3">
            {/* 状态图标 */}
            <div className="flex-shrink-0 mt-0.5">
              {milestone.completed ? (
                <CheckCircle 
                  className="w-6 h-6" 
                  style={{ color: designTokens.colors.success[500] }}
                />
              ) : milestone.required ? (
                <AlertTriangle 
                  className="w-6 h-6" 
                  style={{ color: designTokens.colors.warning[500] }}
                />
              ) : (
                <Circle 
                  className="w-6 h-6" 
                  style={{ color: designTokens.colors.gray[400] }}
                />
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-medium ${
                  milestone.completed ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {milestone.title}
                </h4>
                
                {milestone.required && !milestone.completed && (
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${designTokens.colors.warning[500]}20`,
                      color: designTokens.colors.warning[700],
                    }}
                  >
                    Required
                  </span>
                )}
                
                {milestone.completed && milestone.completedDate && (
                  <span className="text-xs text-gray-500">
                    {milestone.completedDate}
                  </span>
                )}
              </div>
              
              <p className={`text-sm ${
                milestone.completed ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 底部行动建议 */}
      {requiredCount > completedRequired && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                {requiredCount - completedRequired} required milestone{requiredCount - completedRequired !== 1 ? 's' : ''} remaining
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Complete these to be eligible for your next belt grading.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressMilestone;
