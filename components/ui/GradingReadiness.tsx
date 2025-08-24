'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface ReadinessCheck {
  id: string;
  requirement: string;
  status: 'met' | 'not_met' | 'pending';
  details: string;
  actionText?: string;
  actionUrl?: string;
}

interface GradingReadinessProps {
  checks: ReadinessCheck[];
  nextGradingDate?: string;
  isEligible: boolean;
  loading?: boolean;
  onFindClass?: () => void;
  onViewRules?: () => void;
  className?: string;
}

const GradingReadiness: React.FC<GradingReadinessProps> = ({
  checks,
  nextGradingDate,
  isEligible,
  loading = false,
  onFindClass,
  onViewRules,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metCount = checks.filter(c => c.status === 'met').length;
  const pendingCount = checks.filter(c => c.status === 'pending').length;
  const notMetCount = checks.filter(c => c.status === 'not_met').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return <CheckCircle className="w-5 h-5" style={{ color: designTokens.colors.success[500] }} />;
      case 'pending':
        return <Clock className="w-5 h-5" style={{ color: designTokens.colors.warning[500] }} />;
      default:
        return <XCircle className="w-5 h-5" style={{ color: designTokens.colors.danger[500] }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return designTokens.colors.success[700];
      case 'pending': return designTokens.colors.warning[700];
      default: return designTokens.colors.danger[700];
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Grading Readiness</h3>
          <p className="text-sm text-gray-600 mt-1">
            {metCount} of {checks.length} requirements met
            {nextGradingDate && (
              <> · Next grading: {nextGradingDate}</>
            )}
          </p>
        </div>
        
        {/* 整体状态 */}
        <div className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${isEligible 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
          }
        `}>
          {isEligible ? 'Eligible' : 'Not Ready'}
        </div>
      </div>

      {/* 要求清单 */}
      <div className="space-y-4">
        {checks.map((check) => (
          <div key={check.id} className="flex items-start space-x-3">
            {/* 状态图标 */}
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(check.status)}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 
                  className="font-medium"
                  style={{ color: getStatusColor(check.status) }}
                >
                  {check.requirement}
                </h4>
                
                {check.actionText && check.actionUrl && (
                  <button
                    onClick={() => window.open(check.actionUrl, '_blank')}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {check.actionText}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {check.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 底部行动建议 */}
      {!isEligible && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                {notMetCount > 0 ? 'Complete missing requirements' : 'Almost ready!'}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {notMetCount > 0 
                  ? `You need to complete ${notMetCount} more requirement${notMetCount !== 1 ? 's' : ''} before grading.`
                  : `${pendingCount} requirement${pendingCount !== 1 ? 's' : ''} pending completion.`
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {onFindClass && (
                <button
                  onClick={onFindClass}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Find a Class
                </button>
              )}
              
              {onViewRules && (
                <button
                  onClick={onViewRules}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  View Rules
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 成功状态 */}
      {isEligible && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Ready for Grading!
              </p>
              <p className="text-sm text-green-700 mt-1">
                You've met all requirements. Contact your instructor to schedule your grading.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingReadiness;
