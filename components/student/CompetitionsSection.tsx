'use client';

import React from 'react';
import { Trophy, Calendar, MapPin, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  registrationDeadline: string;
  daysUntilDeadline: number;
  status: 'open' | 'closing_soon' | 'closed' | 'completed';
  description?: string;
  eligibleDivisions: string[];
}

interface MyRegistration {
  id: string;
  competitionName: string;
  division: string;
  status: 'pending' | 'confirmed' | 'withdrawn' | 'completed';
  registrationDate: string;
  weighInRequired: boolean;
  weighInDate?: string;
  checkInTime?: string;
  notes?: string;
}

interface CompetitionsSectionProps {
  competitions: Competition[];
  myRegistrations: MyRegistration[];
  loading?: boolean;
  onViewCompetition: (competitionId: string) => void;
  onRegister: (competitionId: string) => void;
  onViewRegistration: (registrationId: string) => void;
  className?: string;
}

const CompetitionsSection: React.FC<CompetitionsSectionProps> = ({
  competitions,
  myRegistrations,
  loading = false,
  onViewCompetition,
  onRegister,
  onViewRegistration,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Competition Notices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Registrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(1)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCompetitionStatusConfig = (status: string, daysUntilDeadline: number) => {
    if (status === 'closed' || status === 'completed') {
      return {
        bg: `${designTokens.colors.gray[500]}20`,
        text: designTokens.colors.gray[700],
        label: status === 'closed' ? 'Registration Closed' : 'Completed'
      };
    }
    
    if (daysUntilDeadline <= 3) {
      return {
        bg: `${designTokens.colors.danger[500]}20`,
        text: designTokens.colors.danger[700],
        label: `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
      };
    }
    
    if (daysUntilDeadline <= 7) {
      return {
        bg: `${designTokens.colors.warning[500]}20`,
        text: designTokens.colors.warning[700],
        label: `${daysUntilDeadline} days left`
      };
    }
    
    return {
      bg: `${designTokens.colors.success[500]}20`,
      text: designTokens.colors.success[700],
      label: 'Open for Registration'
    };
  };

  const getRegistrationStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: `${designTokens.colors.success[500]}20`,
          text: designTokens.colors.success[700],
          label: 'Confirmed',
          icon: CheckCircle
        };
      case 'withdrawn':
        return {
          bg: `${designTokens.colors.gray[500]}20`,
          text: designTokens.colors.gray[700],
          label: 'Withdrawn',
          icon: AlertTriangle
        };
      case 'completed':
        return {
          bg: `${designTokens.colors.info[500]}20`,
          text: designTokens.colors.info[700],
          label: 'Completed',
          icon: Trophy
        };
      default:
        return {
          bg: `${designTokens.colors.warning[500]}20`,
          text: designTokens.colors.warning[700],
          label: 'Pending',
          icon: Clock
        };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Competition Notices */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Competition Notices</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upcoming competitions and registration deadlines
            </p>
          </div>
          <Trophy className="w-6 h-6 text-orange-500" />
        </div>

        {competitions.length > 0 ? (
          <div className="space-y-4">
            {competitions.map((competition) => {
              const statusConfig = getCompetitionStatusConfig(competition.status, competition.daysUntilDeadline);
              
              return (
                <div
                  key={competition.id}
                  className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                  style={{ borderRadius: designTokens.borderRadius.button }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{competition.name}</h4>
                        <div
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: statusConfig.bg,
                            color: statusConfig.text,
                          }}
                        >
                          {statusConfig.label}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{competition.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{competition.location}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Registration deadline:</span> {competition.registrationDeadline}
                      </div>
                      
                      {competition.eligibleDivisions.length > 0 && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Eligible divisions:</span> {competition.eligibleDivisions.join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onViewCompetition(competition.id)}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        style={{ borderRadius: designTokens.borderRadius.button }}
                      >
                        View
                      </button>
                      
                      {competition.status === 'open' && (
                        <button
                          onClick={() => onRegister(competition.id)}
                          className="px-3 py-1 text-xs font-medium text-white rounded-lg transition-colors"
                          style={{
                            backgroundColor: designTokens.colors.primary[500],
                            borderRadius: designTokens.borderRadius.button,
                          }}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming competitions</p>
            <p className="text-sm text-gray-400 mt-1">
              Competition notices will appear here when available
            </p>
          </div>
        )}
      </div>

      {/* My Registrations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">My Registrations</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your competition registrations and status
            </p>
          </div>
          <Users className="w-6 h-6 text-blue-500" />
        </div>

        {myRegistrations.length > 0 ? (
          <div className="space-y-3">
            {myRegistrations.map((registration) => {
              const statusConfig = getRegistrationStatusConfig(registration.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={registration.id}
                  className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors cursor-pointer"
                  style={{ borderRadius: designTokens.borderRadius.button }}
                  onClick={() => onViewRegistration(registration.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{registration.competitionName}</h4>
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
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium">Division:</span> {registration.division}</div>
                        <div><span className="font-medium">Registered:</span> {registration.registrationDate}</div>
                        
                        {registration.weighInRequired && registration.weighInDate && (
                          <div className="text-orange-600">
                            <span className="font-medium">Weigh-in required:</span> {registration.weighInDate}
                          </div>
                        )}
                        
                        {registration.checkInTime && (
                          <div className="text-blue-600">
                            <span className="font-medium">Check-in time:</span> {registration.checkInTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No registrations yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Register for competitions to track your participation here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionsSection;
