'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, AlertTriangle, Clock } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';
import BeltChip from './BeltChip';
import EmptyState from './EmptyState';

interface Student {
  id: string;
  name: string;
  currentBelt: string;
  lastAttendance: string;
  attendanceStreak: number;
  classCount: number;
  notes?: string;
  hasRisk?: boolean;
  riskType?: 'injury' | 'absence' | 'payment';
}

interface RosterTableProps {
  students: Student[];
  loading?: boolean;
  onViewStudent: (studentId: string) => void;
  className?: string;
}

const RosterTable: React.FC<RosterTableProps> = ({
  students,
  loading = false,
  onViewStudent,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBelt, setFilterBelt] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  // 筛选逻辑
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBelt = filterBelt === 'all' || student.currentBelt.toLowerCase().includes(filterBelt.toLowerCase());
    const matchesRisk = filterRisk === 'all' || 
      (filterRisk === 'risk' && student.hasRisk) ||
      (filterRisk === 'no-risk' && !student.hasRisk);
    
    return matchesSearch && matchesBelt && matchesRisk;
  });

  const getRiskIcon = (riskType?: string) => {
    switch (riskType) {
      case 'injury': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'absence': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'payment': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getRiskText = (riskType?: string) => {
    switch (riskType) {
      case 'injury': return 'Injury reported';
      case 'absence': return 'Extended absence';
      case 'payment': return 'Payment overdue';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {/* 头部和筛选 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ 
                borderRadius: designTokens.borderRadius.button,
                minHeight: designTokens.components.density.inputHeight 
              }}
            />
          </div>

          {/* 腰带筛选 */}
          <select
            value={filterBelt}
            onChange={(e) => setFilterBelt(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ borderRadius: designTokens.borderRadius.button }}
          >
            <option value="all">All Belts</option>
            <option value="white">White</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
            <option value="red">Red</option>
            <option value="black">Black</option>
          </select>

          {/* 风险筛选 */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ borderRadius: designTokens.borderRadius.button }}
          >
            <option value="all">All Students</option>
            <option value="risk">With Risks</option>
            <option value="no-risk">No Risks</option>
          </select>
        </div>
      </div>

      {/* 表格内容 */}
      <div className="p-6">
        {filteredStudents.length > 0 ? (
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                style={{ minHeight: designTokens.components.density.tableRowHeight }}
              >
                {/* 学员信息 */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      {student.hasRisk && getRiskIcon(student.riskType)}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <BeltChip belt={student.currentBelt} size="sm" />
                      {student.hasRisk && (
                        <span className="text-xs text-red-600">
                          {getRiskText(student.riskType)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.lastAttendance}
                    </div>
                    <div className="text-xs text-gray-500">Last Attended</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.attendanceStreak}
                    </div>
                    <div className="text-xs text-gray-500">Streak</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.classCount}
                    </div>
                    <div className="text-xs text-gray-500">Classes</div>
                  </div>

                  {/* 操作按钮 */}
                  <button
                    onClick={() => onViewStudent(student.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search />}
            title="No Students Found"
            description={
              searchQuery || filterBelt !== 'all' || filterRisk !== 'all'
                ? "Try adjusting your search or filters"
                : "Students will appear here once assigned to your classes"
            }
          />
        )}
      </div>
    </div>
  );
};

export default RosterTable;
