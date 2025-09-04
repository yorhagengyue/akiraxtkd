/**
 * Data Table Component
 * 可复用的数据表格组件，支持排序、分页、筛选
 */

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { LoadingTable } from './Loading';
import { EmptySearchResults } from './EmptyStates';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSortChange?: (field: string, order: 'ASC' | 'DESC') => void;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  rowKey?: string | ((record: T) => string);
  className?: string;
  emptyText?: string;
  onRowClick?: (record: T, index: number) => void;
  rowSelection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
}

export function DataTable<T = any>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onSortChange,
  sortField,
  sortOrder,
  rowKey = 'id',
  className = '',
  emptyText,
  onRowClick,
  rowSelection
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record as any)[rowKey] || index.toString();
  };

  const handleSort = (field: string) => {
    if (!onSortChange) return;
    
    let newOrder: 'ASC' | 'DESC' = 'ASC';
    if (sortField === field && sortOrder === 'ASC') {
      newOrder = 'DESC';
    }
    
    onSortChange(field, newOrder);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;
    
    if (checked) {
      const allKeys = data.map((record, index) => getRowKey(record, index));
      setSelectedRows(allKeys);
      rowSelection.onChange(allKeys, data);
    } else {
      setSelectedRows([]);
      rowSelection.onChange([], []);
    }
  };

  const handleSelectRow = (recordKey: string, record: T, checked: boolean) => {
    if (!rowSelection) return;
    
    let newSelectedRows: string[];
    if (checked) {
      newSelectedRows = [...selectedRows, recordKey];
    } else {
      newSelectedRows = selectedRows.filter(key => key !== recordKey);
    }
    
    setSelectedRows(newSelectedRows);
    const selectedRecords = data.filter((item, index) => 
      newSelectedRows.includes(getRowKey(item, index))
    );
    rowSelection.onChange(newSelectedRows, selectedRecords);
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable || !onSortChange) return null;
    
    const isActive = sortField === column.key;
    const iconClass = `h-4 w-4 ml-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`;
    
    if (isActive && sortOrder === 'DESC') {
      return <ChevronDown className={iconClass} />;
    }
    
    return <ChevronUp className={iconClass} />;
  };

  if (loading) {
    return <LoadingTable className={className} />;
  }

  const hasData = data && data.length > 0;
  const showPagination = pagination && pagination.total > 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {rowSelection && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {hasData ? data.map((record, index) => {
              const recordKey = getRowKey(record, index);
              const isSelected = selectedRows.includes(recordKey);
              
              return (
                <tr
                  key={recordKey}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${isSelected ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {rowSelection && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(recordKey, record, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => {
                    const value = column.dataIndex ? (record as any)[column.dataIndex] : record;
                    const cellContent = column.render 
                      ? column.render(value, record, index)
                      : value;
                    
                    return (
                      <td
                        key={column.key}
                        className={`
                          px-4 py-3 text-sm text-gray-900
                          ${column.align === 'center' ? 'text-center' : ''}
                          ${column.align === 'right' ? 'text-right' : ''}
                        `}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)} className="px-4 py-12">
                  {emptyText ? (
                    <div className="text-center text-gray-500">{emptyText}</div>
                  ) : (
                    <EmptySearchResults />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.has_prev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.has_next}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span>{' '}
                  results
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className="relative inline-flex items-center p-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                
                <button
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="relative inline-flex items-center p-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
