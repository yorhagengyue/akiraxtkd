/**
 * Filter Bar Component
 * 统一的筛选条件组件
 */

import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'search' | 'date' | 'daterange';
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: any;
}

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  className?: string;
}

export function FilterBar({ 
  filters, 
  values, 
  onChange, 
  onReset,
  className = '' 
}: FilterBarProps) {
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

  const toggleFilter = (key: string) => {
    setExpandedFilters(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const hasActiveFilters = Object.values(values).some(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key];

    switch (filter.type) {
      case 'search':
        return (
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <div className="relative">
            <select
              value={value || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">{filter.placeholder || `All ${filter.label}`}</option>
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        const isExpanded = expandedFilters.includes(filter.key);
        
        return (
          <div className="relative">
            <button
              onClick={() => toggleFilter(filter.key)}
              className="flex items-center justify-between w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="truncate">
                {selectedValues.length > 0 
                  ? `${filter.label} (${selectedValues.length})`
                  : filter.placeholder || filter.label
                }
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {isExpanded && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filter.options?.map(option => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...selectedValues, option.value]
                            : selectedValues.filter(v => v !== option.value);
                          onChange(filter.key, newValue);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-900 flex-1">
                        {option.label}
                        {option.count !== undefined && (
                          <span className="text-gray-500 ml-1">({option.count})</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'daterange':
        const [startDate, endDate] = Array.isArray(value) ? value : ['', ''];
        return (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onChange(filter.key, [e.target.value, endDate])}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onChange(filter.key, [startDate, e.target.value])}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {filters.map(filter => (
          <div key={filter.key} className="flex flex-col">
            {filter.type !== 'search' && (
              <label className="text-xs font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
            )}
            {renderFilter(filter)}
          </div>
        ))}
        
        {hasActiveFilters && onReset && (
          <button
            onClick={onReset}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// 预定义的筛选配置
export const studentFilters: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'search',
    placeholder: 'Search students...'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' }
    ]
  },
  {
    key: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' }
    ]
  },
  {
    key: 'belt_level_id',
    label: 'Belt Level',
    type: 'select',
    options: [
      { label: 'White Belt', value: '1' },
      { label: 'Yellow Belt', value: '2' },
      { label: 'Green Belt', value: '3' },
      { label: 'Blue Belt', value: '4' },
      { label: 'Red Belt', value: '5' },
      { label: 'Black Belt', value: '6' }
    ]
  }
];

export const classFilters: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'search',
    placeholder: 'Search classes...'
  },
  {
    key: 'day_of_week',
    label: 'Day',
    type: 'multiselect',
    options: [
      { label: 'Monday', value: 'Monday' },
      { label: 'Tuesday', value: 'Tuesday' },
      { label: 'Wednesday', value: 'Wednesday' },
      { label: 'Thursday', value: 'Thursday' },
      { label: 'Friday', value: 'Friday' },
      { label: 'Saturday', value: 'Saturday' },
      { label: 'Sunday', value: 'Sunday' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' }
    ]
  }
];

export const attendanceFilters: FilterConfig[] = [
  {
    key: 'date_range',
    label: 'Date Range',
    type: 'daterange'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { label: 'Present', value: 'Present' },
      { label: 'Late', value: 'Late' },
      { label: 'Absent', value: 'Absent' }
    ]
  }
];
